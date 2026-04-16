# SLICE VICE PRODUCTION CHECKLIST
**Pipeline from Concept to PDF Issue**

## PHASE 1: PRE-PRODUCTION
- [ ] Determine Episode Theme (e.g. Swamp run, Cartel chase, HOA siege)
- [ ] Write `EPISODE_X_SCRIPT.md` (5-Act Structure)
- [ ] Verify 1980s Tech Compliance (No cellphones, no GPS. Use walkie-talkies, pagers if absolutely necessary, physical maps, tape decks).

## PHASE 2: COMIC SHEETS
- [ ] Draft `EPISODE_X_SHEETS.md` (14 panels standard)
- [ ] Maintain 1980s Miami aesthetic in descriptions (Neon, fog, CRT glow, shoulder pads, cassette tapes)
- [ ] Draft `CAPTION_SCRIPT_EPX.md` (Dispatch radio calls and driver internal monologue)

## PHASE 3: ASSET GENERATION
- [ ] Run AI Image Generation using the Slice Vice Prompt guidelines (see `style_bible.md`)
- [ ] Ensure all cars reflect mid/late 1980s models.
- [ ] Verify color grading (Hot Pink #FF00FF and Cyan #00FFFF with deep purple/black shadows).
- [ ] Export images to `docs/archive/assets/EPX/`

## PHASE 4: PDF ASSEMBLY & WEB
- [ ] Compile PDF using Python or web script.
- [ ] Ensure Captions are placed in the neon yellow/black boxes.
- [ ] Update `web/src/main.js` episode list to include the new episode.
- [ ] Launch `npm run dev` in `web/` to test UI.
