# YouTube source index

29 videos, roughly 10 hours, pulled 2026-08-26 with `yt-dlp` (auto-captions).

- `transcripts/` raw WebVTT as downloaded, 6.5 MB
- `text/` deduplicated plain text, 0.69 MB. Auto-captions repeat every line up to three times in a rolling window; the converter drops any line contained in the one before it
- `notes/` one file per video, written by the mining agents
- `GROUP-A/B/C-SYNTHESIS.md` the cross-video syntheses

Reproduce with:

```bash
yt-dlp --skip-download --write-auto-sub --sub-lang "en.*" --sub-format vtt -o "transcripts/PL%(playlist_index)s-%(id)s-%(title).60s.%(ext)s" "<playlist-url>"
```

| # | Group | Video | Duration | Text | Watch |
|---|---|---|---|---:|---|
| PL01 | B | Designing With Claude: The No-Nonsense Guide | 17:18 | 19 KB | [link](https://youtu.be/ojS5pcjs3xQ) |
| PL02 | B | Use AI Like a Senior Designer (3 Workflows) | 14:19 | 16 KB | [link](https://youtu.be/Oo-5AWdQAt8) |
| PL03 | B | Train Claude on Your Design System (Advanced Workflow) | 26:19 | 29 KB | [link](https://youtu.be/VezxOhvoXqU) |
| PL04 | B | Turn Claude Into a SENIOR Designer in 3 Simple Steps | 18:10 | 20 KB | [link](https://youtu.be/4vItmdk8F_M) |
| PL05 | A | Web Design with Claude Code: The Complete Guide | 1:11:10 | 79 KB | [link](https://youtu.be/jO-wH4zgJV0) |
| PL06 | C | Claude Code + Claude Design + Kling AI: Client-Ready Web Experiences | 15:07 | 17 KB | [link](https://youtu.be/l7G97gNyM8k) |
| PL07 | C | Claude Code + Google AI Image Gen: Build Apple-Style Websites | 17:00 | 19 KB | [link](https://youtu.be/8fva1VtacT8) |
| PL08 | C | Claude Code + 3D Animations: Build Client Ready Websites | 15:14 | 16 KB | [link](https://youtu.be/AGHqBAVyrQs) |
| PL09 | A | Claude Code for Designers: All the Ways to Use It | 51:38 | 50 KB | [link](https://youtu.be/7AkUmYwTMOg) |
| PL10 | B | I Gave Claude Code & Codex Access to 600,000 UI Designs | 14:12 | 14 KB | [link](https://youtu.be/J8RYkSHb92E) |
| PL11 | A | Designing With AI: Claude, Codex, Figma | Full Guide | 1:27:43 | 84 KB | [link](https://youtu.be/j_ZPV10bu54) |
| PL12 | B | Claude Design Isn’t Just Design | ? | 10 KB | [link](https://youtu.be/B6yDicNiBWA) |
| PL13 | B | Claude Design: The Complete Guide | 31:58 | 32 KB | [link](https://youtu.be/eXlSgQmz02E) |
| PL14 | B | Design in Claude Code Like This | 15:51 | 16 KB | [link](https://youtu.be/lwOIVNRHndM) |
| PL15 | B | Claude Code for Designers (Full Overview) | 26:24 | 28 KB | [link](https://youtu.be/mwq70TpWQkA) |
| PL16 | B | Figma Skills Explained | 17:08 | 18 KB | [link](https://youtu.be/9o-fe0noDFc) |
| PL17 | B | Claude Code + Figma Design System (Designer Workflow Test) | 8:49 | 9 KB | [link](https://youtu.be/-ttbXFWb8mg) |
| PL18 | B | Generate Better AI Designs in Claude Code | 11:00 | 11 KB | [link](https://youtu.be/nbk0PMS0tos) |
| PL19 | A | How I Actually Use Claude Code in My Design Workflow | 13:24 | 14 KB | [link](https://youtu.be/TKScxZtESzs) |
| PL20 | A | Design with Claude Code: The Designer’s Guide | ? | 18 KB | [link](https://youtu.be/JMQ0X_si144) |
| SA | C | Claude Design 2.0 = Web Design On STEROIDS (Tae Online HD) | 6:40 | 8 KB | [link](https://youtu.be/G0tOexS93IM) |
| SA | C | Turn Claude into a Design Genius... Just Watch (Jack Roberts) | 17:55 | 21 KB | [link](https://youtu.be/NAumQObJEwM) |
| SA | C | I Built The Ultimate Claude Website Design Skill (Nate Herk) | 16:44 | 21 KB | [link](https://youtu.be/QUI6Ug4cHnE) |
| SA | C | Top 5 Claude Code Skills... 100,000+ github stars (Jack Roberts) | 22:06 | 27 KB | [link](https://youtu.be/WR-kVYU-lBU) |
| SA | C | How To Use Claude Design To Build Beautiful Sites (AI LABS) | 18:33 | 21 KB | [link](https://youtu.be/bBlY5YOsKN8) |
| SA | C | Claude Design OS Changes Everything (Jack Roberts) | 13:49 | 16 KB | [link](https://youtu.be/iyRYc9sVRsw) |
| SA | C | Claude Design just got 10X Better... I’m Done (Jack Roberts) | 12:05 | 14 KB | [link](https://youtu.be/jq9LRwE0-GQ) |
| SA | C | Claude Design 3.0 Just Destroyed AI slop Forever (Jack Roberts) | 17:55 | 21 KB | [link](https://youtu.be/wJWO91mi5o0) |
| SA | C | Claude Code Design just became UNSTOPPABLE (Jack Roberts) | 21:53 | 28 KB | [link](https://youtu.be/z9CwM-DAe5Q) |

## The playlist

[Design with Claude Code](https://www.youtube.com/playlist?list=PLkmvmF0zhgT_cKQTLZOSlnEHtynu4JcpY) supplied PL01-PL20. Indices 12 and 20 were missing from the flat listing but downloaded fine.

## Grouping rationale

Split three ways so each mining agent could read its share end to end rather than skim all 29.

| Group | Theme |
|---|---|
| A | The long-form workflow guides. Where design sits relative to code, and the order of operations |
| B | Design systems, Figma, and how to encode a design language a model will actually hold |
| C | Client-ready builds, 3D, AI imagery, and the standalone skill roundups. Titles are clickbait; the task included separating technique from engagement farming |
