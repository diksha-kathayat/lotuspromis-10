# LotusPROMIS-10

Clickable LotusLab prototype for a **PROMIS-10** patient-reported outcomes program.

Open the live prototype: **[LotusPROMIS-10 on GitHub Pages](https://diksha-kathayat.github.io/lotuspromis-10/)**

Or open `index.html` locally in a browser.

## What this is

LotusPROMIS-10 is a LotusLab Guide program built around the 10 commonly used PROMIS domains:

1. Physical Function
2. Pain Intensity
3. Pain Interference
4. Fatigue
5. Sleep Disturbance
6. Sleep-Related Impairment
7. Anxiety
8. Depression
9. Cognitive Function / Cognitive Concerns
10. Ability to Participate in Social Roles & Activities

Surveys are released in **context groups**. Completing a group unlocks the next. Each survey ends on a **milestone** screen that shows where the participant is and what is coming up.

## How it maps to the LotusLab app

This prototype follows the Disc / LotusLab patient app (`weguide-medical-frontend`):

| App behaviour | Prototype |
| --- | --- |
| Home tab **The Guide** (`your-actions`) | Pending tasks + Completed Activities |
| `queued` → `notified` unlocking | Cluster unlock after the previous group is finished |
| `Instruction` questions with HTML | Formatted intro screens in each survey |
| `SingleChoiceQuestion` | PROMIS Likert items |
| `RangeSliderQuestion` 0–10 | Pain intensity |
| `celebrate` + `celebrate_text` | Milestone page after every survey |
| Introduction task | Welcome to LotusPROMIS-10 |

The backend-shaped payload lives in [`content/program.json`](content/program.json) so the same structure can be authored in WeGuide admin.

## Journey

1. **Getting started** — Welcome to LotusPROMIS-10
2. **Physical health** — Physical Function, Pain Intensity, Pain Interference
3. **Energy & sleep** — Fatigue, Sleep Disturbance, Sleep-Related Impairment
4. **Emotional health** — Anxiety, Depression
5. **Thinking & social life** — Cognitive Function, Social Roles & Activities

## Notes

Item stems are representative of publicly documented PROMIS short forms (for example LOINC-published Physical Function 4a wording) and are here for prototype / UX review. Production use of PROMIS instruments requires a HealthMeasures license.

Reset the demo from **Settings**.
