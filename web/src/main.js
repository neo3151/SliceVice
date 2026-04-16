import './style.css'
import loreRoute from '../../docs/lore/world/THE_ROUTE_TOPOLOGY.md?raw'
import loreFranchise from '../../docs/lore/systems/THE_FRANCHISE_MANUAL.md?raw'
import loreBestiary from '../../docs/lore/world/THE_BESTIARY.md?raw'
import loreMetrics from '../../docs/lore/systems/THE_METRICS_CAGE.md?raw'
import loreMixtapes from '../../docs/lore/systems/THE_MIXTAPES.md?raw'
import loreGarage from '../../docs/lore/systems/THE_GARAGE.md?raw'
import loreSetPieces from '../../docs/lore/world/THE_SET_PIECES.md?raw'
import loreVehicles from '../../docs/lore/systems/THE_VEHICLES.md?raw'
import loreSoulContract from '../../docs/lore/artifacts/THE_SOUL_CONTRACT.md?raw'
import loreVanguard from '../../docs/lore/world/VANGUARD_INTEL.md?raw'
import loreMemo from '../../docs/lore/artifacts/ARTIFACT_DISPATCH_MEMO.md?raw'
import loreNote from '../../docs/lore/artifacts/ARTIFACT_SCAVENGER_NOTE.md?raw'
import loreCult from '../../docs/lore/artifacts/ARTIFACT_CULT_TRACT.md?raw'
import loreAtlas from '../../docs/lore/artifacts/ARTIFACT_GRID_ATLAS.md?raw'
import loreAxel from '../../docs/lore/characters/CHARACTER_AXEL.md?raw'
import loreVance from '../../docs/lore/characters/CHARACTER_VANCE.md?raw'
import loreReya from '../../docs/lore/characters/CHARACTER_REYA.md?raw'
import loreTape from '../../docs/lore/artifacts/ARTIFACT_V_SENTRY.md?raw'
import loreMainland from '../../docs/lore/artifacts/MAINLAND_TACTICAL_LEDGER.md?raw'
import lore305R from '../../docs/lore/world/AREA_INTEL_305R.md?raw'

const app = document.querySelector('#app')
const btnPrev = document.querySelector('#btn-prev')
const btnNext = document.querySelector('#btn-next')
const timerDisplay = document.querySelector('#hud-timer')
const tapeStatus = document.querySelector('#tape-status')
const btnEject = document.querySelector('#btn-eject')

const hubView = document.querySelector('#hub-view')
const readerView = document.querySelector('#reader-view')
const encyclopediaView = document.querySelector('#encyclopedia-view')
const manualView = document.querySelector('#manual-view')
const mapView = document.querySelector('#map-view')
const archiveView = document.querySelector('#archive-view')

// Manual Data
const VOLUME_01_MANUAL = {
  cover: '/assets/manual/vol1_manual_cover_mockup_1775961192233.png',
  intel: "Listen up, Cutter. If you’re reading this, you’ve survived your first run—or you found this folder in the wreckage of someone who didn't. This manual documents the first five tapes of the Slice Vice incident.",
  episodes: [
    { title: "TAPE 01: THE ABYSSAL GEARING", date: "JAN 1, 1980", summary: "Axel inherits the 'Grid-Tape' from a dying courier in a Florida swamp shack. The mission starts with a melting alternator.", img: '/assets/manual/ep1_snapshot_abyssal_gearing_1775961456292.png', delta: "Alternator housing melted by swamp humidity. Bypassed with heavy copper bridge." },
    { title: "TAPE 02: THE SLIPSTREAM LOGIC", date: "JAN 5, 1980", summary: "Cartel wedge-cars attempt to box Axel in. He discovers the 'Pizza Safe' generates a magnetic field that breaks traffic rules.", img: '/assets/manual/ep2_snapshot_slipstream_logic_1775961468430.png', delta: "Rear axle permanently magnetized. Attracts road debris." },
    { title: "TAPE 03: THE NEON SIPHON", date: "JAN 10, 1980", summary: "Vance signs the official Repossession Order. Axel's 'Mother-Debt' is sold. The delivery becomes a survival sprint.", img: '/assets/manual/ep3_snapshot_neon_siphon_1775961482891.png', delta: "Radiator replaced with a unit from a '74 Chevy Caprice. Hood is bolted shut." },
    { title: "TAPE 04: THE REPOSSESSION", date: "JAN 15, 1980", summary: "Record freeze hits Florida. Vance uses the 'Silence of the Snow' to hunt Axel by following his engine's heat signature.", img: '/assets/manual/ep4_snapshot_repossession_1775961500235.png', delta: "Fuel lines thickening. Using 5% isopropyl mix to prevent freezing." },
    { title: "TAPE 05: THE BINARY BURNOUT", date: "JAN 20, 1980", summary: "Axel reaches Stiltsville. Reya reveals the Tape is the source code for the city’s land-filled foundations.", img: '/assets/manual/ep5_snapshot_binary_burnout_1775961515399.png', delta: "Transmission failing. High-pitched metallic whine above 3000 RPM." }
  ],
  relics: [
    { title: "V-SENTRY TAPE SAFE", img: '/assets/manual/relic_v_sentry_safe_1775961295785.png', desc: "Heavy-metal data cradle with neon-pink magnetic flux." },
    { title: "AXEL'S NIXIE TIMER", img: '/assets/manual/relic_nixie_timer_1775961314187.png', desc: "Dashboard module used to track the 'Repossession Window'." },
    { title: "SCAVENGER NOTE", img: '/assets/manual/relic_scavenger_note_1775961330566.png', desc: "Tactical intel from Reya found in Overtown dead-drops." },
    { title: "VANGUARD COMPLIANCE BADGE", img: '/assets/manual/relic_v_vanguard_badge_1775961343490.png', desc: " authorizations for lethal reclamation of assets." }
  ],
  dossiers: [
    { name: "AXEL", role: "Driver", intel: "Debt-ridden courier with a 1420% overdue Mother-Debt." },
    { name: "REYA", role: "Logic Expert", intel: "Former Franchise Architect living in the Stiltsville Data-Cradle." },
    { name: "VANCE", role: "Compliance", intel: "HOA Vanguard Director. Authorizes repossession with bureaucratic calm." }
  ]
}

// Routing Logic
function switchView(viewId) {
  document.body.classList.remove('glitch-flash')
  void document.body.offsetWidth
  document.body.classList.add('glitch-flash')
  
  hubView.classList.remove('active'); hubView.classList.add('hidden');
  readerView.classList.remove('active'); readerView.classList.add('hidden');
  encyclopediaView.classList.remove('active'); encyclopediaView.classList.add('hidden');
  manualView.classList.remove('active'); manualView.classList.add('hidden');
  mapView.classList.remove('active'); mapView.classList.add('hidden');
  if(archiveView) { archiveView.classList.remove('active'); archiveView.classList.add('hidden'); }
  
  document.querySelector('#' + viewId).classList.remove('hidden')
  document.querySelector('#' + viewId).classList.add('active')

  // Reset menu tree on return to hub
  if (viewId === 'hub-view') {
    switchMenuScreen('menu-main')
  }
}

function switchMenuScreen(screenId) {
  document.querySelectorAll('.menu-screen').forEach(s => {
    s.classList.remove('active')
    s.classList.add('hidden')
  })
  const target = document.querySelector('#' + screenId)
  target.classList.remove('hidden')
  target.classList.add('active')
}

// Hub Navigation
document.querySelector('#nav-to-volumes').addEventListener('click', () => switchMenuScreen('menu-volumes-select'))
document.querySelector('#nav-to-archives').addEventListener('click', () => switchMenuScreen('menu-archives'))

document.querySelector('#nav-to-vol1').addEventListener('click', () => switchMenuScreen('menu-vol1-episodes'))
document.querySelector('#nav-to-vol2').addEventListener('click', () => switchMenuScreen('menu-vol2-episodes'))
document.querySelector('#nav-to-vol3').addEventListener('click', () => switchMenuScreen('menu-vol3-episodes'))

document.querySelectorAll('.nav-back').forEach(btn => {
  btn.addEventListener('click', () => switchMenuScreen('menu-main'))
})

document.querySelectorAll('.nav-back-to-volumes').forEach(btn => {
  btn.addEventListener('click', () => switchMenuScreen('menu-volumes-select'))
})

// Manual Renderer
function renderManual() {
  const content = document.querySelector('#manual-content');
  let html = `
    <div class="manual-stamp">CLASSIFIED</div>
    <div class="manual-section-header"><span>SUBJECT: FIELD_MANUAL_VOL_1</span><span>[RESTRICTED]</span></div>
    <img src="/assets/manual/rebel_stamp.png" class="manual-rebel-stamp" style="top: 250px; left: 50px; transform: rotate(-15deg);" />
    <img src="/assets/manual/rebel_stamp.png" class="manual-rebel-stamp" style="bottom: 100px; right: 50px; transform: rotate(20deg);" />
    
    <img src="${VOLUME_01_MANUAL.cover}" class="manual-cover-img" />
    <div class="manual-page">
      <p style="white-space: normal;">${VOLUME_01_MANUAL.intel}</p>
    </div>

    <div class="manual-section-header">LORE_RELICS</div>
    <div class="manual-relic-grid">
      ${VOLUME_01_MANUAL.relics.map(r => `
        <div class="manual-relic-card">
          <div class="manual-relic-title">${r.title}</div>
          <img src="${r.img}" />
          <p style="font-size: 0.8rem;">${r.desc}</p>
        </div>
      `).join('')}
    </div>

    <div class="manual-section-header">ARCHIVE_TAPES</div>
    ${VOLUME_01_MANUAL.episodes.map(ep => `
      <div class="manual-page">
        <div style="display: flex; justify-content: space-between; font-weight: bold;">
          <span>${ep.title}</span>
          <span>${ep.date}</span>
        </div>
        <img src="${ep.img}" class="manual-snapshot" />
        <p style="white-space: normal;">${ep.summary}</p>
        <div class="manual-delta-log">DELTA: ${ep.delta}</div>
      </div>
    `).join('')}

    <div class="manual-section-header">AUDIT_PROFILES</div>
    <div class="manual-dossier-grid">
      ${VOLUME_01_MANUAL.dossiers.map(d => `
        <div class="manual-dossier-card">
          <div style="font-weight: bold; font-size: 1.2rem;">${d.name}</div>
          <div style="color: #666; font-size: 0.9rem;">${d.role}</div>
          <p style="font-size: 0.9rem; margin-top: 10px;">${d.intel}</p>
        </div>
      `).join('')}
    </div>
  `;
  content.innerHTML = html;
}

document.querySelector('#btn-open-manual').addEventListener('click', () => {
  renderManual();
  switchView('manual-view');
})
document.querySelector('#btn-hub-from-manual').addEventListener('click', () => switchView('hub-view'))

document.querySelector('#btn-open-encyclopedia').addEventListener('click', () => {
  document.querySelectorAll('.corp-nav-link').forEach(b => b.classList.remove('active'))
  document.querySelector('#lore-content').innerHTML = "Select a Corporate Document..."
  switchView('encyclopedia-view')
})
document.querySelector('#btn-open-map').addEventListener('click', () => switchView('map-view'))
document.querySelector('#btn-hub-from-map').addEventListener('click', () => switchView('hub-view'))

