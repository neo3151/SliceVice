# 🎛️ SLICE VICE: MISSION CONTROL
> **The central nervous system for Slice Vice production, lore tracking, and generation pipelines.**

---

## 📅 THE TIMELINE (1980 HARD GRID)

```mermaid
gantt
    title Slice Vice: Volume 1-3 Chronology
    dateFormat  YYYY-MM-DD
    axisFormat  %b %d
    
    section VOLUME 01
    Ep 01 (Grid-Tape)      :active, 1980-01-01, 1d
    Ep 02 (Blockade)       :1980-01-05, 1d
    Ep 03 (Repossession)   :1980-01-10, 1d
    Ep 04 (The Frost)      :1980-01-15, 1d
    
    section VOLUME 02
    Ep 08 (Stadium Siege)  :crit, 1980-02-10, 1d
    Ep 11 (Uninstaller)    :1980-02-19, 1d
    Ep 13 (Freedom Tower)  :crit, 1980-02-20, 1d
    
    section VOLUME 03 (The Idle Engine)
    Ep 14 (Ventanita)      :active, 1980-02-22, 1d
    Ep 15 (Palm Springs)   :1980-02-28, 1d
    Ep 16 (The Mesh)       :1980-03-05, 1d
    Ep 17 (Early Bird)     :1980-03-10, 1d
    Ep 18 (The Infield)    :crit, 1980-03-15, 1d
```

---

## 🚀 CURRENT SPRINT: Transition to Volume 03

We have concluded **Volume 02 (The Uninstaller)** and are entering **Volume 03 (The Idle Engine)**. It is a pacing-shift arc. The car is broken, Axel is grounded, and the seeds of the Mariel Boatlift are being planted.

### Core Objectives:
- [ ] **Drafting:** Write `EPISODE_14_SHEETS.md` (The Ventanita).
- [ ] **Asset Gen:** Generate visual assets for Ep 14 (Doña Carmen, Versailles, Elio's garage).
- [ ] **Lore Drop:** Finalize dossiers for new Volume 3 anchors (Doña Carmen, Jean-Pierre, Sol Abramowitz).
- [ ] **Tech/Compile:** Formally tag and deploy the complete Volume 02 Master PDF.

---

## 🛠️ THE PRODUCTION PIPELINE

```mermaid
flowchart LR
    A[1. Concept / Logline] --> B[2. Scripting & Captions]
    B --> C{3. AI Asset Generation}
    C -->|Images Approved| D[4. HTML Formatting]
    D --> E[5. Web Reader Compile]
    D --> F[6. PDF Master Build]
```

### Quick Commands (When Ready to Fire)
Just tell Antigravity the following whenever you hit these milestones:
1. *"Write the image prompts for Episode 14"*
2. *"Format the Episode 14 HTML panels"*
3. *"Run the PDF compilation script for Volume 2"*

---

## 🗃️ LORE DEBT (Missing/Pending Entries)
These are world-building elements referenced but not fully documented:
- [ ] `DOSSIER_JEAN_PIERRE.md` - Sector H analog relay technician.
- [ ] `DOSSIER_DONA_CARMEN.md` - The anchor at Versailles.
- [ ] `DOSSIER_SOL_ABRAMOWITZ.md` - The anomaly in Hollywood.
- [ ] `THE_MARIEL_SURGE.md` - Expanding the pre-boatlift dynamics in the Straits.
