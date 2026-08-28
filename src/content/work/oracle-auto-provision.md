---
{
  "title": "Oracle Auto Provision",
  "order": 12,
  "tier": "minor",
  "effort": "focused",
  "status": "running",
  "started": "2026-05",
  "startedSource": { "kind": "repository", "locator": "Oracle Auto Provision first Git commit", "public": false },
  "audience": ["employer", "client"],
  "summary": "A small scheduled utility that retries scarce Oracle Cloud capacity without creating a duplicate instance.",
  "arrival": { "sentence": "A small automation that keeps trying, checks before creating, and tells you when it lands." },
  "whatItIs": ["Oracle Auto Provision runs a scheduled attempt to create an Always Free compute instance when capacity becomes available.", "It checks for an existing instance first and sends a Telegram notification after success."],
  "problem": ["Capacity failures are expected, so a one-shot script is not useful. Repeating the request carelessly can create duplicates or leak cloud credentials.", "The workflow needed bounded attempts, a duplicate guard, secret handling, and an honest stop story."],
  "architecture": {
    "decision": "Put the retry on a small scheduled workflow and check existing state before every creation attempt.",
    "paragraphs": ["GitHub Actions invokes the OCI client on a fixed cadence. The script checks existing instances, tries the configured availability domains, and notifies Telegram after success.", "A helper for disabling the workflow exists, but the current workflow does not pass the token it requires. The documentation therefore says to disable it manually rather than claiming auto-stop." ]
  },
  "measurement": { "claimIds": ["oracle-schedule"] },
  "boundary": {
    "will": ["Retry expected capacity failures and guard against duplicate creation.", "Keep keys and account identifiers in secrets."],
    "refuses": ["Claim uptime or duration without run logs.", "Claim automatic workflow disable until the required token is wired and tested."]
  },
  "whatBroke": {
    "title": "The code had auto-disable, but the workflow could not call it",
    "paragraphs": ["Earlier copy described success as automatically turning the workflow off. The helper expects a GitHub token that the workflow does not provide.", "I removed the claim and kept manual disable as the verified operating instruction. Wiring and testing the token path is future product work."],
    "noteSlug": "oracle-auto-disable-not-wired"
  },
  "stackAndLinks": { "stack": ["Python", "OCI SDK", "GitHub Actions", "Telegram"], "links": [] },
  "next": { "slug": "beatmind", "label": "Back to BeatMind" },
  "world": {
    "story": "Scheduled attempt ticks accumulate, failures remain visible, a later run succeeds, and the manual stop requirement stays in the final frame.",
    "dataSources": ["workflow schedule", "provisioning branches", "notification path"],
    "storyboardStatus": "specced",
    "motionDeferred": true
  },
  "claimRefs": ["oracle-schedule"]
}
---