document.querySelector('#btn-open-archive').addEventListener('click', () => switchView('archive-view'))
document.querySelector('#btn-hub-from-archive').addEventListener('click', () => switchView('hub-view'))

document.querySelector('#btn-hub-from-enc').addEventListener('click', () => switchView('hub-view'))
btnEject.addEventListener('click', () => switchView('hub-view'))

// Lore Data Database
function setLoreContent(btnSelector, content, visualAsset = null) {
  document.querySelector(btnSelector).addEventListener('click', (e) => {
    document.querySelectorAll('.corp-nav-link').forEach(b => b.classList.remove('active'))
    e.target.classList.add('active')
    
    // Use marked for premium rendering
    document.querySelector('#lore-content').innerHTML = marked.parse(content);
    
    // Handle visual artifact pairing
    const visualContainer = document.querySelector('#visual-artifact-container');
    const visualImg = document.querySelector('#visual-artifact-img');
    
    if (visualAsset) {
      visualImg.src = visualAsset;
      visualContainer.classList.remove('hidden');
    } else {
      visualContainer.classList.add('hidden');
    }
    
    // Scroll to top
    document.querySelector('.corp-main-view').scrollTop = 0;
  })
}

setLoreContent('#btn-lore-routes', loreRoute)
setLoreContent('#btn-lore-franchise', loreFranchise)
setLoreContent('#btn-lore-bestiary', loreBestiary)
setLoreContent('#btn-lore-metrics', loreMetrics)
setLoreContent('#btn-lore-mixtapes', loreMixtapes)
setLoreContent('#btn-lore-garage', loreGarage, '/assets/lemans_blueprint_artifact.png')
setLoreContent('#btn-lore-pieces', loreSetPieces)
setLoreContent('#btn-lore-vehicles', loreVehicles)
setLoreContent('#btn-lore-contract', loreSoulContract)
setLoreContent('#btn-lore-vanguard', loreVanguard, '/assets/vanguard_tactical_artifact.png')

setLoreContent('#btn-lore-memo', loreMemo, '/assets/dispatch_memo_artifact.png')
setLoreContent('#btn-lore-note', loreNote, '/assets/scavenger_note_artifact.png')
setLoreContent('#btn-lore-cult', loreCult)
setLoreContent('#btn-lore-atlas', loreAtlas)
setLoreContent('#btn-lore-tape', loreTape, '/assets/master_tape_artifact.png')
setLoreContent('#btn-lore-mainland', loreMainland, '/assets/miami_subs_safehouse_artifact.png')

setLoreContent('#btn-lore-soul', loreSoulContract, '/assets/artifact_soul_contract.png')
setLoreContent('#btn-lore-ledger', loreVanguard, '/assets/vanguard_tactical_artifact.png')
setLoreContent('#btn-lore-blueprints', loreGarage, '/assets/lemans_blueprint_artifact.png')
setLoreContent('#btn-lore-305r', lore305R, '/assets/vanguard_intel_305r_artifact.png')
setLoreContent('#btn-lore-jammer', loreTape, '/assets/EP9/ep9_panel_04.png')

setLoreContent('#btn-lore-axel', loreAxel, '/assets/character_axel.png')
setLoreContent('#btn-lore-vance', loreVance, '/assets/character_vance.png')
setLoreContent('#btn-lore-reya', loreReya, '/assets/character_reya.png')

