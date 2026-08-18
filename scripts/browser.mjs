/**
 * Where Chromium actually is, and how it reaches the network.
 *
 * Two environment problems, both of which look like a broken script rather than
 * a broken environment:
 *
 * **The binary.** Playwright resolves its browser by a build number baked into
 * the installed package version, so bumping Playwright makes it look for a
 * revision the machine never downloaded and die with "Executable doesn't exist …
 * run `npx playwright install`". Sandboxed runners block that install; laptops
 * pay a 150 MB download to run a script that had a working browser sitting next
 * to it. `PLAYWRIGHT_BROWSERS_PATH` environments keep a version-stable
 * `chromium` symlink beside the numbered directories, so prefer it and fall back
 * to Playwright's own resolution everywhere else.
 *
 * **The proxy.** Chromium does not read `HTTPS_PROXY`. Under an egress proxy
 * every navigation fails with `ERR_CONNECTION_RESET`, which reads exactly like
 * the target site being down — the capture script "verified 200" over Node's
 * fetch and then failed on every page load. Chromium needs `--proxy-server`
 * passed explicitly, and a bypass list, because the local dev server the
 * viewport harness points at must not be tunnelled out and back.
 *
 * And then it still fails, for a second reason. A net-log capture shows the
 * CONNECT tunnel succeeding (`HTTP/1.1 200 Connection Established`) and the TLS
 * handshake *inside* the tunnel being reset — `SOCKET_READ_ERROR os_error 104`.
 * A TLS-re-terminating proxy that curl negotiates with happily resets
 * Chromium's TLS 1.3 ClientHello. Capping the capture browser at TLS 1.2 is what
 * makes it connect. Ruled out first, each on its own: post-quantum key agreement
 * (`PostQuantumKyber`), Encrypted ClientHello, and DNS-over-HTTPS.
 *
 * **This does not weaken certificate verification and must not be changed into
 * something that does.** `--ssl-version-max` constrains protocol version
 * negotiation; certificates are still verified against the trust store, which
 * already carries the proxy CA in these environments. `--ignore-certificate-errors`
 * was tested, does *not* fix this, and does not belong here.
 *
 * All of it is conditional on an egress proxy actually being present, so a
 * laptop with direct internet gets a stock browser and none of these flags.
 */

import { existsSync } from 'node:fs'
import path from 'node:path'

/** Hosts a browser must reach directly. The dev server is the whole point. */
const BYPASS = ['<-loopback>', 'localhost', '127.0.0.1', '::1']

export function chromiumLaunchOptions(extra = {}) {
  const options = { ...extra }
  const args = [...(extra.args ?? [])]

  const root = process.env.PLAYWRIGHT_BROWSERS_PATH
  if (root) {
    const stable = path.join(root, 'chromium')
    if (existsSync(stable)) options.executablePath = stable
  }

  const proxy = process.env.HTTPS_PROXY ?? process.env.https_proxy
  if (proxy) {
    args.push(`--proxy-server=${proxy}`)
    args.push(`--proxy-bypass-list=${BYPASS.join(';')}`)
    // See the note above: TLS 1.3 through this tunnel is reset. Verification
    // stays on.
    args.push('--ssl-version-max=tls1.2')
  }

  if (args.length > 0) options.args = args
  return options
}
