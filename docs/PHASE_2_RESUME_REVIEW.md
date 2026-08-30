# Phase 2 Resume review

Recorded 2026-08-30. This is the route-structure and craft review for `/resume/`. It does
not complete Phase 2 or replace the supplied source PDF.

## Owner inputs

- Use `parth-os/resume/Parth_Tiwari_Resume_B.pdf` as the resume artifact.
- Build About and Resume as separate readings of the same verified path.
- Keep the Resume treatment ATS-first.
- Allow a Google Drive resume link to be configured through the environment.

## Reference and source lock

The supplied one-page Resume B PDF sets the factual contact, skill, experience and education
source order. The Paper and Worlds system supplies the web typography, ink, rules and paper
surface. The HTML route deliberately does not reproduce the PDF's dense one-page layout or
copy its older quantitative project claims.

The source PDF is copied unchanged to
`public/resume/Parth_Tiwari_Resume_B.pdf`. Source and public copies share SHA-256
`79C6A7AFAE7FFF1B408584C7DE260B8F62B37228A7AC2E55806B3067067D781D` and are 48,997
bytes. The download action labels it as the supplied source snapshot; the HTML page states
that it carries the latest verified project evidence.

## HTML contract

The route emits normal semantic HTML for identity and contact, profile, experience, four
selected projects, four skill groups and two education records. Project summaries and
measurements come from the validated work and claim collections. The gate rejects the stale
`24 days`, `500 seconds`, `95.7%` and `1000 seconds` phrases found in the supplied PDF if
they appear in the HTML record.

The Print control is progressive enhancement. With JavaScript disabled, it disappears and
the full resume remains. Print CSS produces a white two-page A4 document: identity,
experience, skills and education on page one; selected verified work on page two.

## Google Drive configuration

`PUBLIC_RESUME_GOOGLE_DRIVE_URL` is optional and documented in `.env.example`. When absent,
no empty Drive control is rendered. When set to an HTTPS `drive.google.com` or
`docs.google.com` URL, the static build adds `View latest Drive copy` as a separate external
link. The local PDF remains available and the HTML resume never depends on Google Drive.
There is no Drive embed, runtime fetch, API key or new dependency.

A configuration proof build used
`https://drive.google.com/file/d/configurable-resume/view` and confirmed that both the Drive
link and the local PDF link were present. The final normal build ran without the sample
environment value.

## Rendered evidence

`npm run phase2:resume-capture -- --url http://127.0.0.1:4323 --tag phase2-resume-review-final`
passed against the built static output at 390, 800 and 1440 pixels:

- one route `h1` and one semantic resume identity heading;
- one experience record, four selected projects, four skill groups and two education records;
- local PDF returned HTTP 200 with the expected 48,997-byte length;
- zero horizontal overflow, missing names, stale HTML claims or browser errors;
- full resume content with JavaScript disabled; only the inert Print control is hidden.

Screenshots and the generated print proof are in `.shots/phase2-resume-review-final`. The web
route and both rendered A4 pages were visually inspected. Owner visual approval remains
before the combined Phase 2 route-hierarchy checklist can close.
