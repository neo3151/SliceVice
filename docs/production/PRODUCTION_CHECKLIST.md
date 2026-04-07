# MAILSTORM PRODUCTION CHECKLIST
**The Abyssal Standard Pipeline — From Idea to Finished PDF**

Use this checklist for EVERY new episode. Copy this file, rename it, and check off each step.

---

## PHASE 1: SCRIPT
- [ ] Copy `templates/EPISODE_SCRIPT_TEMPLATE.md` → `episode_X_script.md`
- [ ] Fill in 5 scenes (Setup → Escalation → Midpoint → Climax → Resolution)
- [ ] Verify all lore terms against THE_HIERARCHY.md, THE_CONTRACT.md, THE_BESTIARY.md
- [ ] Ensure new characters are added to `characters.md`

## PHASE 2: PRODUCTION SHEETS
- [ ] Copy `templates/EPISODE_SHEETS_TEMPLATE.md` → `EPISODE_X_SHEETS.md`
- [ ] Break script into 14 panels (3-4 per page, 1 splash)
- [ ] Define camera angle, emotional tone, and art direction for each panel

## PHASE 3: CAPTION SCRIPT
- [ ] Copy `templates/CAPTION_SCRIPT_TEMPLATE.md` → `CAPTION_SCRIPT_EPX.md`
- [ ] Write 14 Archive Annotations (max 20 words, Senior Archivist voice)
- [ ] Map placement (TL/BR) for each panel

## PHASE 4: ASSET GENERATION
- [ ] Generate 14 story panels (80/20 Chiaroscuro, no text, no glow before Ep4)
- [ ] Generate 1 cover (Hazard Orange palette)
- [ ] Generate any new character sheets or bestiary illustrations
- [ ] Move all assets to archive directory

## PHASE 5: PDF ASSEMBLY
- [ ] Run: `python assemble_pdf.py --episode X`
- [ ] Verify captions fit inside yellow boxes
- [ ] Verify no duplicate pages
- [ ] Verify ToC page numbers are correct

## PHASE 6: WEB DEPLOYMENT
- [ ] Run: `python prepare_web.py --episode X`
- [ ] Update `web/src/main.js` episode list (set `available: true`)
- [ ] Run: `cd web && npm run dev`
- [ ] Verify in browser