// Real Comic Pages
const episodes = {
  ep1: [
    { type: 'title', content: 'INITIALIZING CASSETTE: EPISODE 01 ("THE I-95 SLIPSTREAM - JAN 1, 1980")...' },
    { type: 'image', url: '/assets/EP1/ep1_panel_01.jpg', caption: 'JANUARY 1, 1980. 0200 HOURS. THE BRIDGES ARE CHOKED WITH NEW YEAR\'S VOMIT AND FAILED RESOLUTIONS.' },
    { type: 'image', url: '/assets/EP1/ep1_panel_02.jpg', caption: 'THE DISPATCH TICKET WAS SMUDGED WITH GREASE. "UNIT 404... UN-LISTED DROP-OFF IN THE EVERGLADES. DO NOT STOP FOR THE VANGUARD."' },
    { type: 'image', url: '/assets/EP1/ep1_panel_03.jpg', caption: 'THE \'78 LEMANS IDLES ROUGH. THE V8 IS COUGHING PROMISES IT CAN\'T KEEP. I KICK IT OVER ANYWAY.' },
    { type: 'image', url: '/assets/EP1/ep1_panel_04.jpg', caption: 'I-95 SOUTH. A RIVER OF TAIL-LIGHTS AND WEAPONIZED BOREDOM. NO HEADLIGHTS. STAY GHOST.' },
    { type: 'image', url: '/assets/EP1/ep1_panel_05.jpg', caption: 'I SEE THE COURIER\'S WRECKED COUNTACH OFF THE SHOULDER. HE LIKED SPEED MORE THAN HE LIKED BRAKES. HE\'S DEAD, BUT THE PACKAGE IS STILL SECURE.' },
    { type: 'image', url: '/assets/EP1/ep1_panel_06.jpg', caption: 'VANGUARD PATROL-TRUCKS ARE TWO MINUTES OUT. IF THEY FIND THE CARGO, THE SERVICE DEBT ON MY GARAGE IS FORECLOSED.' },
    { type: 'image', url: '/assets/EP1/ep1_panel_07.jpg', caption: 'THE PACKAGE IS A HEAVY-ASS REINFORCED CASE. THE TRUNK OF THE LEMANS PROTESTS AS THE SUSPENSION BOTTOMS OUT.' },
    { type: 'image', url: '/assets/EP1/ep1_panel_08.jpg', caption: 'I RIP THE WHEEL TOWARD THE SWAMPLANDS. THE ASPHALT TURNS INTO ROTTING MUD. THE CASE IN THE BACK IS RATTLING LIKE A BOMB.' },
    { type: 'image', url: '/assets/EP1/ep1_panel_09.jpg', caption: 'THE ' + '78 LEMANS IS TEARING THROUGH THE MUD. EVERY BUMP FEELS LIKE A KICK TO THE TEETH.' },
    { type: 'image', url: '/assets/EP1/ep1_panel_10.jpg', caption: 'I POP THE CLUTCH. THE V8 BACKFIRES, SPITTING A BLUE FLAME THAT ILLUMINATES THE ROTTING MANGROVES.' },
    { type: 'image', url: '/assets/EP1/ep1_panel_11.jpg', caption: 'THE EVERGLADES. THE ROAD ENDS AT A RUSTED DOCK. FIVE SECONDS ON THE DELIVERY CLOCK.' },
    { type: 'image', url: '/assets/EP1/ep1_panel_12.jpg', caption: 'A RUGGED "FLORIDA MAN" IS WAITING ON THE PORCH OF A SHACK, HIS FINGER ON THE TRIGGER OF A SAWED-OFF SHOTGUN.' },
    { type: 'image', url: '/assets/EP1/ep1_panel_13.jpg', caption: 'I HEAVE THE CASE OUT THE WINDOW. HE DOESN\'T SAY THANK YOU. HE JUST NODS. THAT\'S AS GOOD AS A SIGNED RECEIPT.' },
    { type: 'image', url: '/assets/EP1/ep1_panel_14.jpg', caption: 'I PEEL AWAY. THE SUN IS BLEEDING OVER THE HORIZON. A COMPLETED SLIP. ONE MORE DAY OF OWNERSHIP.' },
    { type: 'title', content: 'END OF TAPE. EJECT.' }
  ],
  ep2: [
    { type: 'title', content: 'INITIALIZING CASSETTE: EPISODE 02 ("12 KNOTS - JAN 5, 1980")...' },
    { type: 'image', url: '/assets/EP2/ep2_panel_01.jpg', caption: 'THE DISPATCH TICKET WAS PRACTICALLY MELTED INTO THE DASHBOARD. SMUDGED DOT-MATRIX TEXT. "12 KNOTS."' },
    { type: 'image', url: '/assets/EP2/ep2_panel_02.jpg', caption: 'SPRING BREAK \'88. I-95 IS A RIVER OF RED BRAKE LIGHTS AND CHEAP BEER. NEON-PINK CONVERTIBLES EVERYWHERE.' },
    { type: 'image', url: '/assets/EP2/ep2_panel_03.jpg', caption: 'FOURTEEN MINUTES LEFT. I SLAM MY HAND AGAINST THE WHEEL. REYA NEEDS THAT V-SENTRY BY DAWN.' },
    { type: 'image', url: '/assets/EP2/ep2_panel_04.jpg', caption: 'I CHECK THE SIDE-BARRIER. DOWN BELOW, IN THE PITCH-BLACK WATER, I SEE THE MATTE-GREY SMUGGLER\'S YACHT.' },
    { type: 'image', url: '/assets/EP2/ep2_panel_05.jpg', caption: 'THE TARGET ISN\'T ON THE MAP. THEY INTERCEPT THE WATERLINE AT EXACTLY TWELVE KNOTS.' },
    { type: 'image', url: '/assets/EP2/ep2_panel_06.jpg', caption: 'I CUT THE WHEEL. THE LEMANS SLAMS INTO A PINK CONVERTIBLE, SHOVING IT ASIDE LIKE A TOY.' },
    { type: 'image', url: '/assets/EP2/ep2_panel_07.jpg', caption: 'I BUST THROUGH THE CONSTRUCTION BARRICADE. THE V8 IS ROARING, FIGHTING THE SWAMP MUD.' },
    { type: 'image', url: '/assets/EP2/ep2_panel_08.jpg', caption: 'AXEL: "DON\'T STALL ON ME NOW. COME ON!"' },
    { type: 'image', url: '/assets/EP2/ep2_panel_09.jpg', caption: 'I SEE THE SUNKEN CAUSEWAY. A BROKEN CONCRETE OVERPASS THAT ENDS IN A SEVENTY-FOOT DROP.' },
    { type: 'image', url: '/assets/EP2/ep2_panel_10.jpg', caption: 'I SLAM THE PEDAL INTO THE RUSTED FLOORBOARD. TIMING IS EVERYTHING.' },
    { type: 'image', url: '/assets/EP2/ep2_panel_11.jpg', caption: 'AIR. FOR THREE SECONDS, WE\'RE WEIGHTLESS. THE LEMANS IS HANGING OVER THE BLACK WATER.' },
    { type: 'image', url: '/assets/EP2/ep2_panel_12.jpg', caption: 'THE YACHT RUSHES UNDERNEATH ME. THE VIEW FROM THE WINDSHIELD IS PURE ADRENALINE.' },
    { type: 'image', url: '/assets/EP2/ep2_panel_13.jpg', caption: 'I HEAVE THE HEAVY METALLIC CASE OUT THE WINDOW. A PERFECT ARC TOWARD THE WOODEN DECK.' },
    { type: 'image', url: '/assets/EP2/ep2_panel_14.jpg', caption: 'THUD. SUCCESS. THEN THE ATLANTIC HITS THE LEMANS LIKE A BRICK WALL. A COMPLETED SLIP.' },
    { type: 'title', content: 'END OF TAPE. EJECT.' }
  ],
  ep3: [
    { type: 'title', content: 'INITIALIZING CASSETTE: EPISODE 03 ("THE AUDIT - JAN 10, 1980")...' },
    { type: 'image', url: '/assets/EP3/ep3_panel_01.jpg', caption: 'I STOOD ON THE CAUSEWAY, DRIPPING WET. THE YACHT WAS A FADING SHADOW. JOB DONE.' },
    { type: 'image', url: '/assets/EP3/ep3_panel_02.jpg', caption: 'THE LEMANS WAS HALF-SUBMERGED IN TIDAL MUD. I WINCHED HER OUT. THE ENGINE COUGHED, SPITTING GRIT.' },
    { type: 'image', url: '/assets/EP3/ep3_panel_03.jpg', caption: 'THE RADIO CRACKLED. "CUTTER. YOUR PREVIOUS SLIP IS FLAGGED FOR AUDIT. REMAIN AT YOUR COORDINATES."' },
    { type: 'image', url: '/assets/EP3/ep3_panel_04.jpg', caption: 'CORPORATE DOESN\'T SEND ACCOUNTANTS. THEY SEND VANGUARD RECOVERY—EX-SPECIAL FORCES ON A RETAINER.' },
    { type: 'image', url: '/assets/EP3/ep3_panel_05.jpg', caption: 'WHITE SEARCHLIGHTS PINNED ME AGAINST THE MANGROVES. TWO BLACK TACTICAL SUVS ADVANCING FAST.' },
    { type: 'image', url: '/assets/EP3/ep3_panel_06.jpg', caption: 'I SLAMMED THE GEAR-SHIFTER INTO REAR. THE V8 WAS ROUGH, BUT SHE STILL HAD HEART.' },
    { type: 'image', url: '/assets/EP3/ep3_panel_07.jpg', caption: 'TEAR GAS SHATTERED THE REAR WINDOW. THE CABIN FILLED WITH A WHITE, CHOKING HAZE.' },
    { type: 'image', url: '/assets/EP3/ep3_panel_08.jpg', caption: 'I HIT THE NITRO TOGGLE. JUST ENOUGH GAS LEFT FOR A FIVE-SECOND PRAYER.' },
    { type: 'image', url: '/assets/EP3/ep3_panel_09.jpg', caption: 'I TURNED THE HIGH-BEAMS DIRECTLY AT THE LEAD SUV. WE CHARGED.' },
    { type: 'image', url: '/assets/EP3/ep3_panel_10.jpg', caption: 'I RIPPED THE E-BRAKE. THE LEMANS PERFORMED A VIOLENT MUD-SLINGING PIVOT.' },
    { type: 'image', url: '/assets/EP3/ep3_panel_11.jpg', caption: 'SLAMP. I SMASHED MY REAR BUMPER INTO THEIR FRONT-WHEEL WELL. AXLE SNAPPED LIKE TWIGS.' },
    { type: 'image', url: '/assets/EP3/ep3_panel_12.jpg', caption: 'THE VANGUARD SUV FLIPPED INTO THE DITCH. MASSIVE SPLASHES OF MUDDY WATER.' },
    { type: 'image', url: '/assets/EP3/ep3_panel_13.jpg', caption: 'I HIT THE BACK-ROADS. THE SMELL OF BURNING RUBBER AND SWAMP ROT FOLLOWING ME.' },
    { type: 'image', url: '/assets/EP3/ep3_panel_14.jpg', caption: 'THE RADIO FINALLY CLEARED. "GET TO THE SAFEHOUSE, AXEL. THE BOARD IS PISSED."' },
    { type: 'title', content: 'END OF TAPE. EJECT.' }
  ],
  ep4: [
    { type: 'title', content: 'INITIALIZING CASSETTE: EPISODE 04 ("THE SILENT DISTRICT - JAN 15, 1980")...' },
    { type: 'image', url: '/assets/EP4/ep4_panel_01.jpg', caption: 'PELICAN BAY. THE WEALTHIEST FORMED-STEEL GATES IN SECTOR 2. NOISE CURFEW ENFORCED BY SNIPERS.' },
    { type: 'image', url: '/assets/EP4/ep4_panel_02.jpg', caption: '"60 DECIBELS." THAT\'S THE LIMIT. THE LEMANS IDLES AT 110. TURNING THE KEY IS A DEATH SENTENCE.' },
    { type: 'image', url: '/assets/EP4/ep4_panel_03.jpg', caption: 'I HAVE TO COAST. TWO MILES OF IDENTICAL BRUTALIST MANORS ENTIRELY ON RESIDUAL MOMENTUM.' },
    { type: 'image', url: '/assets/EP4/ep4_panel_04.jpg', caption: 'OFF-WHITE STUCCO. BLINDING FLOODLIGHTS. ZERO SHADOWS. THE ROAD IS LINED WITH COPPER MOTION SENSORS.' },
    { type: 'image', url: '/assets/EP4/ep4_panel_05.jpg', caption: 'REYA: "THE VANGUARD TEAM IS CYCLING THE ROOF-LINE. DON\'T TOUCH THE BRAKES. THE SQUEEZE WILL TRIGGER THE SWEEP."' },
    { type: 'image', url: '/assets/EP4/ep4_panel_06.jpg', caption: 'NO POWER STEERING. THE WHEEL FEELS LIKE A CEMENT BLOCK. I FIGHT IT FOR EVERY INCH.' },
    { type: 'image', url: '/assets/EP4/ep4_panel_07.jpg', caption: 'A WHITE SPOTLIGHT SNAPS ON. SILHOUETTE OF A VANGUARD GUARD ON A BALCONY. HE\'S LOOKING FOR TIRE-HUM.' },
    { type: 'image', url: '/assets/EP4/ep4_panel_08.jpg', caption: 'ONE SCRATCH. ONE DECIBEL OVER. FINAL AUDIT.' },
    { type: 'image', url: '/assets/EP4/ep4_panel_09.jpg', caption: 'THE LEMANS FINALLY LOSES MOMENTUM. WE ROLL TO A DEAD STOP AT HOUSE 404.' },
    { type: 'image', url: '/assets/EP4/ep4_panel_10.jpg', caption: 'I SLIP OUT, STAYING LOW. THE DRIVEWAY IS COVERED IN SILENT LASER-TRIPWIRES.' },
    { type: 'image', url: '/assets/EP4/ep4_panel_11.jpg', caption: 'THE DOOR OPENS. REYA STANDS THERE, SILHOUETTED BY THE HALLWAY LIGHT. SHE LOOKS STEADY.' },
    { type: 'image', url: '/assets/EP4/ep4_panel_12.jpg', caption: 'REYA: "YOU\'RE EARLY, CUTTER. TELL RILEY THE V-SENTRY IS SECURE."' },
    { type: 'image', url: '/assets/EP4/ep4_panel_13.jpg', caption: 'I HAND HER THE METALLIC GREY-BOX. SHE NODS. "NOW GET OUT BEFORE THE SHIFT CHANGE."' },
    { type: 'image', url: '/assets/EP4/ep4_panel_14.jpg', caption: 'I GET BACK IN. TWIST THE KEY. THE V8 ROARS TO LIFE. SCREW THE CURFEW. WE\'RE GONE.' },
    { type: 'title', content: 'END OF TAPE. EJECT.' }
  ],
  ep5: [
    { type: 'title', content: 'INITIALIZING CASSETTE: EPISODE 05 ("DEAD WAKE")...' },
    { type: 'image', url: '/assets/EP5/ep5_panel_01.jpg', caption: 'STILTSVILLE. THE DROWNED DISTRICT. THE ONLY PLACE IN THE GRID WHERE THE VANGUARD\'S REPO-LINKS LOSE TRACK.' },
    { type: 'image', url: '/assets/EP5/ep5_panel_02.jpg', caption: 'THE STORM ISN\'T JUST WATER. IT\'S A STATIC SHIELD. REYA SAYS THE RAIN IS WEAPONIZED BIT-STATIC.' },
    { type: 'image', url: '/assets/EP5/ep5_panel_03.jpg', caption: 'MY ALTERNATOR IS SCREAMING. THE TAPE IS SUCKING THE LEMANS DRY.' },
    { type: 'image', url: '/assets/EP5/ep5_panel_04.jpg', caption: 'REYA: "TOSS ME THE SCANNER, AXEL. AND GET THAT ENGINE OFF. YOU\'RE LEAKING MOMENTUM."' },
    { type: 'image', url: '/assets/EP5/ep5_panel_05.jpg', caption: 'SHE HEARS THE TAPE BEFORE SHE SEES IT. A HUMMING FREQUENCY THAT VIBRATES IN THE FLOODWATER.' },
    { type: 'image', url: '/assets/EP5/ep5_panel_06.jpg', caption: 'AXEL: "VANCE WANTS IT. HE OFFERED ME A READ-ONLY BACKUP OF MY MOTHER TO TURN IT OVER."' },
    { type: 'image', url: '/assets/EP5/ep5_panel_07.jpg', caption: 'REYA: "HE\'D DELETE HER THE SECOND THE TAPE HIT HIS DRIVE. THIS ISN\'T DATA, AXEL. THIS IS GEOGRAPHY."' },
    { type: 'image', url: '/assets/EP5/ep5_panel_08.jpg', caption: 'SHE CRACKS THE SHIELDING. THE NIXIE TUBES ON HER SCANNER EXPLODE INTO LIGHT.' },
    { type: 'image', url: '/assets/EP5/ep5_panel_09.jpg', caption: 'REYA: "IT\'S THE MASTER-TAPE. THE 1988 TERRAIN LOGIC. THE CITY\'S SOURCE CODE IS IN YOUR TRUNK."' },
    { type: 'image', url: '/assets/EP5/ep5_panel_10.jpg', caption: 'THE SHACKS OF STILTSVILLE ARE SHUDDERING. THE TAPE IS RESPONDING TO THE TIDE.' },
    { type: 'image', url: '/assets/EP5/ep5_panel_11.jpg', caption: 'REYA: "WHOEVER PLAYS THIS TAPE CAN REWRITE THE LAND. THEY CAN DROWN THE VANGUARD... OR EVERYONE ELSE."' },
    { type: 'image', url: '/assets/EP5/ep5_panel_12.jpg', caption: 'VANCE KNOWS. THAT\'S WHY THE REPO-TRUCKS ARE CONVERGING ON THE WATERLINE.' },
    { type: 'image', url: '/assets/EP5/ep5_panel_13.jpg', caption: 'AXEL: "I JUST WANTED TO PAY THE DEBT."' },
    { type: 'image', url: '/assets/EP5/ep5_panel_14.jpg', caption: 'REYA: "THE DEBT IS PERMANENT NOW. WELCOME TO THE OFF-GRID, COURIER."' },
    { type: 'title', content: 'END OF TAPE. EJECT.' }
  ],
  ep6: [
    { type: 'title', content: 'INITIALIZING HARDWARE: EPISODE 06 ("CUTTER\'S RUN")...' },
    { type: 'image', url: '/assets/EP6/ep6_panel_01.jpg', caption: 'STILTSVILLE. THE VANGUARD\'S PEARL-WHITE TRUCKS ARE CLOSING THE PERIMETER.' },
    { type: 'image', url: '/assets/EP6/ep6_panel_02.jpg', caption: 'REYA: "PLUG IT IN, AXEL! OVERRIDE THE INTERCEPTOR MODULE AND KEY THE NITRO!"' },
    { type: 'image', url: '/assets/EP6/ep6_panel_03.jpg', caption: 'NO MORE GAMES. VANCE WANTS THE PROTOTYPE, BUT HE\'S GOING TO HAVE TO CHASE US INTO THE MAINLAND.', effect: 'speed-vibration' },
    { type: 'image', url: '/assets/EP6/ep6_panel_04.jpg', caption: 'WE BURST THROUGH THE SHACK WALLS. NO MORE STEALTH. NO MORE COMPLIANCE.' },
    { type: 'image', url: '/assets/EP6/ep6_panel_05.jpg', caption: 'VANCE: "UNIT 404 IS RUNNING A HIGH-SPEED BREACH. PUSH THEM TO THE BRIDGE GAP."' },
    { type: 'image', url: '/assets/EP6/ep6_panel_06.jpg', caption: 'THE BAY BRIDGE IS BROKEN. A HUNDRED FEET OF NOTHING BETWEEN US AND THE MAINLAND.' },
    { type: 'image', url: '/assets/EP6/ep6_panel_07.jpg', caption: 'AT 80 MILES PER HOUR, THERE\'S NO ROOM FOR DOUBT. ONLY THE NITRO IN THE TANK AND THE HARDWARE IN THE DASH.', effect: 'nitro-burn' },
    { type: 'image', url: '/assets/EP6/ep6_panel_08.jpg', caption: 'WE FLY. PURE KINETIC ENERGY, SPITTING SMOKE AND MAGENTA FLAMES.', effect: 'nitro-burn' },
    { type: 'image', url: '/assets/EP6/ep6_panel_09.jpg', caption: 'VANCE: "HOW... HOW DID HE CLEAR THAT GAP?"', effect: 'speed-vibration' },
    { type: 'image', url: '/assets/EP6/ep6_panel_10.jpg', caption: 'THE VANGUARD TRUCKS AREN\'T BUILT FOR VELOCITY. THEY PLUNGE INTO THE ABYSS AS THE ROAD RUNS OUT.' },
    { type: 'image', url: '/assets/EP6/ep6_panel_11.jpg', caption: 'REYA: "DIRECTOR VANCE JUST LOST THE RICKENBACKER. HE\'S IN THE WATER."' },
    { type: 'image', url: '/assets/EP6/ep6_panel_12.jpg', caption: 'WE HIT THE MAINLAND. THE WORLD RETURNS TO SOLID, GRITTY ASPHALT.' },
    { type: 'image', url: '/assets/EP6/ep6_panel_13.jpg', caption: 'AXEL: "VANCE IS GONE. BUT THIS MODULE... IT\'S THE LEVERAGE WE NEED."' },
    { type: 'image', url: '/assets/EP6/ep6_panel_14.jpg', caption: 'WE AREN\'T COURIERS ANYMORE. WE\'RE THE UNINSTALLERS. WELCOME TO CUTTER\'S RUN.' },
    { type: 'title', content: 'END OF TAPE. EJECT.' }
  ],
  ep7: [
    { type: 'title', content: 'INITIALIZING HARDWARE: EPISODE 07 ("THE UNINSTALLER")...' },
    { type: 'image', url: '/assets/EP7/ep7_panel_01.jpg', caption: 'MIAMI SUBS ON BISCAYNE. THE NEON IS HALF-DEAD, BUT THE GYRO SPIT IS STILL TURNING. IT’S THE ONLY WARMTH FOR FIVE BLOCKS.' },
    { type: 'image', url: '/assets/EP7/ep7_panel_02.jpg', caption: 'REYA: "SIGNAL’S LIVE, AXEL. THE V-SENTRY JUST PINGED A VANGUARD CONVOY MOVING FLAT-BLACK THROUGH THE OVERTOWN INTERCHANGE."' },
    { type: 'image', url: '/assets/EP7/ep7_panel_03.jpg', caption: 'AXEL: (CAPTION) I LOOK AT THE LEMANS. IT’S BLEEDING OIL, BUT THE V8 IS IDLING SMOOTH. THE ENGINE IS READY FOR ONE MORE BREACH.' },
    { type: 'image', url: '/assets/EP7/ep7_panel_04.jpg', caption: 'REYA: "THEY’VE GOT A HARDWARE-CRATE DESTINED FOR VANCE’S PERSONAL OFFICE AT THE MEGAPLEX. IF WE TAKE IT, WE TAKE HIS LEVERAGE."' },
    { type: 'image', url: '/assets/EP7/ep7_panel_05.jpg', caption: 'AXEL: "PACK THE GEAR. WE’RE MOVING IN THIRTY SECONDS."' },
    { type: 'image', url: '/assets/EP7/ep7_panel_06.jpg', caption: 'AXEL: (CAPTION) I-95 NORTH. THE ASPHALT IS SLICK WITH A MIDNIGHT DRIZZLE. I HIT THE \'COLD-START\' TOGGLE. WE VANISH.', effect: 'speed-vibration' },
    { type: 'image', url: '/assets/EP7/ep7_panel_07.jpg', caption: 'AXEL: (CAPTION) I SEE THE CONVOY. THREE BLACKED-OUT BRONCOS SURROUNDING A HEAVY-DUTY PETERBILT. PROFESSIONAL. EXPENSIVE.' },
    { type: 'image', url: '/assets/EP7/ep7_panel_08.jpg', caption: 'REYA: "FEEDING THE V-SENTRY FREQUENCY INTO THE DRAWBRIDGE TRIGGERS NOW... THREE... TWO... ONE..."', effect: 'speed-vibration' },
    { type: 'image', url: '/assets/EP7/ep7_panel_09.jpg', caption: 'AXEL: (CAPTION) THE DRAWBRIDGE OVER THE MIAMI RIVER GROANS. THE TOLL-ARMS SNAP DOWN. THE CONVOY IS TRAPPED ON THE RISING STEEL.' },
    { type: 'image', url: '/assets/EP7/ep7_panel_10.jpg', caption: 'REYA: "THEY\'RE BROADSIDE! GO, AXEL! HIT THE NITRO!"', effect: 'nitro-burn' },
    { type: 'image', url: '/assets/EP7/ep7_panel_11.jpg', caption: 'AXEL: (CAPTION) THE LEMANS SCREAMS. WE HIT THE FLANK OF THE LEAD BRONCO AT NINETY. STEEL SHATTERS FIBERGLASS.', effect: 'speed-vibration' },
    { type: 'image', url: '/assets/EP7/ep7_panel_12.jpg', caption: 'AXEL: (CAPTION) I RIP THE E-BRAKE, SPINNING THE TAIL OF THE LEMANS TO BLOCK THE PETERBILT’S PATH.', effect: 'speed-vibration' },
    { type: 'image', url: '/assets/EP7/ep7_panel_13.jpg', caption: 'REYA: "GOT IT! GRAB THE CRATE!"' },
    { type: 'image', url: '/assets/EP7/ep7_panel_14.jpg', caption: 'AXEL: (CAPTION) WE’RE NOT JUST COURIERS ANYMORE. WE’RE THE UNINSTALLERS. AND VANCE IS OFFICIALLY OUT OF WARRANTY.' },
    { type: 'title', content: 'END OF TAPE. EJECT.' }
  ],
  ep8: [
    { type: 'title', content: 'INITIALIZING HARDWARE: EPISODE 08 ("THE SIEGE OF THE MARINE STADIUM")...' },
    { type: 'image', url: '/assets/EP8/ep8_panel_01.png', caption: 'MIAMI MARINE STADIUM. A CONCRETE RIBCAGE ROTTING IN THE SALT SPRAY. IT’S THE PERFECT PLACE TO DIE, AND A HELL OF A PLACE TO PARK.' },
    { type: 'image', url: '/assets/EP8/ep8_panel_02.png', caption: 'THREE BLOCKS OF HIGH-PITCHED, METALLIC SCREAMING. THE TRANSMISSION WAS A DYING GHOST.' },
    { type: 'image', url: '/assets/EP8/ep8_panel_03.png', caption: 'NO SHIFTS LEFT. JUST GRINDING GEARS AND SHATTERED SYNCHRONIZERS. THE LEMANS IS A CORPSE.' },
    { type: 'image', url: '/assets/EP8/ep8_panel_04.png', caption: 'THEY DIDN\'T HAVE TO GUESS WHERE WE WERE. THE V-SENTRY MODULE IS A HOMING BEACON.' },
    { type: 'image', url: '/assets/EP8/ep8_panel_05.png', caption: 'REYA: "I CAN\'T KILL THE SIGNAL, BUT I CAN MASK IT. IF I TAP INTO THE STADIUM’S OLD PA SYSTEM, WE MIGHT HAVE A WINDOW."' },
    { type: 'image', url: '/assets/EP8/ep8_panel_06.png', caption: 'VANCE: "CUTTER. YOU\'RE OUT OF ROAD. SURRENDER THE MODULE AND MAYBE I\'LL LET THE SWEEPERS LEAVE YOUR ORGANS IN THE CHASSIS."' },
    { type: 'image', url: '/assets/EP8/ep8_panel_07.png', caption: 'AXEL: "VANCE! YOU WANT THE MODULE? AUDIT IT YOURSELF!" (CAPTION) I PULL THE MOSSBERG FROM THE TRUNK. THE STEEL IS COLD AND HONEST.' },
    { type: 'image', url: '/assets/EP8/ep8_panel_08.png', caption: 'THE FIRST VANGUARD BRONCO CHARGES. IT IGNORES THE STAIRS, BOUNCING ITS HEAVY SHOCKS OVER THE CONCRETE LEDGES.' },
    { type: 'image', url: '/assets/EP8/ep8_panel_09.png', caption: 'THREE ROUNDS OF BUCKSHOT INTO THE RADIATOR. STEAM AND SPARKS ERUPT LIKE A GEYSER.' },
    { type: 'image', url: '/assets/EP8/ep8_panel_10.png', caption: 'A HOT, SEARING STREAK OF PAIN. THE \'UNINSTALLER\' ARC ISN\'T A GAME ANYMORE. I’M BLEEDING FOR THE FIRST TIME IN YEARS.' },
    { type: 'image', url: '/assets/EP8/ep8_panel_11.png', caption: 'REYA: "FREQUENCY SYNCED! AXEL, COVER YOUR EARS! I\'M FEEDING THE V-SENTRY PULSE DIRECTLY INTO THE STADIUM\'S HORN-SPEAKERS!"' },
    { type: 'image', url: '/assets/EP8/ep8_panel_12.png', caption: '140 DECIBELS OF INDUSTRIAL SCREECHING. THE CONCRETE CANOPY VIBRATES. A MECHANICAL SCREAM AMPLIFIED A THOUSAND TIMES.' },
    { type: 'image', url: '/assets/EP8/ep8_panel_13.png', caption: 'THE VANGUARD DRIVERS ARE BLINDED BY THE SONIC FEEDBACK. SWERVING, TIRES SCREAMING ON THE SLICK CONCRETE.' },
    { type: 'image', url: '/assets/EP8/ep8_panel_14.png', caption: 'THE LEMANS IS A CORPSE, BUT WE’RE STILL MOVING. WE VANISH INTO THE MANGROVE DARK, LEAVES RUSTLING LIKE A CLOSING WARRANTY.' },
    { type: 'title', content: 'END OF TAPE. EJECT.' }
  ],
  ep9: [
    { type: 'title', content: 'INITIALIZING HARDWARE: EPISODE 09 ("THE SHALLOWS RECLAMATION")...' },
    { type: 'image', url: '/assets/EP9/ep9_panel_01.png', caption: 'SECTOR 305-R. THE RICKENBACKER IS BREACHED, BUT THE MAINLAND IS STILL A MILE OF BLACKWATER AND RUST AWAY.' },
    { type: 'image', url: '/assets/EP9/ep9_panel_02.png', caption: 'REYA: "TRANSMISSION WAS SHREDDED ANYWAY, AXEL. IN THE SHALLOWS, WHEELS ARE JUST ANCHORS."' },
    { type: 'image', url: '/assets/EP9/ep9_panel_03.png', caption: 'AXEL: (CAPTION) THE BARNACLES GLOW WHEN THEY DETECT CORPORATE HARDWARE. RIGHT NOW, THE BAY IS SCREAMING.' },
    { type: 'image', url: '/assets/EP9/ep9_panel_04.png', caption: 'REYA: "THE JAMMERS ARE ON A 3-SECOND REBOOT CYCLE. IF WE TIME THE PUSH, WE CAN STAY UNDER THE VANGUARD’S RADAR DOMES."' },
    { type: 'image', url: '/assets/EP9/ep9_panel_05.png', caption: 'AXEL: (CAPTION) STAY GHOST. DON’T BREATHE. THE FOG SMELLS LIKE OZONE AND FAILED AUDITS.' },
    { type: 'image', url: '/assets/EP9/ep9_panel_06.png', caption: 'REYA: "CHECK THE PYLON AT HOUSE 404. THERE\'S A SCAVENGER CACHE HIDDEN IN THE LOOSE PANEL."' },
    { type: 'image', url: '/assets/EP9/ep9_panel_07.png', caption: 'DIVER: "YOU\'RE LATE FOR THE DELIVERY, CUTTER. THE TIDE IS RISING, AND VANCE\'S SONAR IS ALREADY PINGING THE FLOORBEDS."' },
    { type: 'image', url: '/assets/EP9/ep9_panel_08.png', caption: 'AXEL: "VANCE IS BLIND IN THE DARK. WE NEED A WAY ACROSS THE SHALLOWS BEFORE THE SUN HITS THE RICKENBACKER."' },
    { type: 'title', content: 'END OF TAPE. EJECT.' }
  ],
  ep10: [
    { type: 'title', content: 'INITIALIZING HARDWARE: EPISODE 10 ("THE AUDIT EXCHANGE")...' },
    { type: 'image', url: '/assets/EP10/ep10_panel_01.png', caption: 'AXEL: "THE MOTHER-BOARD. CLEAN IT UP, KALLAN. THE WHOLE SECTOR DEPENDS ON THIS DATA STREAM."' },
    { type: 'image', url: '/assets/EP10/ep10_panel_02.png', caption: 'AXEL: (CAPTION) THE SALVAGE WAS HOT, THE DEBT EVEN HOTTER. NO TURNING BACK.' },
    { type: 'image', url: '/assets/EP10/ep10_panel_03.png', caption: 'DIVER: "FOR SECTOR 404... IT LEADS DIRECTLY UNDER THE MEGAPLEX. IT\'S DRY FOR EXACTLY THREE MINUTES."' },
    { type: 'image', url: '/assets/EP10/ep10_panel_04.png', caption: 'REYA: "WE WON\'T MAKE IT IN THIS BUCKET. THE VANGUARD INTERCEPTORS MOVE AT 40 KNOTS."' },
    { type: 'image', url: '/assets/EP10/ep10_panel_05.png', caption: 'DIVER: "TAKE THE OUTCALL TURBINE. IT BYPASSES THE SONAR, BUT IT DRINKS HIGH-OCTANE LIKE A DYING MAN."' },
    { type: 'image', url: '/assets/EP10/ep10_panel_06.png', caption: 'AXEL: (CAPTION) THE EXCHANGE WAS MADE. ONE PIECE OF VANCE\'S LEGACY FOR THREE MINUTES OF INVISIBILITY.' },
    { type: 'image', url: '/assets/EP10/ep10_panel_07.png', caption: 'REYA: "THEY\'RE NOT WAITING FOR THE AUDIT. THEY\'RE LEVEL-ZEROING THE SECTOR."' },
    { type: 'image', url: '/assets/EP10/ep10_panel_08.png', caption: 'AXEL: "VANCE WANTS HIS BRAIN BACK? TELL HIM TO COME GET IT."' },
    { type: 'title', content: 'END OF TAPE. EJECT.' }
  ],
  ep11: [
    { type: 'title', content: 'INITIALIZING HARDWARE: EPISODE 11 ("THE CONCRETE SIEGE")...' },
    { type: 'image', url: '/assets/EP11/ep11_panel_01.png', caption: 'AXEL: (Caption) The Palmetto Overpass. We crawled out of the Megaplex tunnels like mold from a cracked wall. Stolen turbine, no plates, a tape that\'s worth more than the city it mapped.' },
    { type: 'image', url: '/assets/EP11/ep11_panel_02.png', caption: 'AXEL: (Caption) The radio\'s been dead for six hours. That\'s not silence—that\'s the Grid being turned off one node at a time. Vance is Level-Zeroing from the inside.' },
    { type: 'image', url: '/assets/EP11/ep11_panel_03.png', caption: 'AXEL: (Caption) I look. Three separate convoys are converging on the structure from three separate vectors. White Vanguard SUVs from the north. Low, black Cartel wedge-cars from the south. And something else—heavy, armored, military-surplus—from the east.' },
    { type: 'image', url: '/assets/EP11/ep11_panel_04.png', caption: 'REYA: (Dialogue) "Ghost-roster Vanguard. Vance\'s private off-books unit. They don\'t appear on comms. They don\'t file audits. They just collect."' },
    { type: 'image', url: '/assets/EP11/ep11_panel_05.png', caption: 'AXEL: (Caption) We ditch the turbine in the drainage canal and push on foot. The Cartel is already breaching the south gate—a pair of Countach wedges nosing through a chain-link curtain wall like knives through wet cardboard.' },
    { type: 'image', url: '/assets/EP11/ep11_panel_06.png', caption: 'AXEL: (Dialogue) "Reya. The PA tower. It\'s our only high ground."' },
    { type: 'image', url: '/assets/EP11/ep11_panel_07.png', caption: 'AXEL: (Caption) I pull the Mossberg and rack a shell. One round left in the drum after the stadium. I\'m building from scrap again.' },
    { type: 'image', url: '/assets/EP11/ep11_panel_08.png', caption: 'AXEL: (Caption) An explosion. The south wall of the Amphitheater erupts in a plume of white phosphorous. The Vanguard line breaks at the south. They pivot, pulling troops off the north perimeter.', effect: 'speed-vibration' },
    { type: 'image', url: '/assets/EP11/ep11_panel_09.png', caption: 'AXEL: (Caption) We breach the gap and sprint through the smoke. The Amphitheater\'s main floor is a battlefield—concrete dust, spinning amber lights, screaming hydraulics. We stay low, moving through the chaos.' },
    { type: 'image', url: '/assets/EP11/ep11_panel_10.png', caption: 'AXEL: (Caption) Halfway up the PA tower stairs, a Ghost-Roster operative steps out of the dark. No uniform. No insignia. Just a zip-tie on his wrist where the Vanguard patch used to be.' },
    { type: 'image', url: '/assets/EP11/ep11_panel_11.png', caption: 'AXEL: (Caption) I swing the Mossberg stock—a calculated use of the last thing I\'ve got. The operative goes down on the iron staircase with a sound like a dropped engine block.' },
    { type: 'image', url: '/assets/EP11/ep11_panel_12.png', caption: 'REYA: (Dialogue) "I\'m into the tower\'s broadcast array. I can use the Tape\'s magnetic frequency to jam every comm unit on the field simultaneously. All three factions go blind at once."' },
    { type: 'image', url: '/assets/EP11/ep11_panel_13.png', caption: 'AXEL: (Caption) The jam hits. Every comm on the field erupts in white noise. Vanguard SUVs peel in the wrong direction. Two Cartel Countaches ram each other at the south gate.' },
    { type: 'image', url: '/assets/EP11/ep11_panel_14.png', caption: 'REYA: (Dialogue) "The Tape is intact. But Axel—I found a second signal buried in the frequency. Someone else has been reading the Grid. Someone who isn\'t Vance."' },
    { type: 'title', content: 'END OF TAPE. EJECT.' }
  ],
  ep12: [
    { type: 'title', content: 'INITIALIZING HARDWARE: EPISODE 12 ("THE BREAKING POINT")...' },
    { type: 'image', url: '/assets/EP12/ep12_panel_01.png', caption: 'AXEL: (Caption) The second signal. A clean origin address. Not a corporate node. Not a Cartel relay. A single, residential broadcast terminal in the Drowned District.' },
    { type: 'image', url: '/assets/EP12/ep12_panel_02.png', caption: 'REYA: (Dialogue) "The address parses to a structure in Sector 404-Delta. That\'s three meters underwater at high tide, Axel. Nobody lives there."' },
    { type: 'image', url: '/assets/EP12/ep12_panel_03.png', caption: 'AXEL: (Caption) We move before the factions regroup. Twelve blocks east through a city that\'s been quietly turning itself off. Neon signs dark. Shops shuttered. The streets belong to the water.' },
    { type: 'image', url: '/assets/EP12/ep12_panel_04.png', caption: 'DISPATCH: (Dialogue) "...Cutter... Override Protocol... your mother\'s archive... is scheduled for... full Erasure... at 0600..."' },
    { type: 'image', url: '/assets/EP12/ep12_panel_05.png', caption: 'AXEL: (Caption) My legs stop. I\'m standing in six inches of black canal water, rain hammering my shoulders, and the world just changed pitch.' },
    { type: 'image', url: '/assets/EP12/ep12_panel_06.png', caption: 'AXEL: (Caption) Sector 404-Delta. The building is a two-story 1972 apartment block—concrete, rotting, half-submerged. But the second floor windows are lit. Pale blue CRT glow.' },
    { type: 'image', url: '/assets/EP12/ep12_panel_07.png', caption: 'KALLAN: (Dialogue) "I\'ve been reading the Tape\'s broadcast for two years. Every time Vance ran a \'Sector Format,\' I intercepted the bleed frequency and mapped what was being erased."' },
    { type: 'image', url: '/assets/EP12/ep12_panel_08.png', caption: 'AXEL: (Dialogue) "Can you extract my mother? Her archive record. Can you pull it from the Vanguard servers before 0600?"' },
    { type: 'image', url: '/assets/EP12/ep12_panel_09.png', caption: 'KALLAN: (Dialogue) "The Grid-Tape—if you play it into the central terminal at the Freedom Tower, it executes a full \'Reboot.\' Every debt record. Every repossession order. Every foreclosure file. Gone."' },
    { type: 'image', url: '/assets/EP12/ep12_panel_10.png', caption: 'REYA: (Dialogue) "But the 1970 baseline also wipes the land reclamation infrastructure. Axel... there are people living in Sector 404. They\'d be underwater within the hour."' },
    { type: 'image', url: '/assets/EP12/ep12_panel_11.png', caption: 'AXEL: (Caption) There it is. The debt of the choice. Free thousands by erasing the records—but drown the ones who built their lives in the margins.' },
    { type: 'image', url: '/assets/EP12/ep12_panel_12.png', caption: 'AXEL: (Dialogue) "Kallan. Pull my mother\'s archive. Buy me eleven minutes."' },
    { type: 'image', url: '/assets/EP12/ep12_panel_13.png', caption: 'AXEL: (Caption) The locator pulse goes out the moment Kallan hits the server. I\'m already moving—back to the street, back to the last working payphone in the Drowned District.' },
    { type: 'image', url: '/assets/EP12/ep12_panel_14.png', caption: 'AXEL: (Dialogue) "Vance. I have the Tape. And I have a proposition. You\'re going to want to hear this in person."' },
    { type: 'title', content: 'END OF TAPE. EJECT.' }
  ],
  ep13: [
    { type: 'title', content: 'INITIALIZING HARDWARE: EPISODE 13 ("THE UNINSTALLER")...' },
    { type: 'image', url: '/assets/EP13/ep13_panel_01.png', caption: 'AXEL: (Caption) The Freedom Tower. Twenty-six stories of archive servers humming behind the ornate facade. The most beautiful foreclosure filing cabinet in the Western Hemisphere.' },
    { type: 'image', url: '/assets/EP13/ep13_panel_02.png', caption: 'VANCE: (Dialogue) "You look like a car wreck, Cutter." AXEL: (Dialogue) "I\'ve been driving one."' },
    { type: 'image', url: '/assets/EP13/ep13_panel_03.png', caption: 'VANCE: (Dialogue) "Give me the Tape. Walk away. I\'ll release your mother\'s archive. Clean slate."' },
    { type: 'image', url: '/assets/EP13/ep13_panel_04.png', caption: 'AXEL: (Caption) I hit him. Clean. Hard. The way a man hits a machine that\'s been running too long without a service check.', effect: 'speed-vibration' },
    { type: 'image', url: '/assets/EP13/ep13_panel_05.png', caption: 'AXEL: (Caption) Level 14. The Grid Terminal. A room-sized mainframe of magnetic drum readers and reel-to-reel drives. The hum is physical.' },
    { type: 'image', url: '/assets/EP13/ep13_panel_06.png', caption: 'REYA: (Dialogue, over radio) "Axel. Kallan confirmed your mother\'s file is extracted and decrypted. It\'s on the reel in your jacket pocket. She is not in the server anymore."' },
    { type: 'image', url: '/assets/EP13/ep13_panel_07.png', caption: 'REYA: (Dialogue, over radio) "A selective reformat. It will execute a targeted flush—debt records, repossession orders, foreclosure files only. The infrastructure logic stays intact."' },
    { type: 'image', url: '/assets/EP13/ep13_panel_08.png', caption: 'AXEL: (Caption) I thread the Tape into the master drive. The terminal accepts it with the sound of a lock recognizing the right key for the first time.' },
    { type: 'image', url: '/assets/EP13/ep13_panel_09.png', caption: 'AXEL: (Caption) The drives spin up. The amber indicator lights across the room switch from red to a cycling heartbeat pattern.' },
    { type: 'image', url: '/assets/EP13/ep13_panel_10.png', caption: 'AXEL: (Caption) On every floor of the Freedom Tower, Vanguard screens display the same message: ARCHIVE REFORMAT IN PROGRESS. ESTIMATED COMPLETION: 14 MINUTES.' },
    { type: 'image', url: '/assets/EP13/ep13_panel_11.png', caption: 'VANCE: (Dialogue) "HALT THE PROCESS, CUTTER. RIGHT NOW." AXEL: (Caption) Eight percent complete.' },
    { type: 'image', url: '/assets/EP13/ep13_panel_12.png', caption: 'AXEL: (Caption) I put my back against the terminal and my feet against the door. Holding a door shut for six more minutes.' },
    { type: 'image', url: '/assets/EP13/ep13_panel_13.png', caption: 'AXEL: (Caption) 100%. The drives wind down. The amber lights go steady green. A quiet, analog click as the terminal reads: REFORMAT COMPLETE.' },
    { type: 'image', url: '/assets/EP13/ep13_panel_14.png', caption: 'AXEL: (Dialogue) "The Drowned District\'s debt is cleared. The infrastructure is intact. Nobody drowned tonight. File whatever audit you want."' },
    { type: 'title', content: 'END OF TAPE. END OF SEASON ONE. EJECT.' }
  ],
  ep14: [
    { type: 'title', content: 'INITIALIZING CASSETTE: EPISODE 14 ("THE VENTANITA — FEB 22, 1980")... // VOLUME 03: THE IDLE ENGINE' },
    { type: 'image', url: '/assets/EP14/ep14_panel_01.png', caption: 'AXEL: (Caption) Day fifty-three. Two days since the Freedom Tower. Two days since Vance walked away. Two days since I stopped running. I don\'t know what to do with days that aren\'t numbered.' },
    { type: 'image', url: '/assets/EP14/ep14_panel_02.png', caption: 'ELIO: "You the one Reya called about?" AXEL: "I\'m the one with the car that\'s dying." ELIO: "They\'re all dying. That\'s why I have a job."' },
    { type: 'image', url: '/assets/EP14/ep14_panel_03.png', caption: 'ELIO: "Whoever rebuilt this tranny last used parts from a Buick and a lawn mower. It\'s a miracle you made it here." AXEL: "Miracles are all I\'ve got."' },
    { type: 'image', url: '/assets/EP14/ep14_panel_04.png', caption: 'AXEL: (Caption) I walk east on 8th Street. Calle Ocho. The sidewalk smells like tobacco leaf and café con leche. A radio in a barber shop plays WQBA—somebody arguing about the grain embargo in rapid Spanish.' },
    { type: 'image', url: '/assets/EP14/ep14_panel_05.png', caption: 'AXEL: (Caption) Versailles. The ventanita. Chrome frame, shoulder height, a counter worn smooth by ten thousand elbows. Behind the glass: a woman making cafecito with the focused precision of a chemist.' },
    { type: 'image', url: '/assets/EP14/ep14_panel_06.png', caption: 'AXEL: (Caption) I order a café. She hands it through the window in a cup the size of a thimble. It\'s black, sweet enough to make my teeth ache, and strong enough to restart the LeMans\' alternator.' },
    { type: 'image', url: '/assets/ad_neon_pizza_1776301204010.png', caption: '[COMMERCIAL BREAK: NEON PIZZA - DELIVERY GUARANTEED OR YOUR DEBT FORGIVEN]' },
    { type: 'image', url: '/assets/EP14/ep14_panel_07.png', caption: 'AXEL: (Caption) The argument today is about Carter. About the Olympics. About whether boycotting Moscow will accomplish anything besides making the athletes miserable. I listen. I\'m on my third cafecito.' },
    { type: 'image', url: '/assets/EP14/ep14_panel_08.png', caption: 'DOÑA CARMEN: "Estás muy flaco. Come." AXEL: (Caption) I don\'t speak much Spanish. But I understand the language of someone who thinks you look like you\'re dying.' },
    { type: 'image', url: '/assets/EP14/ep14_panel_09.png', caption: 'AXEL: (Caption) She talks about Havana. About a bakery on Calle Obispo where they made pastelitos "not like these—better, but don\'t tell the Versailles." The pastelito is still warm. It tastes like a kitchen I\'ve never been in.' },
    { type: 'image', url: '/assets/EP14/ep14_panel_10.png', caption: 'AXEL: (Caption) Y-100 bleeds into WQBA. Michael Jackson\'s "Rock with You" fights a losing battle against a Cuban talk-show host shouting about Afghanistan. It sounds like Miami. It sounds like the city I\'ve been living in for twenty-six years without ever stopping to listen.' },
    { type: 'image', url: '/assets/dispatch_memo_artifact.png', caption: '[LORE RELIC: CONFISCATED VANGUARD DISPATCH MEMO]' },
    { type: 'image', url: '/assets/EP14/ep14_panel_11.png', caption: 'ELIO: "She\'s alive. Barely. But she\'s alive." ELIO: "My cousin says there\'s a lot of boats going back and forth to Cuba right now. More than usual. Something\'s happening down there, but nobody knows what yet."' },
    { type: 'image', url: '/assets/EP14/ep14_panel_12.png', caption: 'AXEL: (Caption) For the first time in fifty-three days, I don\'t have anywhere to be. The candle in the shop window flickers in the draft. I watch it for a long time. I\'m going to need a place to sleep tonight.' },
    { type: 'title', content: 'END OF TAPE. EJECT.' }
  ],
  ep15: [
    { type: 'title', content: 'INITIALIZING CASSETTE: EPISODE 15 ("PALM SPRINGS MILE — FEB 28, 1980")... // VOLUME 03: THE IDLE ENGINE' },
    { type: 'image', url: '/assets/EP15/ep15_panel_01.png', caption: 'AXEL: (Caption) Day fifty-nine. Elio\'s cousin came through. The donor transmission is from a \'77 Grand Prix that lost a fight with a telephone pole. Elio says the car will be ready tomorrow.' },
    { type: 'image', url: '/assets/EP15/ep15_panel_02.png', caption: 'AXEL: (Caption) Hialeah. I\'m here for a throttle body. A \'79 Pontiac unit that Elio says will give the LeMans an extra thirty horses. Palm Springs Mile. W 49th Street. The commercial strip.' },
    { type: 'image', url: '/assets/EP15/ep15_panel_03.png', caption: 'AXEL: (Caption) The bakeries are already fogged at seven AM. The line for pan cubano is out the door. Kids in Catholic school uniforms eating croquetas out of paper bags on the sidewalk. This is a neighborhood that gets up before the sun.' },
    { type: 'image', url: '/assets/EP15/ep15_panel_04.png', caption: 'HANK: "Pontiac throttle body. Seventy-nine. Yeah, I got one—maybe. Row 14, past the Chryslers. If the iguanas haven\'t eaten the gasket, it\'s yours for forty."' },
    { type: 'image', url: '/assets/ad_vanguard_loans_1776301217615.png', caption: '[COMMERCIAL BREAK: VANGUARD LOANS - EXISTENCE DEBT CONSOLIDATION]' },
    { type: 'image', url: '/assets/EP15/ep15_panel_05.png', caption: 'AXEL: (Caption) Row 14. The cars are stacked three deep—Impalas, Novas. The heat is suffocating. I find the Pontiac wedged between a rusted El Camino and a Buick Electra. My hands burn on every surface.' },
    { type: 'image', url: '/assets/EP15/ep15_panel_06.png', caption: 'HANK: "You notice anything about the yard lately? I\'m down thirty cars this month. The city\'s buying up scrap metal like they\'re building an ark. Metrorail expansion. Somebody knows something we don\'t."' },
    { type: 'image', url: '/assets/EP15/ep15_panel_07.png', caption: 'AXEL: (Caption) I pay for the throttle body and drive south. I don\'t know why I\'m going to the track. But something about a building that beautiful in a city this hard feels like a contradiction I need to see.' },
    { type: 'image', url: '/assets/EP15/ep15_panel_08.png', caption: 'AXEL: (Caption) Hialeah Park. The Grande Dame. The grandstand is white Art Deco—tiered columns, clean lines, the elegance of something designed before the world learned to cut corners.' },
    { type: 'image', url: '/assets/artifact_lemans_blueprints.png', caption: '[LORE RELIC: CONFISCATED BLUEPRINTS - PONTIAC LEMANS 1978]' },
    { type: 'image', url: '/assets/EP15/ep15_panel_09.png', caption: 'AXEL: (Caption) And the flamingos. They stand in the shallow water like they\'re waiting for instructions that were cancelled forty years ago. Pink. Absurdly, impossibly pink. They\'ve decided this is where they live.' },
    { type: 'image', url: '/assets/EP15/ep15_panel_10.png', caption: 'AXEL: (Caption) On the way back, I pass a botanica. BOTANICA SIETE POTENCIAS. Seven Powers. The door is open. The smell of sandalwood and copal resin stops me on the sidewalk like a hand on my chest.' },
    { type: 'image', url: '/assets/EP15/ep15_panel_11.png', caption: 'YOLANDA: "You don\'t need to know who it\'s for. The flame knows." She lights the white candle with a kitchen match. The smoke smells like a promise I haven\'t made yet.' },
    { type: 'image', url: '/assets/EP15/ep15_panel_12.png', caption: 'AXEL: (Caption) I pay for the candle. Three dollars. She wraps the base in aluminum foil so the wax won\'t drip in the car. I walk out into the 95-degree Hialeah afternoon.' },
    { type: 'image', url: '/assets/EP15/ep15_panel_13.png', caption: 'AXEL: (Caption) Carrying a lit candle in one hand and a Pontiac throttle body in the other. The contrast feels right. The machine and the spirit. Both need oxygen to burn.' },
    { type: 'image', url: '/assets/EP15/ep15_panel_14.png', caption: 'AXEL: (Caption) I drive south with a candle burning in the cupholder. The smoke bends west in the slipstream. The flamingos don\'t move. The roosters don\'t stop. And Queen tells me it\'s a crazy little thing. It is.' },
    { type: 'title', content: 'END OF TAPE. EJECT.' }
  ],
  ep16: [
    { type: 'title', content: 'INITIALIZING CASSETTE: EPISODE 16 ("THE MESH — MARCH 5, 1980")... // VOLUME 03: THE IDLE ENGINE' },
    { type: 'image', url: '/assets/EP16/ep16_panel_01.png', caption: 'AXEL: (Caption) Day sixty-five. The LeMans is back. Elio rebuilt her transmission with the Grand Prix donor and tuned the idle until she purrs like a lie told with confidence.' },
    { type: 'image', url: '/assets/EP16/ep16_panel_02.png', caption: 'REYA: (Dialogue, over radio) "Simple delivery. Sealed envelope. Take it to NE 54th Street, Little Haiti. A man named Jean-Pierre will be waiting at the church. Don\'t open it. Don\'t ask."' },
    { type: 'image', url: '/assets/EP16/ep16_panel_03.png', caption: 'AXEL: (Caption) I drive north on I-95. The transition to Little Haiti is instantaneous. Storefronts painted in vivid blues and yellows. The sidewalks lined with crates of plantains and yams.' },
    { type: 'image', url: '/assets/EP16/ep16_panel_04.png', caption: 'AXEL: (Caption) The Vanguard\'s thermal trackers don\'t work here. The dashboard Scanner went silent. Like the frequency doesn\'t exist in this airspace.' },
    { type: 'image', url: '/assets/EP16/ep16_panel_05.png', caption: 'AXEL: (Caption) Notre Dame d\'Haiti. A modest church. Inside: the smell of incense and floor wax. A mural of the Virgin Mary on the back wall, her face dark-skinned and impossibly serene.' },
    { type: 'image', url: '/assets/artifact_soul_contract.png', caption: '[LORE RELIC: DEFAULT LIABILITY AGREEMENT - NEON SLIPSTREAM INC.]' },
    { type: 'image', url: '/assets/EP16/ep16_panel_06.png', caption: 'AXEL: (Caption) A man is sitting in the last pew, soldering something that looks like a radio antenna coiled on his lap.wire-rimmed glasses, precise hands. He looks like someone who works with frequencies.' },
    { type: 'image', url: '/assets/EP16/ep16_panel_07.png', caption: 'JEAN-PIERRE: (Dialogue) "The Mesh. The Americans built a grid to watch us. So we built a grid they can\'t see. It doesn\'t block their signal—it bends it. Like light through water."' },
    { type: 'image', url: '/assets/EP16/ep16_panel_08.png', caption: 'JEAN-PIERRE: (Dialogue) "An immigrant chooses to leave. A refugee is chosen. We didn\'t decide to come to Miami. Miami was decided for us. So we built our own system. Run by people who learned to build a grid without permission."' },
    { type: 'image', url: '/assets/EP16/ep16_panel_09.png', caption: 'AXEL: (Caption) We sit on the church steps and drink Prestige beer as the sun drops. The air smells like charcoal grills and frying plantains. A radio inside the store plays Haitian compas.' },
    { type: 'image', url: '/assets/EP16/ep16_panel_10.png', caption: 'JEAN-PIERRE: (Dialogue) "The Coast Guard channels have been busy. Encrypted traffic tripling in two weeks. This is different. This is the government watching something they don\'t want to stop. They\'re watching it come."' },
    { type: 'image', url: '/assets/EP16/ep16_panel_11.png', caption: 'AXEL: (Caption) For fifteen minutes, I\'m not a courier, not a fugitive. I\'m just a guy with a beer, watching kids play soccer in a neighborhood the city pretends doesn\'t exist.' },
    { type: 'image', url: '/assets/ad_junkyard_1776301231267.png', caption: '[COMMERCIAL BREAK: DOCKERY SALVAGE - WE BUY SCRAP. WE DON\'T ASK QUESTIONS.]' },
    { type: 'image', url: '/assets/EP16/ep16_panel_12.png', caption: 'AXEL: (Caption) I drive south as the streetlights flicker on. The Mesh-Network\'s invisible grid hums above me. In the rearview, the church steeple shrinks. A crude short-wave array lashed to the bell tower. A middle finger aimed at every satellite in orbit.' },
    { type: 'title', content: 'END OF TAPE. EJECT.' }
  ],
  ep17: [
    { type: 'title', content: 'INITIALIZING CASSETTE: EPISODE 17 ("EARLY BIRD — MARCH 10, 1980")... // VOLUME 03: THE IDLE ENGINE' },
    { type: 'image', url: '/assets/EP17/ep17_panel_01.png', caption: 'AXEL: (Caption) Day seventy. The LeMans is running clean. Elio\'s transmission rebuild is holding. Third gear engages like a handshake. Fourth gear hums.' },
    { type: 'image', url: '/assets/EP17/ep17_panel_02.png', caption: 'AXEL: (Caption) I pass the Broward line without meaning to. The road doesn\'t change. The exits do. HOLLYWOOD BOULEVARD. The names stop sounding Cuban and start sounding like a retirement brochure.' },
    { type: 'image', url: '/assets/EP17/ep17_panel_03.png', caption: 'AXEL: (Caption) Hollywood Beach. The Condo Canyon. A wall of high-rise condominiums lining the coast like a concrete fortress built to repel the concept of old weather.' },
    { type: 'image', url: '/assets/ad_elios_transmission_1776303670915.png', caption: '[COMMERCIAL BREAK: ELIO\'S TRANSMISSIONS - WE DO NOT ACCEPT VANGUARD CREDIT]' },
    { type: 'image', url: '/assets/EP17/ep17_panel_04.png', caption: 'AXEL: (Caption) I find a deli on A1A. The smell of pastrami and rye bread hits me in the sinuses like a telegram from a city I\'ve never visited. I sit in a booth—cracked red vinyl, Formica tabletop.' },
    { type: 'image', url: '/assets/EP17/ep17_panel_05.png', caption: 'WAITRESS: "Sour or seedless?" AXEL: "Sour." AXEL: (Caption) I don\'t know why I said that. I\'ve never had a preference about rye bread in my life. But it sounded right.' },
    { type: 'image', url: '/assets/EP17/ep17_panel_06.png', caption: 'SOL: "The corned beef here is a felony. I\'m Sol. Sol Abramowitz. Formerly of the Bronx. You don\'t look like you\'re from around here." AXEL: "I\'m from Miami." SOL: "Nobody\'s from Miami. Miami is where people end up."' },
    { type: 'image', url: '/assets/EP17/ep17_panel_07.png', caption: 'AXEL: (Caption) Sol Abramowitz is seventy-four. Retired garment-industry foreman. He lives in a condo on the eighteenth floor. He talks about his wife Miriam. He says the corned beef is a crime against the Bronx. He\'s right.' },
    { type: 'image', url: '/assets/ad_straits_vhs_1776303697494.png', caption: '[COMMERCIAL BREAK: VIDEO-MAX RENTALS] "STRAITS RUNNER: THE MARIEL DASH"' },
    { type: 'image', url: '/assets/EP17/ep17_panel_08.png', caption: 'SOL: "My Miriam. That was \'62. She hated Florida. Said the humidity ruined her hair. But she came every winter because I loved it." AXEL: (Caption) He puts the photo back carefully. I think about the tape in my own pocket. Both of us carrying ghosts.' },
    { type: 'image', url: '/assets/EP17/ep17_panel_09.png', caption: 'AXEL: (Caption) Sol orders pie. I stay longer than I should. "Do That to Me One More Time" plays on the speakers. I catch myself almost smiling. The muscle memory is still there, rusted but functional.' },
    { type: 'image', url: '/assets/EP17/ep17_panel_10.png', caption: 'RADIO (WIOD): "Dade County police officers involved in the beating death of Arthur McDuffie have been formally indicted... trial moved to Tampa." AXEL: (Caption) I change the station. The skyline gets closer. The haze doesn\'t clear.' },
    { type: 'title', content: 'END OF TAPE. EJECT.' }
  ],
  ep18: [
    { type: 'title', content: 'INITIALIZING CASSETTE: EPISODE 18 ("THE INFIELD — MARCH 15, 1980")... // VOLUME 03: THE IDLE ENGINE' },
    { type: 'image', url: '/assets/EP18/ep18_panel_01.png', caption: 'AXEL: (Caption) Day seventy-five. The Rickenbacker Causeway at night. Two miles of concrete over black water. I hit the toll basket with exact change. The gate lifts. The LeMans\' headlights cut a tunnel through the salt air.' },
    { type: 'image', url: '/assets/EP18/ep18_panel_02.png', caption: 'AXEL: (Caption) Key Biscayne. The anti-Miami. The streets are dark by design. No neon. Just the sound of the Atlantic. Nixon kept a house here. Even the President needed a place where the phone didn\'t ring.' },
    { type: 'image', url: '/assets/EP18/ep18_panel_03.png', caption: 'AXEL: (Caption) I drive to the end of the road. Bill Baggs Cape Florida State Park. The lighthouse is ahead—a white tower against stars. The beam sweeps overhead every thirty seconds. Light. Dark.' },
    { type: 'image', url: '/assets/EP18/ep18_panel_04.png', caption: 'AXEL: (Caption) I sit on the seawall. The wind smells like salt and the particular kind of nothing that exists only on the edge of a continent at one in the morning.' },
    { type: 'image', url: '/assets/ad_compliance_cuff_1776303683336.png', caption: '[COMMERCIAL BREAK: NEON SLIPSTREAM INC] "THE VANGUARD COMPLIANCE CUFF"' },
    { type: 'image', url: '/assets/EP18/ep18_panel_05.png', caption: 'AXEL: (Caption) I reach into my jacket. The tape reel. Twenty minutes of my mother\'s voice. I\'ve been carrying it for twenty-three days. I\'m afraid that what\'s on it will be exactly what I remember.' },
    { type: 'image', url: '/assets/EP18/ep18_panel_06.png', caption: 'AXEL: (Caption) I thread the tape. My hands are shaking. I don\'t know if it\'s the cold or the three cafecitos or the fact that I\'m about to hear a ghost.' },
    { type: 'image', url: '/assets/EP18/ep18_panel_07.png', caption: 'AXEL: (Caption) Her voice. Warm. Tired. "Axel. It\'s late. You should be sleeping. But I wanted to tell you a story... the story of the fish and the moon."' },
    { type: 'image', url: '/assets/EP18/ep18_panel_08.png', caption: 'MOTHER (on tape): "The moon said: \'Because the night is when the lost things need the most light.\'" AXEL: (Caption) She recorded this the night before they took her. She must have known. She made a bedtime story sound like a goodbye.' },
    { type: 'image', url: '/assets/ad_survival_mail_order_1776303713556.png', caption: '[COMMERCIAL BREAK: GRID-GHOST SURVIVAL SUPPLY] MAIL-ORDER FORM' },
    { type: 'image', url: '/assets/EP18/ep18_panel_09.png', caption: 'AXEL: (Caption) I rewind the tape. I play it again. The lighthouse beam sweeps. The sound rewrites something in my chest that I didn\'t know was still running code.' },
    { type: 'image', url: '/assets/EP18/ep18_panel_10.png', caption: 'AXEL: (Caption) Dawn comes slowly. Faint engine sounds from the Florida Straits. Boat engines, moving north. Something is coming. I drive back toward the mainland. The night is when the lost things need the most light.' },
    { type: 'title', content: 'END OF TAPE. EJECT.' },
    { type: 'title', content: 'END OF VOLUME 03: THE IDLE ENGINE.' }
  ]
}

let activePages = []
let currentPage = 0
let timer = 1799 // 29:59 in seconds

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

setInterval(() => {
  if (timer > 0) {
    timer--
    timerDisplay.textContent = formatTime(timer)
    
    // Update Audio degradation every second
    audioEngine.updateMood(currentPage, timer);

    if (audioEngine.isEnabled && readerView.classList.contains('active')) {
      sfxNixie.currentTime = 0;
      sfxNixie.play().catch(e => console.log(e))
    }
  } else {
    timerDisplay.textContent = "00:00"
    timerDisplay.style.color = "white"
    timerDisplay.style.animation = "blink 0.5s infinite"
  }
}, 1000)

function renderPage(index) {
  // Trigger VHS glitch
  app.classList.remove('glitch-flash')
  void app.offsetWidth // trigger reflow
  app.classList.add('glitch-flash')

  if (activePages.length === 0) return;

  const page = activePages[index]
  
  // Update Audio Mood for the current page
  audioEngine.updateMood(index, timer);

    if (page.type === 'title') {
      app.innerHTML = `<h1 class="sys-message" style="text-align: center; margin-top: 20%; padding: 40px; color: #ffeb3b;">${page.content}</h1>`
      tapeStatus.textContent = 'SEEKING...'
    } else if (page.type === 'image') {
      const isEP9 = activePages === episodes.ep9;
      app.innerHTML = `
        <div style="flex: 1; display:flex; justify-content: center; align-items: center; width: 100%; min-height: 0;" class="${page.effect || ''} ${isEP9 ? 'radioactive-fog' : ''}">
          <img src="${page.url}" class="comic-panel" />
          ${page.effect === 'nitro-burn' ? '<div class="motion-blur-overlay"></div>' : ''}
        </div>
        <div class="caption-hud">
          ${page.caption}
        </div>
      `
      tapeStatus.textContent = `PLAYING: TRK 0${index}`
    }
  }

// Rewire routing to handle Episode swapping dynamically
document.querySelector('#btn-play-ep1').addEventListener('click', () => {
  activePages = episodes.ep1;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep1');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep2').addEventListener('click', () => {
  activePages = episodes.ep2;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep2');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep3').addEventListener('click', () => {
  activePages = episodes.ep3;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep3');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep4').addEventListener('click', () => {
  activePages = episodes.ep4;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep4');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep5').addEventListener('click', () => {
  activePages = episodes.ep5;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep5');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep6').addEventListener('click', () => {
  activePages = episodes.ep6;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep6');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep7').addEventListener('click', () => {
  activePages = episodes.ep7;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep7');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep8').addEventListener('click', () => {
  activePages = episodes.ep8;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep8');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep9').addEventListener('click', () => {
  activePages = episodes.ep9;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep9');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep10').addEventListener('click', () => {
  activePages = episodes.ep10;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep10');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep11').addEventListener('click', () => {
  activePages = episodes.ep11;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep11');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep12').addEventListener('click', () => {
  activePages = episodes.ep12;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep12');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep13').addEventListener('click', () => {
  activePages = episodes.ep13;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep13');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep14').addEventListener('click', () => {
  activePages = episodes.ep14;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep14');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep15').addEventListener('click', () => {
  activePages = episodes.ep15;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep15');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep16').addEventListener('click', () => {
  activePages = episodes.ep16;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep16');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep17').addEventListener('click', () => {
  activePages = episodes.ep17;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep17');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep18').addEventListener('click', () => {
  activePages = episodes.ep18;
  currentPage = 0; timer = 1799; 
  audioEngine.startEpisode('ep18');
  renderPage(0);
  switchView('reader-view')
})

btnNext.addEventListener('click', () => {
  if (currentPage < activePages.length - 1) {
    currentPage++
    renderPage(currentPage)
    if (!audio.paused) { sfxClack.currentTime = 0; sfxClack.play().catch(e => console.log(e)); }
  }
})

btnPrev.addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage--
    renderPage(currentPage)
    if (audioEngine.isEnabled) { sfxClack.currentTime = 0; sfxClack.play().catch(e => console.log(e)); }
  }
})

// --- AUDIO ENGINE UPGRADE ---
class AudioEngine {
  constructor() {
    this.layers = {
      base: document.querySelector('#ambient-audio'),
      pulse: new Audio('/audio/ep7_stem_pulse.wav'),
      drone: new Audio('/audio/ep7_stem_drone.wav'),
      static: new Audio('/audio/ep7_stem_static.wav'),
      swamp: new Audio('/audio/ep9_stem_swamp.wav')
    };

    // Setup loops
    Object.values(this.layers).forEach(audio => {
      if (audio) {
        audio.loop = true;
        audio.volume = 0;
      }
    });

    this.activeEpisode = null;
    this.isEnabled = false;
  }

  startEpisode(epId) {
    this.activeEpisode = epId;
    this.resetVolumes();
    
    // Toggle Volume 2 Theme
    if (epId === 'ep7' || epId === 'ep8' || epId === 'ep9') {
      document.body.classList.add('theme-vol2');
    } else {
      document.body.classList.remove('theme-vol2');
    }

    if (this.isEnabled) {
      this.playAll();
    }
  }

  resetVolumes() {
    Object.values(this.layers).forEach(a => { if(a) a.volume = 0; });
    
    if (this.activeEpisode === 'ep7') {
      this.layers.drone.volume = 0.6;
      this.layers.static.volume = 0; // Disabled as per user preference
      this.layers.pulse.volume = 0.3; 
    } else if (this.activeEpisode === 'ep9') {
      this.layers.drone.volume = 0.4;
      this.layers.swamp.volume = 0.7;
    } else {
      if(this.layers.base) this.layers.base.volume = 0.8;
    }
  }

  playAll() {
    Object.values(this.layers).forEach(a => {
      if(a) a.play().catch(e => console.log("Audio playback deferred:", e));
    });
  }

  pauseAll() {
    Object.values(this.layers).forEach(a => { if(a) a.pause(); });
  }

  setMute(isMuted) {
    this.isEnabled = !isMuted;
    if (this.isEnabled) this.playAll();
    else this.pauseAll();
    
    // Save state to local storage if needed, but for now just live
  }

  updateMood(panelIndex, timerSeconds) {
    if (this.activeEpisode !== 'ep7' || !this.isEnabled) return;

    // 1. Dynamic Escalation for Pursuit (Panels 10-12)
    if (panelIndex >= 10 && panelIndex <= 12) {
      this.layers.pulse.volume = 0.8; // Heavy intensity
      this.layers.drone.volume = 0.4;
    } else if (panelIndex >= 6) {
      this.layers.pulse.volume = 0.5; // Moving
    } else {
      this.layers.pulse.volume = 0.3; // Idle at Miami Subs
    }

    // 2. Tape Degradation logic (Disabled as per user preference for cleaner audio)
    /*
    const degradation = 1.0 - (timerSeconds / 1800);
    this.layers.static.volume = 0.05 + (degradation * 0.1);
    
    if (degradation > 0.5) {
      const wobble = Math.sin(Date.now() / 200) * 0.03;
      this.layers.pulse.volume = Math.max(0, this.layers.pulse.volume + wobble);
    }
    */
  }
}

const audioEngine = new AudioEngine();

// Audio toggle logic
const sfxClack = new Audio('/audio/sfx_clack.wav')
const sfxNixie = new Audio('/audio/sfx_nixie.wav')
document.querySelector('#ambient-toggle').addEventListener('change', (e) => {
  audioEngine.setMute(!e.target.checked);
})

// Interactive Map logic
const mapNodes = document.querySelectorAll('.map-node')
const mapModal = document.getElementById('map-modal')
const mapModalImg = document.getElementById('map-modal-img')
const mapModalTitle = document.getElementById('map-modal-title')

mapNodes.forEach(node => {
  node.addEventListener('click', (e) => {
    mapModalImg.src = e.target.getAttribute('data-img')
    mapModalTitle.textContent = e.target.getAttribute('data-desc')
    mapModal.style.display = 'flex'
  })
})

document.getElementById('close-map-modal').addEventListener('click', () => {
    mapModal.style.display = 'none'
})
