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
  if (archiveView) { archiveView.classList.remove('active'); archiveView.classList.add('hidden'); }

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
document.querySelector('#nav-to-vol4').addEventListener('click', () => switchMenuScreen('menu-vol4-episodes'))
document.querySelector('#nav-to-vol5').addEventListener('click', () => switchMenuScreen('menu-vol5-episodes'))

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
    { type: 'title', content: 'END OF TAPE. EJECT.' }
  ],
  ep19: [
    { type: 'title', content: 'INITIALIZING CASSETTE: EPISODE 19 ("THE FIRST WAVE — APRIL 15, 1980")... // VOLUME 04: THE SURGE' },
    { type: 'image', url: '/assets/EP19/ep19_panel_01.png', caption: 'AXEL (CAPTION): Torrential Miami afternoon downpour. The ’78 LeMans is parked half-under a rusted tin overhang in Sector H.' },
    { type: 'image', url: '/assets/EP19/ep19_panel_02.png', caption: 'JEAN-PIERRE (CAPTION): "You’re lucky the salt didn’t eat through the coaxial. Vanguard\'s thermal ping would have lit you up on the Causeway."' },
    { type: 'image', url: '/assets/EP19/ep19_panel_03.png', caption: 'JEAN-PIERRE (CAPTION): "My receivers were screaming all night anyway. Channel 16. Coast Guard frequencies."' },
    { type: 'image', url: '/assets/EP19/ep19_panel_04.png', caption: 'JEAN-PIERRE (CAPTION): "Not Vanguard. Unfiltered marine engines. Hundreds of them. Coming straight north up the Straits."' },
    { type: 'image', url: '/assets/EP19/ep19_panel_05.png', caption: 'AXEL (CAPTION): "...I know. I heard them at the Lighthouse."' },
    { type: 'image', url: '/assets/EP19/ep19_panel_06.png', caption: 'AXEL (CAPTION): I rip the LeMans out of the mud of Sector H. The Vanguard wasn\'t just doing radio sweeps. They were drawing a net.' },
    { type: 'image', url: '/assets/EP19/ep19_panel_07.png', caption: 'AXEL (CAPTION): Calle Ocho in a torrential storm. The neon lights of Versailles reflect in massive puddles. Police cruisers are already moving to blockade points.' },
    { type: 'image', url: '/assets/EP19/ep19_panel_08.png', caption: 'AXEL: "Carmen. You need to lock this down. The Straits are flooded with—"' },
    { type: 'image', url: '/assets/EP19/ep19_panel_09.png', caption: 'DOÑA CARMEN: She doesn\'t blink. She racks a shell into her shotgun with the smooth, terrifying precision of an espresso machine. "I know."' },
    { type: 'image', url: '/assets/EP19/ep19_panel_10.png', caption: 'DOÑA CARMEN: "Vance is locking down the coast early. I need you to run these bypass-transmitters to the docks right now, or thousands walk straight into the nets."' },
    { type: 'image', url: '/assets/EP19/ep19_panel_11.png', caption: 'AXEL (CAPTION): The pitch-black docks. The Atlantic is churning. Over my dashboard, Coast Guard frequencies scream about hundreds of unregistered vessels.' },
    { type: 'image', url: '/assets/EP19/ep19_panel_12.png', caption: 'AXEL (CAPTION): A cigarette boat cuts through the rain. It\'s packed with exhausted, terrified refugees. They barely survived the ocean.' },
    { type: 'image', url: '/assets/EP19/ep19_panel_13.png', caption: 'AXEL (CAPTION): I hand down the heavy analog radios. "Keep these on. They jam Vanguard\'s trackers. Go dark and run north."' },
    { type: 'image', url: '/assets/EP19/ep19_panel_14.png', caption: 'AXEL (CAPTION): A mile down the beach, heavily armored corporate repo-trucks establish a perimeter. Director Vance, personally overseeing the nets.' },
    { type: 'image', url: '/assets/EP19/ep19_panel_15.png', caption: 'AXEL (CAPTION): I slide back into the driver\'s seat. First gear. The boat vanishes into the dark fog. Let the Vanguard scan the shore. Tonight, they only catch the ghosts.' },
    { type: 'title', content: 'END OF TAPE. EJECT.' },
    { type: 'title', content: 'END OF VOLUME 03: THE IDLE ENGINE.' }
  ],
  ep20: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 20 (\"THE WATER LEVEL\")... // VOLUME 03: THE IDLE ENGINE"
    },
    {
      "type": "image",
      "url": "/assets/EP20/ep20_panel_01.png",
      "caption": "AXEL: (Caption) The transmission shifts clean. The rebuilt Turbo-Hydramatic grabs each gear exactly where it should \u2014 no slip, no lag, no argument. The Stewart-Warner gauges sit level. Oil pressure good. Temp good. Voltage good. The Nixie timer reads 11:07 in calm amber and I've been driving for forty minutes and there is nothing wrong with this car. AXEL: (Caption) I keep waiting for it. The pull. The shimmy through the wheel. The knock from somewhere deep in the drivetrain that would tell me something survived the bridge. Nothing comes. The LeMans has been fixed and the LeMans doesn't know how to lie about itself. AXEL: (Caption) I'm the only one in this car who does."
    },
    {
      "type": "image",
      "url": "/assets/EP20/ep20_panel_02.png",
      "caption": "AXEL: (Caption) Three in the afternoon, post-rain. Brickell Avenue. The asphalt is still wet and doing that thing Miami asphalt does when the sun comes back \u2014 steaming, breathing, releasing heat it's been building since June. The bay is lit up to the east. Everything looks clean from a moving car. AXEL: (Caption) I take the long way. There's no reason for the long way. I take it anyway."
    },
    {
      "type": "image",
      "url": "/assets/EP20/ep20_panel_03.png",
      "caption": "AXEL: (Caption) The marina at Brickell. I slow down without meaning to. AXEL: (Caption) Half the slips are bare. Dock lines hanging off the cleats with nothing attached \u2014 swaying in the cross-breeze, useless, looking for the weight they used to hold. The cigarette boats are gone. The sport fishers, the twin-engine Bertrams that usually sit four-deep in the southern slips. Gone. The southern end went first. AXEL: (Caption) Someone left in a hurry. Several someones. I don't know what they know that I don't."
    },
    {
      "type": "image",
      "url": "/assets/EP20/ep20_panel_04.png",
      "caption": "AXEL: (Caption) The delivery is a Brickell high-rise, service entrance off the side street. Unmarked box, standard handoff, nothing unusual on paper. AXEL: (Caption) The doorman clocks the LeMans from twenty feet with the specific look of a man who has learned to mistake proximity to money for having it. He's wearing a blue blazer with a small gold pin. He processes me and the car and the unmarked box and arrives at a conclusion I don't bother correcting. AXEL: (Caption) He waves me through without looking me in the eye. I prefer it that way."
    },
    {
      "type": "image",
      "url": "/assets/EP20/ep20_panel_05.png",
      "caption": "AXEL: (Caption) Fourteenth floor. Apartment 1408. The door opens before I knock \u2014 she was watching through the peephole, which tells me she knows how to wait for something. AXEL: (Caption) She's in her seventies, housedress, a dishcloth in her hands. Behind her the apartment is warm and dense \u2014 sofrito and something baking and the close smell of a small space lived in well. She looks at my face the way people sometimes look at faces they recognize from somewhere they can't quite place. AXEL: (Caption) She isn't looking at the box. WOMAN: (Dialogue) \"You have your father's posture.\" AXEL: (Caption) I don't know what to do with that. I leave the box. I take the stairs."
    },
    {
      "type": "image",
      "url": "/assets/EP20/ep20_panel_06.png",
      "caption": "AXEL: (Caption) In the service elevator going down, alone \u2014 she hands me a small folded index card on the way out. Blue ink, careful cursive on heavyweight card stock. The kind of handwriting that learned on ruled paper fifty years ago and never had a reason to change. AXEL: (Caption) I read it going down fourteen floors. AXEL: (Caption) *Arroz con leche, serves 4. 1 cup rice, 2 cups milk, \u00bd cup evaporated milk, \u00bd cup sugar, 1 cinnamon stick, zest of 1 lemon. Do not rush the milk.* AXEL: (Caption) I read it twice. I don't know what to do with it. I fold it back the way she folded it."
    },
    {
      "type": "image",
      "url": "/assets/EP20/ep20_panel_07.png",
      "caption": "AXEL: (Caption) Left jacket pocket. The tape has been out of this pocket since the lighthouse \u2014 eleven days. The pocket has been empty since then. I kept reaching for it and finding nothing, which is its own kind of conversation. AXEL: (Caption) The index card goes in. It settles at the bottom of the pocket, light, smaller than the tape but heavier than nothing. AXEL: (Caption) That's something."
    },
    {
      "type": "image",
      "url": "/assets/EP20/ep20_panel_08.png",
      "caption": "AXEL: (Caption) Back past the marina. Same dock lines. Same bare slips. The LeMans reflects in the standing water on the dock road \u2014 long car, low profile, moving south. AXEL: (Caption) Whoever left in a hurry knew something was coming. I'm operating on the assumption that I'll know what it is when it arrives. AXEL: (Caption) That assumption has never been right."
    },
    {
      "type": "image",
      "url": "/assets/EP20/ep20_panel_09.png",
      "caption": "AXEL: (Caption) Blinker is on the roof of the laundromat when I get back. On the milk crate just inside the container doors \u2014 he's moved the index card, unfolded it, and set it in the sun. His good eye tracks me up the stairs. The other socket is pointed at the bay. AXEL: (Caption) He has opinions. He always has opinions. He expresses them through positioning and timing and the occasional strategic placement of a mango he wants someone else to cut. AXEL: (Caption) The mango is already cut. He cut it himself. AXEL: (Caption) I sit on the tar roof next to a five-foot iguana in the late afternoon heat and I read a recipe card and I try to figure out what the woman at 1408 was actually handing me. AXEL: (Caption) The city is quiet. The pocket has something in it. The steering wheel comes back to center on its own. AXEL: (Caption) That's enough for a Thursday. --- **[END OF EPISODE 20]**"
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep21: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 21 (\"DOCKERY'S\")... // VOLUME 03: THE IDLE ENGINE"
    },
    {
      "type": "image",
      "url": "/assets/EP21/ep21_panel_01.png",
      "caption": "AXEL: (Caption) The front end has been pulling left since the Rickenbacker jump. Not dramatically \u2014 not enough to fight. Just a suggestion. A persistent, quiet argument from the steering geometry that something isn't aligned the way it used to be. AXEL: (Caption) Elio is the only person I trust with the LeMans' bones. He doesn't ask what I did to it. He already knows I did something. He just wants to know how bad."
    },
    {
      "type": "image",
      "url": "/assets/EP21/ep21_panel_02.png",
      "caption": "AXEL: (Caption) Elio Vald\u00e9s runs his garage out of a converted auto-body shop on SW 8th Street \u2014 a low, wide building with a corrugated metal roll-up door that's perpetually half-open, like it can't commit to being either a business or a cave. The hand-painted sign above the door says V\u00c1LDES AUTO in faded red. Beneath it, in smaller letters that someone added later: *se habla mec\u00e1nica.* AXEL: (Caption) Inside: organized chaos. A 1977 Cutlass Supreme on a rolling jack, missing its hood. A boat engine strapped to a workbench with no boat attached \u2014 a 350 Mercruiser, completely out of context, surrounded by torque wrenches like a patient mid-surgery. The smell of gear oil and cigarette smoke and the specific metallic tang of a grinder recently used."
    },
    {
      "type": "image",
      "url": "/assets/EP21/ep21_panel_03.png",
      "caption": "AXEL: (Caption) Elio looks at the LeMans the way doctors look at X-rays. Not at the surface \u2014 through it. ELIO: (Dialogue) \"Pull it in. Full in. Stop.\" AXEL: (Caption) He walks the perimeter slowly, not touching anything yet. His nephew Ricky, seventeen, is watching from a folding chair in the corner, doing homework on a clipboard. He looks up when I pull in and goes back to his homework. People bringing destroyed cars to Elio is background noise to Ricky."
    },
    {
      "type": "image",
      "url": "/assets/EP21/ep21_panel_04.png",
      "caption": "AXEL: (Caption) Elio gets flat on the creeper and slides under before I've finished killing the engine. ELIO: (Dialogue, from under the car) \"When did this start?\" AXEL: (Dialogue) \"March.\" ELIO: (Dialogue) \"March when.\" AXEL: (Dialogue) \"Mid.\" AXEL: (Caption) A long pause from under the car. The sound of a flashlight being repositioned. ELIO: (Dialogue) \"You went off a bridge.\" AXEL: (Dialogue) \"A drawbridge. It was at thirty degrees.\" ELIO: (Dialogue) \"Un pu\u00f1etero puente.\" AXEL: (Caption) He already knew."
    },
    {
      "type": "image",
      "url": "/assets/EP21/ep21_panel_05.png",
      "caption": "AXEL: (Caption) We work. That's the thing about Elio's garage \u2014 it's a place where silence has purpose. He doesn't explain what he's doing until he needs a second pair of hands. I hand him things. He uses them. We don't talk about the bridge. AXEL: (Caption) By ten o'clock we have the LeMans on the alignment rack, the front end stripped down, both lower control arm bushings pulled and laid on the workbench like small, defeated organs. ELIO: (Dialogue) \"The right one is finished. The left one\u2014\" He holds it up to the shop light. \"\u2014is also finished, but it doesn't know it yet.\" AXEL: (Dialogue) \"Can you press new ones?\" ELIO: (Dialogue) \"What do you think I'm going to do, pray over it?\""
    },
    {
      "type": "image",
      "url": "/assets/EP21/ep21_panel_06.png",
      "caption": "AXEL: (Caption) At 10:14, Ricky's radio \u2014 a small, battered Sony on the corner of the workbench \u2014 interrupts a commercial to report that the McDuffie manslaughter trial has been officially relocated to Tampa by order of the Circuit Court. Change of venue. The judge cited concerns about the availability of an impartial jury pool in Dade County. AXEL: (Caption) Elio stops. He has a press handle in his right hand and a bushing in his left and he stops with the same absolute stillness that a man stops when he has heard something he was waiting to not hear. AXEL: (Caption) Ricky looks up from his homework. Neither of them speak. The radio moves on to a traffic report. The Palmetto Expressway is backed up past NW 57th. Business as usual."
    },
    {
      "type": "image",
      "url": "/assets/EP21/ep21_panel_07.png",
      "caption": "AXEL: (Caption) Elio sets the bushing on the workbench. He wipes his hands on a shop rag \u2014 slowly, thoroughly, one finger at a time. He does not look at Ricky. He does not look at me. ELIO: (Dialogue) \"They moved it so nobody's watching.\" AXEL: (Caption) He isn't asking for a response. He isn't offering a conversation. He is stating a fact with the quiet fury of a man who has been storing quiet fury for a very long time and has gotten very efficient at it."
    },
    {
      "type": "image",
      "url": "/assets/EP21/ep21_panel_08.png",
      "caption": "AXEL: (Dialogue) \"Are you okay?\" ELIO: (Caption \u2014 beat. Elio picks the bushing back up.) ELIO: (Dialogue) \"I'm always okay. That's the problem.\" AXEL: (Caption) We work until two in the afternoon without stopping."
    },
    {
      "type": "image",
      "url": "/assets/EP21/ep21_panel_09.png",
      "caption": "AXEL: (Caption) When I pull the LeMans off the rack, the steering wheel is straight for the first time since the bridge. Not pulling. Not suggesting. Just \u2014 straight. The wheel sits level at noon and the car tracks true and the road comes at me clean. AXEL: (Caption) I drive it around the block to feel it. The G-body sits flat through the turn at Calle Ocho. The rebuilt transmission grabs third exactly when I ask for it. The front end holds the line. AXEL: (Caption) I pull back into the garage to settle up. Elio is already back under the Cutlass."
    },
    {
      "type": "image",
      "url": "/assets/EP21/ep21_panel_10.png",
      "caption": "AXEL: (Caption) He doesn't come out from under the car, but he shoves something across the floor toward me with one boot \u2014 slid along the concrete like he's pretending it isn't there. A small, heavy thing wrapped in shop rag. AXEL: (Caption) I pick it up. Unwrap it. The vault \u2014 the lead-lined steel box welded to my transmission tunnel. Elio pulled it while I wasn't paying attention. AXEL: (Caption) The hairline fracture from the bridge jump is gone. He welded it. The seam is clean, tight \u2014 better than the original work. He didn't mention it. He didn't charge me for it. He just fixed it and slid it across the floor. AXEL: (Dialogue) \"Elio\u2014\" ELIO: (From under the car) \"Go drive.\" AXEL: (Caption) I go drive. --- **[END OF EPISODE 21]**"
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep22: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 22 (\"STATIC MAPS\")... // VOLUME 03: THE IDLE ENGINE"
    },
    {
      "type": "image",
      "url": "/assets/EP22/ep22_panel_01.png",
      "caption": "AXEL: (Caption) I don't sleep the way normal people sleep. I sleep in three-hour rotations between deliveries, whenever the dispatch queue goes dark, usually between midnight and four. The tin roof drums when it rains. The box fans run all night. Blinker is outside and accounted for. This is what passes for peace. AXEL: (Caption) Tonight I can't get to the first three hours. I lie on my back on the mattress and watch the pink and blue neon from the street drag itself across the ceiling through the ventilation gap I cut in the container wall in February, and I think about aligned front ends and index cards and the way the Straits sounded at one in the morning."
    },
    {
      "type": "image",
      "url": "/assets/EP22/ep22_panel_02.png",
      "caption": "AXEL: (Caption) I get up. I pull on the denim jacket. I walk down the external staircase, across the cracked parking lot, and into the alley behind the building. AXEL: (Caption) Maria's van is humming. It's always humming. The antenna array on the roof catches the ambient light from the street \u2014 a chaotic, bristling silhouette of copper wire and bent hangers that looks like something grew up there rather than something someone built. AXEL: (Caption) I don't knock. I sit down against the rear bumper. The metal is warm from the alternator. I lean back and listen to the van breathe static."
    },
    {
      "type": "image",
      "url": "/assets/EP22/ep22_panel_03.png",
      "caption": "AXEL: (Caption) From inside: the dense, layered hiss of six different frequencies running simultaneously. Police scanner, two ham bands, the Coast Guard channel, something else I can't identify \u2014 a low-pitched modulation that sounds like a signal trying to sound like nothing. MARIA: (Through the mail slot, without preamble) \"You couldn't sleep either.\" AXEL: (Dialogue) \"No.\" MARIA: (Dialogue) \"The frequencies are wrong tonight. Everything is running two degrees off center. Like the whole electromagnetic spectrum has a headache.\""
    },
    {
      "type": "image",
      "url": "/assets/EP22/ep22_panel_04.png",
      "caption": "AXEL: (Caption) A pause. The scanner cycles \u2014 Hialeah dispatch, a fender-bender on the Palmetto, a domestic call in Allapattah, routine, routine, routine. Then the Coast Guard band surfaces between cycles: two voices reading coordinates to each other in the flat, emotionless cadence of people who have been doing this for seven hours and will be doing it for seven more. AXEL: (Dialogue) \"How long has the Coast Guard traffic been heavy?\" MARIA: (Dialogue) \"Eighteen days. Since the embassy.\" AXEL: (Dialogue) \"Are they stopping boats?\" MARIA: (Dialogue) \"They're watching boats. There's a difference. I've been logging it.\""
    },
    {
      "type": "image",
      "url": "/assets/EP22/ep22_panel_05.png",
      "caption": "AXEL: (Caption) She shoves something through the mail slot. A composition notebook, fat and warped with humidity, the cover soft from handling. I open it under the alley streetlight. AXEL: (Caption) Handwritten entries, dated and timed, in the specific dense shorthand of someone who has been keeping records for a long time. Two weeks of marine frequency logs. Coordinates, vessel call signs, signal codes she's been cross-referencing against a 1977 FCC manual she apparently keeps in the van. AXEL: (Caption) Three of the code sequences are circled in red ink. Beside each one, Maria has written: *no match. non-standard. repeat pattern.*"
    },
    {
      "type": "image",
      "url": "/assets/EP22/ep22_panel_06.png",
      "caption": "AXEL: (Dialogue) \"What does non-standard mean?\" MARIA: (Dialogue) \"It means someone taught themselves the codes. Not Coast Guard, not Navy. Civilian. Someone who learned enough to sound like they belong on the frequency without actually belonging.\" AXEL: (Dialogue) \"Cartel runners?\" MARIA: (Dialogue) \"Wrong boat speed. Cartel moves fast. These are slow. Heavy. Like they're loaded.\" AXEL: (Caption) Loaded with what goes unsaid."
    },
    {
      "type": "image",
      "url": "/assets/EP22/ep22_panel_07.png",
      "caption": "AXEL: (Caption) We sit in the alley for a while. The city makes the sounds it makes at midnight \u2014 distant highway hum, a siren four blocks east that crests and fades, the periodic creak of the van's frame settling. AXEL: (Caption) Maria asks me something she has never asked me before. She asks it the way blind people sometimes ask things \u2014 looking straight ahead at nothing, as if the question is less intrusive when it isn't aimed at your face. MARIA: (Dialogue) \"What did your mother sound like?\" AXEL: (Caption) I wasn't expecting that."
    },
    {
      "type": "image",
      "url": "/assets/EP22/ep22_panel_08.png",
      "caption": "AXEL: (Caption) I think about it seriously, the way the question deserves. AXEL: (Dialogue) \"Tired. But warm. Like she'd been awake too long but was staying up for you anyway. Like the tiredness was something she was choosing to carry so you wouldn't have to.\" AXEL: (Caption) Maria nods. Once. She doesn't say *I'm sorry* or *that's beautiful* or anything that would require me to respond. AXEL: (Caption) That's why I like talking to Maria."
    },
    {
      "type": "image",
      "url": "/assets/EP22/ep22_panel_09.png",
      "caption": "AXEL: (Caption) At 2:47 AM, something on one of the ham bands interrupts. AXEL: (Caption) A transmission. Spanish. Male voice. Young, probably. The signal is low-power, close-range, bleeding into the frequency from somewhere in the Straits or close to shore. Maria's hand appears through the mail slot and grips my sleeve. AXEL: (Caption) She translates in real time, voice low, nearly under her breath: MARIA: (Dialogue, quiet) \"Tell them the water is calm tonight. Tell them to come now.\" AXEL: (Caption) The signal cuts. Static resumes."
    },
    {
      "type": "image",
      "url": "/assets/EP22/ep22_panel_10.png",
      "caption": "AXEL: (Caption) Neither of us speak for a full minute. AXEL: (Caption) Somewhere in the Florida Straits, right now, someone is on a boat they built or borrowed or bought with money they don't have, running dark \u2014 no lights, no official transponder \u2014 pointed north at ninety miles of open water. They called ahead. Someone told them it was calm. They came. AXEL: (Caption) Not official. Not sanctioned. Not part of any program or treaty or government process. Just a person and a boat and the specific human determination that the water between here and there is crossable."
    },
    {
      "type": "image",
      "url": "/assets/EP22/ep22_panel_11.png",
      "caption": "AXEL: (Caption) I hand the composition notebook back through the mail slot. AXEL: (Dialogue) \"Can you keep logging?\" MARIA: (Dialogue) \"I haven't stopped since February. I won't stop now.\" AXEL: (Caption) I stand up from the bumper. The alley is quiet. The van hums. AXEL: (Dialogue) \"If the frequency pattern shifts \u2014 if it starts accelerating\u2014\" MARIA: (Dialogue) \"I'll slide a map under your door.\" AXEL: (Caption) I walk back across the parking lot. Blinker is on the bottom stair, blocking my path, waiting for the mango he has decided I owe him. AXEL: (Caption) I give him the mango. I go back to the tin can. I don't sleep until almost five. --- **[END OF EPISODE 22]**"
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep23: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 23 (\"CONDO CANYON (REDUX)\")... // VOLUME 03: THE IDLE ENGINE"
    },
    {
      "type": "image",
      "url": "/assets/EP23/ep23_panel_01.png",
      "caption": "AXEL: (Caption) Day ninety-eight. I drive north with no delivery and no reason except that I had the morning off and I kept thinking about Sol's pool deck and the way the afternoon light hits the water there and the fact that he made me eat a full plate of food last time without making anything of it. AXEL: (Caption) This is as close as I get to visiting someone."
    },
    {
      "type": "image",
      "url": "/assets/EP23/ep23_panel_02.png",
      "caption": "AXEL: (Caption) The I-95 north out of Miami is a different highway depending on the hour. At 11 AM on a weekday it's almost meditative \u2014 long, straight, the city spreading west in grids of tan concrete and strip-mall signage. Hialeah, Opa-locka, North Miami Beach, each one blurring into the next with only the exit signs to distinguish them. AXEL: (Caption) The rebuilt LeMans sits steady at 70. The steering wheel at noon. The engine pulling clean. Elio's alignment holding. I almost trust it."
    },
    {
      "type": "image",
      "url": "/assets/EP23/ep23_panel_03.png",
      "caption": "AXEL: (Caption) Hollywood, Florida. The Condo Canyon. Twenty miles north of Miami, it might as well be another continent \u2014 a city of wide, flat boulevards lined with fifteen-story concrete towers, each one identical, each one full of people who left Brooklyn or Flatbush or Queens and came here to die somewhere warm. AXEL: (Caption) I love it. I don't know why I love it. I think it's because nothing here is trying to be anything other than exactly what it is."
    },
    {
      "type": "image",
      "url": "/assets/EP23/ep23_panel_04.png",
      "caption": "AXEL: (Caption) Sol's building is the Fountainview \u2014 a 1971 tower, concrete balconies stained with twenty years of salt air, a lobby with terrazzo floors and a security desk staffed by a man named Gerald who has been at that desk since 1974 and will be at that desk until he isn't. GERALD: (Dialogue) \"The LeMans.\" AXEL: (Dialogue) \"Gerald.\" AXEL: (Caption) He waves me through without looking up from his crossword. This is the full extent of our relationship and it works perfectly for both of us."
    },
    {
      "type": "image",
      "url": "/assets/EP23/ep23_panel_05.png",
      "caption": "AXEL: (Caption) Sol is on the pool deck. Two lawn chairs, a small table, a pitcher of lemonade. He's reading the afternoon paper. Or he was \u2014 when I come through the gate he folds it in half and sets it on the table with the deliberateness of a man putting something away so it's still accessible. SOL: (Dialogue) \"I wondered when you'd come up again.\" AXEL: (Dialogue) \"I was in the neighborhood.\" SOL: (Dialogue) \"Hollywood is not a neighborhood you're in by accident.\" AXEL: (Caption) He pours me a glass. There is also a plate of something already on the table, covered with a dish towel, waiting. He made food before I got here. He knew I'd come."
    },
    {
      "type": "image",
      "url": "/assets/EP23/ep23_panel_06.png",
      "caption": "AXEL: (Caption) I eat. Sol watches the pool. There are four other people on the deck \u2014 two women reading paperbacks, a man asleep in a chair with a hat over his face. The pool is very blue. The afternoon is very quiet. SOL: (Dialogue) \"You saw the paper.\" AXEL: (Dialogue) \"I heard it on the radio.\" SOL: (Dialogue) \"Mariel Port. Officially open as of today.\" He picks up the paper. Sets it down again. \"They're going to come. Not some \u2014 all of them. Everyone who can find a boat.\" AXEL: (Dialogue) \"How many?\" SOL: (Dialogue, quiet) \"I don't know. I don't think anyone knows. That's what makes it what it is.\""
    },
    {
      "type": "image",
      "url": "/assets/EP23/ep23_panel_07.png",
      "caption": "AXEL: (Caption) Sol has a legal pad on the table beside the pitcher. Columns, addresses, dates \u2014 Dade County property records, annotated in the margins in Sol's cramped blue pen. SOL: (Dialogue) \"Someone's been buying. Very quiet, very fast \u2014 LLCs registered in Delaware, no street address, no disclosed principals. Seven parcels in the last three weeks. Five of them in the Drowned District.\" AXEL: (Dialogue) \"Vanguard.\" SOL: (Dialogue) \"Same fingerprints. Different names. They did this before the last reformat \u2014 buy low on paper, wait for the land value to shift, then foreclose on whatever's built on it once the Grid says the coordinates are corporate property.\""
    },
    {
      "type": "image",
      "url": "/assets/EP23/ep23_panel_08.png",
      "caption": "AXEL: (Caption) I look at the legal pad. Seven parcels. I know two of the addresses \u2014 Stiltsville coordinates, the outer rim of the Drowned District where the stilts go deepest. AXEL: (Dialogue) \"They're positioning before the surge. They know the Mariel refugees will need housing. They're going to offer the Drowned District and then foreclose on it.\" SOL: (Dialogue) \"That's what I think, yes.\" SOL: (Caption) A pause. He looks at the pool. At the very blue water. \"They're going to use the boats to do what the riots didn't.\""
    },
    {
      "type": "image",
      "url": "/assets/EP23/ep23_panel_09.png",
      "caption": "AXEL: (Caption) We sit with that for a while. The pool reflects the sky. One of the women reading paperbacks laughs at something \u2014 a short, bright sound, completely out of place, completely human. SOL: (Dialogue) \"You know what I think about? 1962. Half the people in this building left Havana with a single suitcase and the clothes they were wearing. They got on a plane and they came here. Some of them had money. Most of them didn't. They came anyway.\" AXEL: (Dialogue) \"And now they're watching it happen again.\" SOL: (Dialogue) \"They're not watching. They're making room. That's the difference. That's always the difference, if you're paying attention.\""
    },
    {
      "type": "image",
      "url": "/assets/EP23/ep23_panel_10.png",
      "caption": "AXEL: (Caption) Sol takes a photograph from the pocket of his guayabera. Faded amber, early 1960s. Two people at a poolside bar \u2014 the Fontainebleau. The woman is laughing at something off-frame. Sol \u2014 younger, all his hair, the same watchful eyes \u2014 is not looking at the camera. He's looking at her. SOL: (Dialogue) \"Miriam. 1962. Two months after we got here. We didn't have anything yet. We had enough for a Sunday drink at the Fontainebleau because it was a Sunday and we were alive and Miami was warm and that seemed like sufficient reason.\""
    },
    {
      "type": "image",
      "url": "/assets/EP23/ep23_panel_11.png",
      "caption": "AXEL: (Caption) I look at the photograph for a long time. Then I look at my own jacket pocket \u2014 left side, where the recipe card is. AXEL: (Caption) I don't say anything about the tape or the lighthouse or the bedtime story. Sol doesn't ask. He takes the photograph back and returns it to his pocket with the care of someone returning a tool to its specific place. SOL: (Dialogue) \"Stay for dinner.\" AXEL: (Caption) I stay for dinner. I eat a full plate and then a second. Sol doesn't comment on the second plate. He just refills it."
    },
    {
      "type": "image",
      "url": "/assets/EP23/ep23_panel_12.png",
      "caption": "AXEL: (Caption) I-95 south at sunset. The sky doing what the Miami sky does when it has something to say \u2014 bands of pink and orange and the deep bruised purple above the turnpike, impossible, like someone oversaturated the whole horizon. AXEL: (Caption) I turn the radio on. For the first time in fifty-eight days. AXEL: (Caption) Y-100. Someone playing Don Henley. I don't change it. AXEL: (Caption) Sol's legal pad is on the passenger seat. Seven parcels. Drowned District. Vanguard fingerprints. AXEL: (Caption) The city comes back up over the horizon \u2014 the downtown towers catching the last of the light, the Grid glowing, the whole beautiful, terrible machine still running. AXEL: (Caption) I'm going to need to talk to Reya. --- **[END OF EPISODE 23]**"
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep24: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 24 (\"VERSAILLES (NIGHT SHIFT)\")... // VOLUME 03: THE IDLE ENGINE"
    },
    {
      "type": "image",
      "url": "/assets/EP24/ep24_panel_01.png",
      "caption": "AXEL: (Caption) Day one hundred and three. The last delivery of the night drops me six blocks from Versailles at eleven PM, and there is a warm colada at the end of those six blocks with my name on it. This is one of the few reliable facts of my existence and I intend to honor it. AXEL: (Caption) I turn onto SW 8th Street. Something is different."
    },
    {
      "type": "image",
      "url": "/assets/EP24/ep24_panel_02.png",
      "caption": "AXEL: (Caption) The ventanita at Versailles is a window. That's all it is \u2014 a window cut into the exterior wall of the restaurant, a counter, a coffee machine on the other side. In my experience of it, at this hour, there are maybe four or five people. Regulars. Retirees who won't sleep anyway. AXEL: (Caption) Tonight there are thirty people. Standing in loose clusters, not in a line \u2014 the way people cluster when the gathering has a purpose the coffee is only incidental to. The age range is wrong. Too young. Men in their twenties and thirties, some of them in clothes that aren't Miami clothes \u2014 shoes wrong for the heat, jackets too heavy for April. AXEL: (Caption) They're watching the street with their backs to the wall. All of them."
    },
    {
      "type": "image",
      "url": "/assets/EP24/ep24_panel_03.png",
      "caption": "AXEL: (Caption) I park the LeMans a block east and walk. At the counter, Do\u00f1a Carmen is working with the focused economy of motion of someone who has long since eliminated every unnecessary movement from her process. She sees me coming through the crowd the way she always sees people coming \u2014 through peripheral vision, without turning her head. AXEL: (Caption) She has my colada on the counter before I reach the window. Next to it: a folded piece of paper. CARMEN: (Dialogue, quiet) \"You're late.\" AXEL: (Dialogue) \"I had a drop in Kendall.\" CARMEN: (Dialogue) \"Drink first. Read after.\""
    },
    {
      "type": "image",
      "url": "/assets/EP24/ep24_panel_04.png",
      "caption": "AXEL: (Caption) The colada is perfect. It is always perfect. AXEL: (Caption) I lean against the exterior wall and watch the crowd while I drink. A van pulls up \u2014 blue, older, no markings. Three people get out, go inside through the main restaurant entrance, come back out twelve minutes later carrying bags. Grocery bags, the kind you get at the Winn-Dixie. They get back in the van. The van pulls away. AXEL: (Caption) Another van pulls up eight minutes later. Same thing."
    },
    {
      "type": "image",
      "url": "/assets/EP24/ep24_panel_05.png",
      "caption": "AXEL: (Caption) I open the paper. A list. Handwritten in Carmen's precise, small script: seven addresses. Homestead. Kendall. Hialeah. One in Opa-locka. Each one has a notation beside it \u2014 a number, a letter code I'd need a key to decode. AXEL: (Caption) This isn't a delivery manifest. The codes are too irregular. This is a roster of some kind. People or places that need to be accounted for."
    },
    {
      "type": "image",
      "url": "/assets/EP24/ep24_panel_06.png",
      "caption": "AXEL: (Caption) Carmen comes out on her break at 11:45. She leans on the LeMans hood and lights a cigarette. She smokes it looking at Calle Ocho. The street is unusually busy for midnight. CARMEN: (Dialogue) \"The boats come Tuesday. Maybe Wednesday. Depends on the weather in the Straits.\" AXEL: (Dialogue) \"How do you know when?\" CARMEN: (Dialogue) \"Because I know people who know people who are on the boats.\" AXEL: (Caption) She taps the paper in my hand without looking at it."
    },
    {
      "type": "image",
      "url": "/assets/EP24/ep24_panel_07.png",
      "caption": "CARMEN: (Dialogue) \"Those addresses. If something happens in the next two weeks \u2014 if the Vanguard checkpoints go up on the causeways, if the Coast Guard starts turning boats back, if Liberty City burns again \u2014 those places need to be checked. Not by police. Not by anyone official.\" AXEL: (Dialogue) \"By someone with a big car.\" CARMEN: (Dialogue) \"By someone with a big car and no questions and the specific kind of stubbornness that makes a man drive off a thirty-degree drawbridge.\" AXEL: (Caption) She already knew about the bridge. Of course she did."
    },
    {
      "type": "image",
      "url": "/assets/EP24/ep24_panel_08.png",
      "caption": "AXEL: (Caption) Another van cycle. The crowd at the ventanita thins slightly, replaced by a new group \u2014 older, two women speaking rapid Creole to each other and to Carmen when they reach the window. AXEL: (Caption) The ventanita isn't a coffee window tonight. It's a throughput. A waystation. People come in carrying one thing and leave carrying something else \u2014 documents, addresses, a bag of supplies, knowledge \u2014 and Do\u00f1a Carmen is the hub of it, pulling shots and making change and passing folded papers and never once breaking her rhythm."
    },
    {
      "type": "image",
      "url": "/assets/EP24/ep24_panel_09.png",
      "caption": "AXEL: (Caption) Carmen finishes her cigarette. She doesn't ask if I'll do it. She already knows \u2014 that was decided the moment I walked to the window instead of driving past it. AXEL: (Caption) She straightens up from the car. CARMEN: (Dialogue) \"One more thing.\" AXEL: (Caption) She reaches into her apron and produces a single cassette tape. No case. Label handwritten in marker: *MIXES \u2014 ABRIL 1980.* CARMEN: (Dialogue) \"For the drive. It's a long list.\""
    },
    {
      "type": "image",
      "url": "/assets/EP24/ep24_panel_10.png",
      "caption": "AXEL: (Caption) I take the tape. She goes back inside. I stand by the car on Calle Ocho at midnight, holding a handwritten list of addresses in one hand and a cassette tape in the other, and I look down the length of the street \u2014 the neon of the bodegas and the late-night restaurants, the old men still at their dominoes through the restaurant window, the particular amber glow of a neighborhood that has been surviving longer than anyone gave it credit for and intends to keep. AXEL: (Caption) I put the list in my jacket. Left pocket, where the recipe card already is. Both of them, folded together. AXEL: (Caption) I get in the LeMans. I put the tape in the deck. It plays immediately \u2014 something with brass, fast, a piano underneath it, the particular sound of music made by people who know exactly what it costs and make it anyway. AXEL: (Caption) I don't go home. I drive the list instead \u2014 all seven addresses, slowly, just to know where they are. Homestead first, then back north through Kendall, Hialeah, Opa-locka last. Two hours. Every address dark, quiet, normal. Nothing happening. Just houses and apartments and storefronts sleeping through a Saturday night. AXEL: (Caption) I make note of each one. I come back up I-95 in the small hours, the city reduced to moving lights and the sound of the rebuilt engine running clean. AXEL: (Caption) Tuesday. Maybe Wednesday. AXEL: (Caption) Something is coming. This time, I'm going to be where it lands. --- **[END OF EPISODE 24. VOLUME 03: THE IDLE ENGINE COMPLETE.]** --- **[VOLUME 04: THE SURGE BEGINS \u2014 APRIL 21, 1980]**"
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep25: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 25 (\"THE INVISIBLE GRID\")... // VOLUME 04: THE SURGE"
    },
    {
      "type": "image",
      "url": "/assets/EP25/ep25_panel_01.png",
      "caption": "Torrential Miami afternoon downpour. The sky is a bruised, oppressive gray. Axel\u2019s highly modified \u201978 LeMans is parked half-under a rusted corrugated tin overhang in Sector H. Rain is exploding off the hood, washing away thick coats of dried sea-salt."
    },
    {
      "type": "image",
      "url": "/assets/EP25/ep25_panel_02.png",
      "caption": "Under the overhang. Axel is wiping grease off his hands with a dirty shop rag. Jean-Pierre is sitting on an overturned milk crate, using a rusted utility knife to strip black insulation off a thick coil of copper wire. \"You\u2019re lucky the salt didn\u2019t eat through the coaxial completely. The Vanguard's thermal ping would have lit you up on the Causeway.\" \"I kept it in the mud. They don\u2019t scan the shallows.\""
    },
    {
      "type": "image",
      "url": "/assets/EP25/ep25_panel_03.png",
      "caption": "Rainwater pouring off the jagged edge of the tin roof, creating a literal curtain of water just inches from Jean-Pierre\u2019s face. He doesn\u2019t look up from stripping the wire. \"Maybe. But my receivers were screaming all night anyway. Channel 16. Coast Guard frequencies.\" \"Vanguard running a sweep?\""
    },
    {
      "type": "image",
      "url": "/assets/EP25/ep25_panel_04.png",
      "caption": "Jean-Pierre stops cutting. He drops the wire and looks up at Axel, his expression deadly serious despite the casual setting. \"No. Unfiltered marine engines. Hundreds of them. Coming straight north up the Straits.\""
    },
    {
      "type": "image",
      "url": "/assets/EP25/ep25_panel_05.png",
      "caption": "Axel looking out through the curtain of rain. He remembers the dawn at the Lighthouse. \"...I know. I heard them.\" ---"
    },
    {
      "type": "image",
      "url": "/assets/EP25/ep25_panel_06.png",
      "caption": "The matte-black LeMans fishtailing violently out of the mud of Sector H, tearing onto a rain-slicked avenue. A massive plume of dirty water is kicked up from the rear tires. **CAPTION (AXEL):** \"The Vanguard wasn't just doing radio sweeps. They were drawing a net.\""
    },
    {
      "type": "image",
      "url": "/assets/EP25/ep25_panel_07.png",
      "caption": "Calle Ocho in the storm. The neon lights of Versailles Restaurant reflect beautifully in massive, turbulent puddles on the asphalt. A heavy Miami police presence is vaguely visible in the blurred background\u2014cruisers with their lightbars flashing, signaling the rising structural tension in the city."
    },
    {
      "type": "image",
      "url": "/assets/EP25/ep25_panel_08.png",
      "caption": "Inside the cramped Ventanita. Steam from the espresso machines fills the tight frame. Axel physically slams his grease-stained hands down onto the stainless steel counter, rainwater dripping heavily from his face. \"Carmen. You need to lock this down. The Straits are flooded with\u2014\""
    },
    {
      "type": "image",
      "url": "/assets/EP25/ep25_panel_09.png",
      "caption": "Do\u00f1a Carmen stands firmly behind the counter. She is completely calm, her eyes sharp. With a fluid, practiced motion, she is racking a shell into a heavy pump-action shotgun resting right next to the industrial coffee grinder. **DO\u00d1A CARMEN:** \"I know. The local band hasn't stopped.\""
    },
    {
      "type": "image",
      "url": "/assets/EP25/ep25_panel_10.png",
      "caption": "Do\u00f1a Carmen pushing a heavy, military-surplus canvas duffel bag across the stainless steel counter toward Axel. A stack of analog radios and a thick envelope of cash spills slightly from the zipper. **DO\u00d1A CARMEN:** \"Vance is locking down the coast early. The municipal police are paralyzed. I need you to run these bypass-transmitters to the docks right now, or thousands of people are going to walk straight into The Vanguard's collection nets.\" ---"
    },
    {
      "type": "image",
      "url": "/assets/EP25/ep25_panel_11.png",
      "caption": "The pitch-black docks at the edge of Sector H. No streetlights. The water is churning violently. Axel's LeMans is parked near the edge of a splintering wooden pier, its headlights turned off. Only the dim amber glow of the dashboard illuminates Axel inside."
    },
    {
      "type": "image",
      "url": "/assets/EP25/ep25_panel_12.png",
      "caption": "A dilapidated, 40-foot cigarette boat slowly cuts through the fog and docks at the pier. It is absurdly overcrowded with terrified, exhausted refugees huddled under plastic tarps. The boat looks like it barely survived the Straits."
    },
    {
      "type": "image",
      "url": "/assets/EP25/ep25_panel_13.png",
      "caption": "Axel standing on the wooden pier in the heavy rain, physically handing analog bypass-transmitters (from Do\u00f1a Carmen's duffel bag) down to the people on the boat. A refugee looks up at him with profound relief. \"The Mesh-Network isn't built on copper wire. It's built on blood. And right now, the city is bleeding fast.\""
    },
    {
      "type": "image",
      "url": "/assets/EP25/ep25_panel_14.png",
      "caption": "In the deep background, half a mile down the coast, a row of blinding white headlights abruptly clicks on. Heavily armored Vanguard Repo-Trucks establish a perimeter. In the center of the lights, a silhouette steps out of the lead truck onto the beach. It's Director Vance, personally overseeing the nets. \"Vance is on the beach. He's here to collect.\""
    },
    {
      "type": "image",
      "url": "/assets/EP25/ep25_panel_15.png",
      "caption": "Axel sliding back into the driver's seat of the LeMans. He is shifting into first gear, his eyes sharp and focused in the rearview mirror as the cigarette boat vanishes safely into the swamp fog behind him. He didn't get his money tonight, but he beat the house. \"Let the Vanguard scan the shore. Tonight, they only catch the ghosts.\""
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep26: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 26 (\"TENT CITY\")... // VOLUME 04: THE SURGE"
    },
    {
      "type": "image",
      "url": "/assets/EP26/ep26_panel_01.png",
      "caption": "The massive concrete bowl of the Miami Orange Bowl. The field is completely obscured by a sea of olive-drab canvas tents and chain-link fencing. Floodlights cut through the humid night air. Surrounding the stadium, just outside the municipal perimeter: a ring of black, heavily armored Vanguard Trust Repo-Trucks, their engines idling. May 5th. Three weeks since the Straits broke open. Forty thousand people have hit the beach, and the city ran out of rooms on day two."
    },
    {
      "type": "image",
      "url": "/assets/EP26/ep26_panel_02.png",
      "caption": "Inside the LeMans. Axel's dashboard. His analog Nixie Timer is red-lining, flickering rapidly. The mechanical hum of the V8 is the only thing keeping the gauge from hitting zero. For months, keeping this engine quiet was the only thing keeping me alive. Now I'm the one feeding it raw static. The courier is dead; I'm tearing up the map. The Orange Bowl. Tents on the AstroTurf. And Vance\u2019s extraction fleet idling at the gates, waiting for the stragglers to wander out of the municipal safe zone."
    },
    {
      "type": "image",
      "url": "/assets/EP26/ep26_panel_03.png",
      "caption": "Axel is sitting in the driver's seat. Jean-Pierre is in the passenger seat, a soldering iron in his hand, putting the finishing touches on a massive, blocky analog transmitter strapped into the backseat where a passenger would normally go. \"The output array is primed. But it has to be deployed inside the stadium concourse. The concrete will amplify the analog bounce. It will cast a physical shadow over the north encampment. Four thousand people erased from Vance's thermal nets.\""
    },
    {
      "type": "image",
      "url": "/assets/EP26/ep26_panel_04.png",
      "caption": "The LeMans tears away from a shadowed alleyway opposite the stadium. Axel punches the gas. The car is a rusted, analog battering ram covered in copper mesh. The LeMans handles differently with two hundred pounds of analog Faraday coils bolted to the transmission hum. She doesn't glide anymore. She hits."
    },
    {
      "type": "image",
      "url": "/assets/EP26/ep26_panel_05.png",
      "caption": "A Vanguard Repo-Truck driver, visor down, notices the LeMans approaching the perimeter gate at seventy miles an hour. He reaches for a heavy dashboard switch marked \"GRAVITY ANCHOR.\" Vance\u2019s sweepers see the thermal anomaly coming. A massive, moving dead spot on their radar."
    },
    {
      "type": "image",
      "url": "/assets/EP26/ep26_panel_06.png",
      "caption": "The LeMans physically fishtails as the air around the car warps\u2014the visual distortion of a Grievance Point gravity spike hitting the asphalt just inches from the rear bumper. The concrete cracks under the invisible weight. \"Axel! The gravity spikes! Keep the RPMs above four thousand or the vacuum will stall the engine!\""
    },
    {
      "type": "image",
      "url": "/assets/EP26/ep26_panel_07.png",
      "caption": "The LeMans smashes through a rusted chain-link maintenance gate at the base of the stadium. It slides sideways into the subterranean concrete concourse of the Orange Bowl. Sparks fly as the rear bumper scrapes the concrete wall. Third gear. The Grand Prix transmission rebuild holds tight. We breach the lower concourse. The smell of stale beer, sweat, and fear is suffocating."
    },
    {
      "type": "image",
      "url": "/assets/EP26/ep26_panel_08.png",
      "caption": "Jean-Pierre violently throws a heavy lever on the side of the bypass-transmitter in the backseat. The transmitter hums, glowing with a deep analog green light. \"Transmitter active! The signal is looping!\""
    },
    {
      "type": "image",
      "url": "/assets/EP26/ep26_panel_09.png",
      "caption": "Outside the stadium, the line of Vanguard Repo-Trucks suddenly stop their aggressive advance. Their high-beam headlights sweep the perimeter, but their dashboard thermal screens (shown inset) all simultaneously flatline to static. The heavy copper frequency bounces off the stadium concrete. In an instant, four thousand human souls vanish from Vanguard's ledger."
    },
    {
      "type": "image",
      "url": "/assets/EP26/ep26_panel_10.png",
      "caption": "Director Vance, standing outside the lead Repo-Truck holding an umbrella in the humid drizzle. He stares at the stadium. He doesn't look angry; he looks fascinated. A rare expression of genuine respect. \"They built a ghost machine... Bring up the bulldozers. If we can't see them, we'll just level the building.\""
    },
    {
      "type": "image",
      "url": "/assets/EP26/ep26_panel_11.png",
      "caption": "Axel leans back in the LeMans. The Nixie Timer on the dashboard calms down, settling into a steady, safe green. The vacuum has receded. We bought the North Encampment exactly one night of peace. By tomorrow, Vance will escalate. But tonight, the extraction stops. I look at Jean-Pierre. He's already reviewing his schematics. We're going to need a bigger transmitter."
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep27: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 27 (\"THE BROADCAST TOWER\")... // VOLUME 04: THE SURGE"
    },
    {
      "type": "image",
      "url": "/assets/EP27/ep27_panel_01.png",
      "caption": "The LeMans tears out of the subterranean concourse of the Miami Orange Bowl, fish-tailing onto the wet asphalt. In the background, massive Vanguard Trust armored bulldozers are systematically crushing the chain-link perimeter fences. The olive-drab tents of the refugee encampment are visibly shaking. May 7th. The ghost machine bought them thirty-six hours. Now Vance is done playing cat-and-mouse. The extraction fleet has been replaced by heavy demolition armor."
    },
    {
      "type": "image",
      "url": "/assets/EP27/ep27_panel_02.png",
      "caption": "Inside the LeMans. The massive, blocky analog transmitter strapped into the passenger side backseat is smoking, the green analog glow violently flickering. Jean-Pierre is frantically trying to splice wires back together, burning his fingers on the superheated copper. \"The coils are melting! The concrete bounce was too dense! The signal is degrading!\" Vanguard\u2019s thermal nets are bleeding back through. The vacuum is creeping into the cabin."
    },
    {
      "type": "image",
      "url": "/assets/EP27/ep27_panel_03.png",
      "caption": "Axel gripping the steering wheel, looking through the rain-streaked windshield. In the distance, towering over the low-slung, neon-drenched roofs of Sector H, is a massive, rusty commercial radio mast\u2014Radio Maria's pirate broadcast tower. It pulses with a faint, jagged red aviation light. \"Kill the array, JP! Save the transistors! We don't need a concrete echo chamber anymore. We're going straight to the top of the mast.\""
    },
    {
      "type": "image",
      "url": "/assets/EP27/ep27_panel_04.png",
      "caption": "The LeMans slams through the reinforced gates of Radio Maria's compound in Little Haiti. It's an old industrial lot surrounded by razor wire, dominated by the towering steel radio mast. Several armed sentries in the compound lower their weapons as they recognize the battered Pontiac. Sector H. Maria\u2019s compound. It\u2019s the loudest pirate signal on the eastern seaboard, blasting analog mesh comms straight over Vanguard's digital encryption bands."
    },
    {
      "type": "image",
      "url": "/assets/EP27/ep27_panel_05.png",
      "caption": "Axel and Jean-Pierre jump out of the LeMans. They are carrying the smoking, heavy analog transmitter between them like a stretcher. Radio Maria, a fierce woman covered in intricate analog circuit tattoos, steps out of the broadcast shack, holding a heavy wrench. \"Do\u00f1a Carmen said you were building a ghost machine. You bring that radioactive brick near my mast, you're gonna fry my main broadcasting coil.\""
    },
    {
      "type": "image",
      "url": "/assets/EP27/ep27_panel_06.png",
      "caption": "Jean-Pierre, sweating, looking intensely at Radio Maria. His eyes reflect the harsh security lights of the compound. \"If we don't hardwire this bypass into your mast right now, Vance is going to permanently erase four thousand souls at the Orange Bowl before sunrise. The frequency needs elevation.\""
    },
    {
      "type": "image",
      "url": "/assets/EP27/ep27_panel_07.png",
      "caption": "Axel, heavily silhouetted against the dark, stormy sky, physically hauling a thick bundle of heavy gauge copper wiring up the rusty rungs of the massive radio tower. The ground below looks terrifyingly far away. The LeMans is visible below, its hood open, directly wired into the base of the mast. The LeMans battery acts as the grounding anchor. I haul the output array up two hundred feet of rusted iron. Every rung feels like stepping into a vacuum chamber as Vanguard's sweeps ping against my teeth."
    },
    {
      "type": "image",
      "url": "/assets/EP27/ep27_panel_08.png",
      "caption": "At the top of the tower, Axel violently jams the heavy copper wiring into the massive, humming broadcasting coil of the mast. A massive spark arcs, illuminating Axel's grim, rain-soaked face in a flash of bright blue-white electricity. \"JP! Throw the breaker!\""
    },
    {
      "type": "image",
      "url": "/assets/EP27/ep27_panel_09.png",
      "caption": "A bird's-eye view of the Miami coastline. The radio tower in Sector H erupts with an invisible, but narratively depicted, massive wave of analog \"green\" frequency distortion that expands outward in a perfect shockwave, completely washing over the Orange Bowl and extending far out over the dark waters of the Straits. The tower doesn't just broadcast the signal. It amplifies the analog decay. It doesn't just hide the stadium. It blankets the entire eastern coast."
    },
    {
      "type": "image",
      "url": "/assets/EP27/ep27_panel_10.png",
      "caption": "Inside a Vanguard Repo-Truck near the stadium. The driver is staring in horror as his dashboard, tactical map, and thermal HUD simultaneously die, replaced with screaming analog snow. Director Vance, standing in The Palms skyscraper, looking out a panoramic window. The city below is partially dark. He holds a broken radio headset. \"They didn't just hide the refugees. They took in half the city. Tell the bulldozers to pull back. We're fighting an infrastructure war now.\""
    },
    {
      "type": "image",
      "url": "/assets/EP27/ep27_panel_11.png",
      "caption": "Axel climbs back down, landing heavily on the wet concrete of the compound. Radio Maria tosses him a towel. He looks exhausted but victorious. The Nixie Timer inside the visible dashboard of the LeMans is glowing a solid, impenetrable green. The ghost machine is permanent. The Mariel arrivals have cover. But Vanguard won't fight fair anymore. Tomorrow, the Grid bites back."
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep28: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 28 (\"THE VERDICT HOUR\")... // VOLUME 04: THE SURGE"
    },
    {
      "type": "image",
      "url": "/assets/EP28/ep28_panel_01.png",
      "caption": "AXEL: (Caption) I'm on I-95 southbound when the radio says it. Not the news anchor \u2014 the anchor doesn't say it that way. I hear it first from the scanner, which says it the way scanners say everything: flat, factual, already past tense. *All units, be advised. Verdict returned in the McDuffie case. All five defendants acquitted on all counts.* AXEL: (Caption) I pull over on the shoulder of I-95 north of the 836 interchange. I sit there for ninety seconds with the engine running. The freeway traffic moves around me like water around a rock. AXEL: (Caption) Then I get off at the next exit and head for Calle Ocho."
    },
    {
      "type": "image",
      "url": "/assets/EP28/ep28_panel_02.png",
      "caption": "AXEL: (Caption) The Versailles ventanita crowd is not what it normally is at nine-thirty on a Friday. There are thirty people and none of them are in line. The radios are going \u2014 three different radios, three different stations, all saying the same thing in different languages at the same volume. AXEL: (Caption) Carmen is at the window. She has been at the window since eight o'clock because she knew. Not because she had information. Because she's been in Miami long enough to know what a held breath sounds like. AXEL: (Caption) She sees the LeMans before I park it. She is already untying her apron."
    },
    {
      "type": "image",
      "url": "/assets/EP28/ep28_panel_03.png",
      "caption": "AXEL: (Dialogue) \"I can take you somewhere.\" CARMEN: (Dialogue) \"I know. Give me four minutes.\" AXEL: (Caption) She goes inside. The crowd at the ventanita shifts, redistributes, fills the space she left. Someone takes over the window without being asked \u2014 a younger woman, maybe thirty, who clearly knows how the machine works. Carmen has contingencies for her contingencies. AXEL: (Caption) Four minutes. Exactly."
    },
    {
      "type": "image",
      "url": "/assets/EP28/ep28_panel_04.png",
      "caption": "AXEL: (Caption) She comes out through the side door with a canvas bag that was clearly packed before tonight. Not overpacked \u2014 one change of clothes, documents, a small box wrapped in paper that she puts on her lap and doesn't explain. The colada she hands me through the window is in a paper cup. She made it herself in the four minutes. CARMEN: (Dialogue) \"My cousin's house. Hialeah. I'll give you the turns.\" AXEL: (Dialogue) \"I know Hialeah.\" CARMEN: (Dialogue) \"You know the main streets. I'll give you the turns.\" AXEL: (Caption) She gives me the turns."
    },
    {
      "type": "image",
      "url": "/assets/EP28/ep28_panel_05.png",
      "caption": "AXEL: (Caption) We take Flagler west to get off the main corridor. Behind us \u2014 not behind us yet, but behind us in the way that weather is behind you \u2014 the sky over downtown has a different quality. Not fire yet. The quality that comes before fire. The city deciding. AXEL: (Caption) Carmen watches it in the passenger mirror without turning her head. CARMEN: (Dialogue, quietly) \"They moved the trial so no one was watching.\" AXEL: (Caption) She isn't talking to me. She's completing a thought she started three months ago when the change of venue was granted."
    },
    {
      "type": "image",
      "url": "/assets/EP28/ep28_panel_06.png",
      "caption": "AXEL: (Caption) Hialeah at ten PM. The streets here are quieter but not calm \u2014 the news travels faster than geography. Porch lights on. Doors open. Neighbors talking across fences in the specific register of people processing something together that they have to process alone. AXEL: (Caption) Carmen's cousin's house is on a street I won't write down. Small, concrete block, mango tree in the yard, every light on. The cousin \u2014 a woman Carmen's age, built like someone who has been working since she was fifteen \u2014 opens the door before we reach the porch. CARMEN: (Dialogue, to the cousin) \"Just for a few days.\" COUSIN: (Dialogue) \"However long.\""
    },
    {
      "type": "image",
      "url": "/assets/EP28/ep28_panel_07.png",
      "caption": "AXEL: (Caption) Carmen stops at the LeMans before going inside. She reaches through the window and puts her hand flat on the dashboard for a moment \u2014 not a gesture I understand, not one she explains. Then she looks at me. CARMEN: (Dialogue) \"Jean-Pierre is at the Mesh. He won't leave on his own.\" AXEL: (Dialogue) \"I know.\" CARMEN: (Dialogue) \"The route through Allapattah is going to close. You have maybe an hour.\" AXEL: (Caption) She takes the wrapped box inside. The door closes. The mango tree moves slightly in the hot air coming off the city."
    },
    {
      "type": "image",
      "url": "/assets/EP28/ep28_panel_08.png",
      "caption": "AXEL: (Caption) I get back on the Palmetto and head northeast. The scanner is busy now \u2014 units repositioning, the Justice Building perimeter, someone calling in the first fire on NW 62nd. Liberty City has made its decision. AXEL: (Caption) Through the windshield, maybe six miles east and north, there is a column of smoke against the night sky. Not a house fire. The shape is wrong for a house fire. The shape is the shape of a neighborhood that has run out of other options. AXEL: (Caption) The transmission shifts clean through third into fourth. The steering wheel sits level at noon. The car holds the line. AXEL: (Caption) I push it to 75 and take the NW 2nd Avenue exit toward Little Haiti. --- **[END OF EPISODE 28]**"
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep29: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 29 (\"THE MESH ROUTE\")... // VOLUME 04: THE SURGE"
    },
    {
      "type": "image",
      "url": "/assets/EP29/ep29_panel_01.png",
      "caption": "AXEL: (Caption) NW 2nd Avenue runs straight north through Little Haiti like a spine with too many ribs. Every side street has a name I don't know and a geography I haven't learned. I've driven deliveries here maybe six times in three years, always on the main corridor, always in daylight. AXEL: (Caption) Tonight the side streets are where Jean-Pierre is, and the main corridor has a Vanguard checkpoint at 54th that wasn't there this morning. AXEL: (Caption) I find out about the checkpoint the same way I find out about most things I should have known earlier \u2014 by almost driving into it."
    },
    {
      "type": "image",
      "url": "/assets/EP29/ep29_panel_02.png",
      "caption": "AXEL: (Caption) I pull hard left onto NW 48th Street and kill the headlights for thirty seconds while I think. The scanner is running four simultaneous channels now. The Vanguard frequency \u2014 the one Radio Maria mapped for me six weeks ago \u2014 is active and clipped, coordinates in number sequences I don't have the key for. AXEL: (Caption) I have a hand-drawn map Jean-Pierre gave me in February. I have never needed it until now. I unfold it on the steering wheel. His handwriting is architectural \u2014 small, precise, everything measured. The Mesh-Hub is marked with a symbol that looks like a radio tower crossed with a fish. AXEL: (Caption) Three blocks east. Two blocks north. Alley entrance, not the street."
    },
    {
      "type": "image",
      "url": "/assets/EP29/ep29_panel_03.png",
      "caption": "AXEL: (Caption) The alley is exactly where the map says it is, which shouldn't surprise me but does. Jean-Pierre's van is visible from the alley entrance \u2014 the step-van, the copper wire canopy, the amber glow at the seams of the rear doors. Two men I don't recognize are loading equipment onto a flatbed cart. They look at the LeMans and then at each other and then go back to loading. AXEL: (Caption) The rear door opens before I get out of the car. Jean-Pierre is already in motion. JEAN-PIERRE: (Dialogue) \"You're twelve minutes late.\" AXEL: (Dialogue) \"Vanguard has 2nd Avenue at 54th.\" JEAN-PIERRE: (Dialogue) \"I know. That's why I said twelve minutes.\""
    },
    {
      "type": "image",
      "url": "/assets/EP29/ep29_panel_04.png",
      "caption": "AXEL: (Caption) The trunk of the LeMans has never held what it's holding now. Jean-Pierre moves with the focused economy of a man who has packed under pressure before \u2014 not panicking, not wasting motion. Two receivers. A reel-to-reel the size of a small suitcase. A canvas roll of tools. A wooden box that hums faintly when he sets it on the felt lining and that he handles the way you handle something that cost everything. AXEL: (Dialogue) \"What's in the box.\" JEAN-PIERRE: (Dialogue) \"The Mesh archive. Eighteen months of frequency logs.\" AXEL: (Dialogue) \"What happens if Vanguard gets it.\" JEAN-PIERRE: (Dialogue) \"They don't get it.\" AXEL: (Caption) He closes the trunk. That's the end of that conversation."
    },
    {
      "type": "image",
      "url": "/assets/EP29/ep29_panel_05.png",
      "caption": "AXEL: (Caption) He gets in the passenger seat and puts a second hand-drawn map on the dashboard. His own, newer version \u2014 updated tonight, the ink still slightly wet on two of the route corrections. JEAN-PIERRE: (Dialogue) \"Left out of the alley. Then right on 46th. Don't use your headlights until I say.\" AXEL: (Dialogue) \"I need headlights to drive.\" JEAN-PIERRE: (Dialogue) \"You need eyes to drive. Use those.\" AXEL: (Caption) I use those."
    },
    {
      "type": "image",
      "url": "/assets/EP29/ep29_panel_06.png",
      "caption": "AXEL: (Caption) Little Haiti at eleven PM with no headlights and a city burning six blocks west is its own geography. The neighborhood has a specific darkness \u2014 not the darkness of emptiness but the darkness of people who have learned to operate without being seen. Porch lights off. Windows dark. But not abandoned. I feel the street watching the LeMans move through it the way you feel a room full of people go quiet. AXEL: (Caption) Jean-Pierre navigates without hesitation. Left. Right. Through a lot I would have called impassable from the street. He has been running these routes since before I knew they existed. JEAN-PIERRE: (Dialogue, quietly) \"This street. All the way to the end.\" AXEL: (Caption) At the end of the street, two women wave us through a gap in a chain-link fence that has been opened deliberately, recently, for exactly this."
    },
    {
      "type": "image",
      "url": "/assets/EP29/ep29_panel_07.png",
      "caption": "AXEL: (Caption) We stop once. Jean-Pierre gets out of the car for three minutes and speaks to an old man on a porch in Haitian Creole, rapid and low, nothing I can follow. The old man points north twice. Jean-Pierre comes back. JEAN-PIERRE: (Dialogue) \"NW 7th is closed past 71st. Vanguard or police, he doesn't know which.\" AXEL: (Dialogue) \"Does it matter?\" JEAN-PIERRE: (Dialogue, after a pause) \"Not tonight.\" AXEL: (Caption) He gives me a new route on the fly, from memory, no map. I follow it and it works. Every turn he gives me works. I start to understand what eighteen months of frequency logs actually means \u2014 it means he has been mapping this city the way no one official has bothered to map it."
    },
    {
      "type": "image",
      "url": "/assets/EP29/ep29_panel_08.png",
      "caption": "AXEL: (Caption) We come out onto the Palmetto heading southwest at quarter past midnight. Jean-Pierre turns the scanner up. Three of the Liberty City fires are now listed as \"uncontrolled structure\" on the Dade frequency. The Vanguard channel has gone to number sequences only. AXEL: (Caption) Jean-Pierre watches the scanner the way Carmen watched the passenger mirror. Reading it without looking directly at it. JEAN-PIERRE: (Dialogue) \"Where are we going.\" AXEL: (Dialogue) \"SW 8th. Elio's garage.\" JEAN-PIERRE: (Dialogue) \"I don't know Elio.\" AXEL: (Dialogue) \"You will.\""
    },
    {
      "type": "image",
      "url": "/assets/EP29/ep29_panel_09.png",
      "caption": "AXEL: (Caption) SW 8th Street at twelve-thirty AM. The V\u00c1LDES AUTO sign is dark but the roll-up door is half open and the work lights inside are on. Through the gap: the Cutlass still on the jack. The boat engine on the workbench. Ricky asleep in the folding chair, homework still on the clipboard. AXEL: (Caption) Elio is under the Cutlass. He comes out when he hears the LeMans pull up, looks at the car, looks at the man in the passenger seat, looks at the trunk sitting slightly lower than usual from the weight. ELIO: (Dialogue) \"How many more.\" AXEL: (Dialogue) \"Nobody else tonight. Maybe Sol tomorrow.\" ELIO: (Dialogue) \"Sol I know. The passenger I don't.\" JEAN-PIERRE: (Dialogue, getting out) \"Jean-Pierre Beaumont. I do radio.\" ELIO: (Dialogue, already turning back to the garage) \"There's food inside. Don't touch the Cutlass.\" --- **[END OF EPISODE 29]**"
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep30: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 30 (\"THE LEDGER RUN\")... // VOLUME 04: THE SURGE"
    },
    {
      "type": "image",
      "url": "/assets/EP30/ep30_panel_01.png",
      "caption": "Inside Elio's garage. The corrugated metal door is pulled all the way down and deadbolted. The only illumination is a single caged work-light hanging over the '78 LeMans. Outside, the muffled, heavy sound of distant sirens and the low rumble of a city tearing itself apart. May 18th. 2:00 AM. The Liberty City fires are spreading south. The sky over Overtown hasn't been dark for hours."
    },
    {
      "type": "image",
      "url": "/assets/EP30/ep30_panel_02.png",
      "caption": "Jean-Pierre is sitting on an overturned milk crate, unspooling a massive reel of magnetic tape from the wooden box he brought. Elio is standing next to him, wiping his hands on a shop rag, staring at the tape with profound skepticism. \"It's the Mesh-Archive. Eighteen months of Vanguard's undocumented property seizures. If they format the Grid tonight during the blackout, this is the only geographic memory left.\" **ELIO (DIALOGUE):** \"I fix transmissions. I don't underwrite real estate.\""
    },
    {
      "type": "image",
      "url": "/assets/EP30/ep30_panel_03.png",
      "caption": "Axel leaning against the LeMans' hood. He looks exhausted but wired. The Nixie timer on the dashboard reflects off his eyes\u2014it's glowing steady green, anchored. Vanguard doesn't let a crisis go to waste. A riot is just a distraction. A blackout is an opportunity to wipe the physical ledgers. And Sol Abramowitz is the only one who knows exactly which parcels they're erasing."
    },
    {
      "type": "image",
      "url": "/assets/EP30/ep30_panel_04.png",
      "caption": "The LeMans blasting north on an eerily empty I-95. A massive column of thick, oily black smoke rises from the city in the rearview mirror. No streetlights. The LeMans' high-beams cut a tunnel into the dark. I leave Jean-Pierre with Elio. The LeMans eats the north bound miles. Hollywood, Florida. The Condo Canyon. Sol is twenty miles clear of the fires, but he's standing right on top of the data Vanguard wants to burn."
    },
    {
      "type": "image",
      "url": "/assets/EP30/ep30_panel_05.png",
      "caption": "Looking over the steering wheel. The speedometer reads 85 MPH. The dashboard is quiet. The transmission hums smoothly. Elio's rebuild holds. The car doesn't stutter, doesn't complain. The city is breaking apart, but the machine I've built holds the line. Trust made mechanical."
    },
    {
      "type": "image",
      "url": "/assets/EP30/ep30_panel_06.png",
      "caption": "The Fountainview Condominium in Hollywood. The brutalist concrete tower looks imposing against the night sky. But there are three matte-black Vanguard Repo-SUVs parked directly on the front lawn, crushing the manicured landscaping. The Fountainview. Vance didn't wait for the sun to come up. His ghost-roster sweepers are already here."
    },
    {
      "type": "image",
      "url": "/assets/EP30/ep30_panel_07.png",
      "caption": "Axel steps out of the elevator on the 18th floor. The hallway lights are steady. The door to apartment 1804 (Sol's) is wide open. Two men in crisp corporate suits stand just inside the doorway, holding heavy clipboards and looking frustrated. There are no breached doors. No tactical teams. Vanguard's true sweepers don't wear helmets. They wear suits and carry audit forms."
    },
    {
      "type": "image",
      "url": "/assets/EP30/ep30_panel_08.png",
      "caption": "Inside Sol's apartment. The men in suits are standing awkwardly near the entrance. Sol Abramowitz is sitting calmly in his armchair. A vintage .38 revolver rests casually on his lap. He hasn't fired it, but its quiet weight is demanding the room's absolute respect. **SOL (DIALOGUE):** \"I told you, gentlemen. The property records were shipped to Tallahassee on Tuesday. Corporate never believes the mail service is efficient.\""
    },
    {
      "type": "image",
      "url": "/assets/EP30/ep30_panel_09.png",
      "caption": "Axel enters the apartment, stepping up behind the two distressed Vanguard auditors. He doesn't draw a weapon or throw a punch. He just stands there, blocking the exit, looking like a very large, immovable problem. The corporate auditors are trained to handle default algorithms and panic. They aren't trained to handle an armed retiree and a courier who doesn't care about their clipboards."
    },
    {
      "type": "image",
      "url": "/assets/EP30/ep30_panel_10.png",
      "caption": "One of the suits nervously twitches his hand toward his inner jacket pocket\u2014maybe for a radio, maybe for a sidearm. But Sol casually cocks the hammer of the .38 revolver. The loud, mechanical *click* freezes both suits instantly. **SOL (DIALOGUE):** \"My Miriam hated loud noises. Leave your hand empty, young man.\""
    },
    {
      "type": "image",
      "url": "/assets/EP30/ep30_panel_11.png",
      "caption": "Sol calmly packs his single leather suitcase while Axel holds the door, watching the Vanguard suits slowly back out into the hallway in defeat. Through the 18th-floor panoramic window, the massive glow of a burning Miami is visible on the southern horizon. \"We need to go, Sol. The blackout is creeping north. Vanguard is wiping the physical district ledgers tonight.\" **SOL (DIALOGUE):** \"Let them wipe the paper. I memorized the parcel numbers.\""
    },
    {
      "type": "image",
      "url": "/assets/EP30/ep30_panel_12.png",
      "caption": "The LeMans tearing away from the Fountainview, Sol sitting comfortably in the passenger seat with his leather suitcase on his lap. The Vanguard SUVs remain parked, useless. The car heads back toward the glow of Miami. I move the anchors. Carmen to Hialeah. Jean-Pierre to SW 8th. Sol is with me. The city belongs to fire tonight, but the Grid belongs to whoever remembers the layout in the morning."
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep31: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 31 (\"THE MORNING AFTER\")... // VOLUME 04: THE SURGE"
    },
    {
      "type": "image",
      "url": "/assets/EP31/ep31_panel_01.png",
      "caption": "AXEL: (Caption) Dawn comes in through the roll-up door of Elio's garage like it doesn't know what it's interrupting. Pink light on the concrete floor. The smell of the city \u2014 smoke and wet asphalt and something underneath that, something that doesn't wash off in a night. AXEL: (Caption) Sol is asleep in Elio's office chair, leather suitcase on his lap, one hand resting on top of it. He fell asleep mid-sentence around four AM and nobody moved him. His breathing is steady. His grip on the suitcase is not."
    },
    {
      "type": "image",
      "url": "/assets/EP31/ep31_panel_02.png",
      "caption": "AXEL: (Caption) Jean-Pierre has been awake all night. The reel-to-reel is running on the workbench next to the boat engine \u2014 the Mesh archive playing back on a loop, verifying itself. He has a legal pad of his own now, borrowed from somewhere, covered in coordinates and parcel notations. He and Sol spent two hours comparing notes before Sol fell asleep. AXEL: (Caption) Eighteen months of frequency logs. A retired accountant's memory for numbers. Between the two of them they have most of what Vanguard spent last night trying to erase."
    },
    {
      "type": "image",
      "url": "/assets/EP31/ep31_panel_03.png",
      "caption": "AXEL: (Caption) Elio is under the Cutlass. He never stopped working. At some point during the night he made coffee \u2014 there's a pot on the hotplate in the corner, still warm, three cups already used. He doesn't sleep during other people's emergencies. He fixes things. AXEL: (Dialogue, crouching by the Cutlass) \"How's the Cutlass.\" ELIO: (From under the car) \"It'll be ready Wednesday.\" AXEL: (Dialogue) \"It's Sunday.\" ELIO: (From under the car) \"I know what day it is.\""
    },
    {
      "type": "image",
      "url": "/assets/EP31/ep31_panel_04.png",
      "caption": "AXEL: (Caption) I take my coffee outside and sit on the hood of the LeMans in the early morning. SW 8th Street is quiet in the specific way streets are quiet after something large has passed through nearby \u2014 not peaceful, just emptied out. A few people moving. A woman walking fast with grocery bags. A man standing on his porch looking north toward where the smoke is thinner now but still visible. AXEL: (Caption) The city is doing the math. Everybody is doing the math."
    },
    {
      "type": "image",
      "url": "/assets/EP31/ep31_panel_05.png",
      "caption": "AXEL: (Caption) Sol finds me out there around seven. He's carrying his coffee and the leather suitcase and he looks like a man who slept three hours in an office chair and has done it before under worse circumstances. SOL: (Dialogue) \"You want to know what Vanguard bought last night.\" AXEL: (Dialogue) \"I want to know what they think they bought.\" SOL: (Dialogue, sitting on the LeMans bumper) \"Eleven parcels in Overtown. Six in the Drowned District. Three in Liberty City itself \u2014 they moved fast on those, the smoke was still going.\" He pauses. \"They paid forty cents on the dollar. Some of them less.\" AXEL: (Caption) The math the city is doing. Vance did it first."
    },
    {
      "type": "image",
      "url": "/assets/EP31/ep31_panel_06.png",
      "caption": "AXEL: (Caption) Sol opens the suitcase on his knees. Inside: not the legal pad I expected. A small leather notebook, the kind with a strap closure, filled end to end in his cramped blue pen. Parcel numbers, addresses, acquisition dates, shell company names. He's been keeping this for months \u2014 since the pool deck in Hollywood, since the afternoon he fed me lunch and showed me Miriam's photograph. SOL: (Dialogue) \"My backup for the backup. The legal pad was for showing you. This is for using.\" AXEL: (Dialogue) \"Using how.\" SOL: (Dialogue) \"When someone decides to do something about it. Which is not my department.\" AXEL: (Caption) He hands it to me. It's lighter than it should be for what it contains."
    },
    {
      "type": "image",
      "url": "/assets/EP31/ep31_panel_07.png",
      "caption": "AXEL: (Caption) Carmen calls the garage at eight AM. Elio's phone, the wall unit by the parts cabinet. She's at her cousin's in Hialeah, she's fine, she already knows most of what happened because the cousin's neighbor has a police scanner and they've been up all night. CARMEN: (Dialogue, through the phone) \"The ventanita is intact. I called Marisol. She kept it closed all night but she was there.\" AXEL: (Dialogue) \"Good.\" CARMEN: (Dialogue) \"Tell me who's at the garage.\" AXEL: (Caption) I tell her. A pause. CARMEN: (Dialogue) \"Jean-Pierre needs to eat. There's rice in the cabinet above the hotplate. Elio won't tell him.\" AXEL: (Caption) She hangs up. I find the rice. She was right \u2014 Elio wouldn't have mentioned it."
    },
    {
      "type": "image",
      "url": "/assets/EP31/ep31_panel_08.png",
      "caption": "AXEL: (Caption) By nine AM the garage has a specific quality \u2014 four people in a space built for one, the city outside still processing what happened, the reel-to-reel still running. Nobody is talking about what comes next. Not yet. The coffee is gone. Jean-Pierre has eaten. Sol is reading his notebook like he's checking his own work. AXEL: (Caption) Elio comes out from under the Cutlass, wipes his hands on a shop rag \u2014 one finger at a time, the same way he did in October, the same way he always does. He looks at the four of us. He doesn't say anything for a moment. ELIO: (Dialogue) \"I need the workbench back.\" AXEL: (Caption) Jean-Pierre moves the reel-to-reel. Sol closes his notebook. I take the last cup from the pot. AXEL: (Caption) Elio goes back to work. The city outside is still smoking. The notebook is in my jacket pocket \u2014 left side, where the tape used to be, where the recipe card was, where the address list is. The pocket is full now. It has been filling since March. AXEL: (Caption) Vance has twenty parcels. We have a notebook and a reel of tape and a retired accountant's memory and a garage on SW 8th that is still standing. AXEL: (Caption) It's something. It's not nothing. --- **[END OF EPISODE 31]** **[END OF VOLUME 04: THE SURGE]**"
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep32: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 32 (\"THE AUDIT\")... // VOLUME 04: THE SURGE"
    },
    {
      "type": "image",
      "url": "/assets/EP32/ep32_panel_01.png",
      "caption": "The interior of Elio's garage, morning. Heavy, dusty shafts of sunlight slice through the rusted vents of the corrugated metal roll-up door. The air is thick with the scent of ozone, exhaust, and stale Cuban coffee. Elio, Axel, Jean-Pierre, and Sol look hollowed-out and exhausted, clustered around a grease-stained workbench under a single caged work-light. May 19th. 9:00 AM. The fires in Liberty City have burned themselves down to a heavy grid of ash. We stopped running at dawn."
    },
    {
      "type": "image",
      "url": "/assets/EP32/ep32_panel_02.png",
      "caption": "Tight focus on the workbench texture. Sol's pristine, leather-bound notebook lies open flat, its meticulously hand-written blue ink numbers stark against a backdrop of greasy wrenches, brass fittings, and a discarded oil filter. **SOL (DIALOGUE):** \"Look at the time codes. They didn't buy these lots after the fires started. The shell companies were incorporated three weeks ago.\" The adrenaline is gone. Now there is only the math."
    },
    {
      "type": "image",
      "url": "/assets/EP32/ep32_panel_03.png",
      "caption": "Jean-Pierre expertly threading the massive, heavy magnetic tape of the Mesh Archive into a customized, scavenged reel-to-reel deck hooked up to a cathode-ray oscilloscope. The screen glows with a faint green sine wave. \"The physical deeds are gone. Vanguard municipal sweepers formatted the county mainframe during the blackout. But we have the analog echoes. The Mesh caught every data transmission.\" Eighteen months of Vanguard's breathing, caught on magnetic rust."
    },
    {
      "type": "image",
      "url": "/assets/EP32/ep32_panel_04.png",
      "caption": "Axel leaning against the reinforced front grille of the '78 LeMans, looking at the exhausted crew. The deep shadows of the garage make the chrome trim of the car look dull. The LeMans smells like smoke and survival. Elio's transmission held the line. But surviving the night isn't the same as knowing what to do with the morning. \"So we have a map of buildings that Vanguard technically doesn't own yet. What do we do with it?\""
    },
    {
      "type": "image",
      "url": "/assets/EP32/ep32_panel_05.png",
      "caption": "Sol adjusting his glasses, looking up from the notebook. He is out of his element in a chop-shop, but his intellect is sharp, cold, and assessing. **SOL (DIALOGUE):** \"They need these physical locations to anchor their Grid-Spikes perfectly across the county. If we disrupt the anchor points before they finalize the hardware installation...\" **ELIO (DIALOGUE):** \"...The network collapses underneath them.\""
    },
    {
      "type": "image",
      "url": "/assets/EP32/ep32_panel_06.png",
      "caption": "Sol's hands turning a page in his notebook. He taps a thick, gnarled finger on a specific address in Overtown. **SOL (DIALOGUE):** \"It starts here. Parcel 402 on NW 3rd Avenue. An old textile warehouse. If they anchor there, they control the mid-city routing.\""
    },
    {
      "type": "image",
      "url": "/assets/EP32/ep32_panel_07.png",
      "caption": "Elio standing near the garage's wall-mounted rotary phone. He has the receiver pressed to his ear, listening. Through the half-open garage door behind him, the distant, rhythmic thud of a demolition wrecking ball can be heard echoing across the city blocks. **ELIO (DIALOGUE):** \"That was Ricky. He's at the salvage yard. Says city crews just pulled up to a textile warehouse on NW 3rd Avenue with bulldozers and emergency demolition permits.\""
    },
    {
      "type": "image",
      "url": "/assets/EP32/ep32_panel_08.png",
      "caption": "Axel's face, partially obscured by the heavy shadows of the garage. He looks down at the greasy floor. The weight of the situation settling over him heavily. Vance isn't looking for the notebook anymore. He isn't sending heavily armed squads to kick down doors. He's just erasing the things the notebook describes. We sit in a hot garage holding a list of places that are ceasing to exist."
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep33: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 33 (\"THE SALVAGE RUN\")... // VOLUME 04: THE SURGE"
    },
    {
      "type": "image",
      "url": "/assets/EP33/ep33_panel_01.png",
      "caption": "The hood of the '78 LeMans tearing down a sunlit, smoke-stained Miami avenue. The speedometer needle is buried past 70 MPH. The city is awake, traffic is moving, but Axel is threading the needle through the morning commute with brutal efficiency. 9:08 AM. Eight minutes since Ricky called Elio. Eight minutes since we realized Vance isn't playing a shell game. He's playing a bulldozer game."
    },
    {
      "type": "image",
      "url": "/assets/EP33/ep33_panel_02.png",
      "caption": "Inside the LeMans. Jean-Pierre is in the passenger seat, gripping the dashboard with white knuckles. He has Sol's leather notebook splayed open on his lap, tracing lines of text with a frantic finger. Axel's eyes are locked on the road, cold and hyper-focused. \"Parcel 402! Brick textile warehouse. Three stories. It used to be a garment processing hub in the fifties. If Vance anchored a primary Grid-Spike there, it'll be wired directly into the old industrial high-voltage main!\" \"Just tell me where the main is.\""
    },
    {
      "type": "image",
      "url": "/assets/EP33/ep33_panel_03.png",
      "caption": "The LeMans violently fish-tails into an alleyway in Overtown, stopping short of a chain-link fence. On the other side of the fence stands a massive, crumbling three-story brick textile warehouse (Parcel 402). Two heavy, yellow diesel bulldozers are already positioned at the front facade, their massive steel blades chewing into the old brickwork. Dust is rising in plumes. They didn't even put up caution tape. No hardhats. No perimeter checks. They have emergency demolition permits signed by the Mayor's office and they're using them right now."
    },
    {
      "type": "image",
      "url": "/assets/EP33/ep33_panel_04.png",
      "caption": "Axel shouldering open a rusted side utility door \u2014 it gives on age and disuse, not force. JP is right behind him with a brass flashlight and crowbar already in hand, scanning the ceiling structure. The building is screaming. Steel beams groaning against diesel engines from the outside. \"Second floor. They'd put the relay junction near the old industrial fuse box. Come on!\""
    },
    {
      "type": "image",
      "url": "/assets/EP33/ep33_panel_05.png",
      "caption": "Axel's heavy boots sprinting up a set of rotting wooden stairs. Dust and debris are falling from the ceiling as the building vibrates violently from a bulldozer impact outside. We have maybe four minutes before the load-bearing walls give out. We need the routing cards in the relay junction on the second floor. That's it. That's the whole job."
    },
    {
      "type": "image",
      "url": "/assets/EP33/ep33_panel_06.png",
      "caption": "Axel and JP burst into a small, dusty foreman's office. In the center of the room, starkly contrasting with the rotting 1950s wood and peeling wallpaper, is a heavy, drab olive-green steel lockbox roughly the size of a mini-fridge. It is secured to the wall, humming loudly, with thick black coaxial cables and copper grounding wires snaking out of the bottom. \"That's it. The mid-city routing anchor. A mechanical patch panel.\" \"What are we taking?\""
    },
    {
      "type": "image",
      "url": "/assets/EP33/ep33_panel_07.png",
      "caption": "JP desperately using the crowbar to pry open the heavy steel door of the lockbox. Inside are rows of physical switching relays and a slot holding several thick, plastic-encased frequency assignment cards with handwritten labels. \"We don't kill the power. We take the routing cards. Without the physical frequency assignments, every transmitter in the mid-city band starts fighting itself. The whole thing goes dark from interference.\""
    },
    {
      "type": "image",
      "url": "/assets/EP33/ep33_panel_08.png",
      "caption": "The wall of the office suddenly buckles inward in a violent shower of brick and plaster as the corner of a bulldozer's steel blade pierces the second-story exterior. The massive impact knocks Axel and JP hard against the floor. Dust chokes the room entirely. Three minutes was an optimistic projection. \"JP. Pull the cards. We're out of time.\""
    },
    {
      "type": "image",
      "url": "/assets/EP33/ep33_panel_09.png",
      "caption": "Axel and JP stumbling out of the crumbling building through a cloud of dust, coughing and exhausted. They are not sprinting heroically; they are barely managing to walk upright as the roof behind them definitively caves in. JP is clutching a heavy metal assignment card tightly to his chest. 9:24 AM. Sixteen minutes since Ricky called Elio. JP has six routing cards in his jacket. Vanguard has a building they just paid a demolition crew to collapse on top of an empty lockbox. We get in the car. **[END OF EPISODE]**"
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep34: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 34 (\"THE LAYOUT\")... // VOLUME 04: THE SURGE"
    },
    {
      "type": "image",
      "url": "/assets/EP34/ep34_panel_01.png",
      "caption": "Elio's garage bay. Morning light cutting through the half-open roll door in hard amber slabs. The LeMans is inside, still road-dusty and flecked with plaster from the warehouse. Axel and JP just walked in \u2014 both carrying the same dust, JP still has the routing cards tucked against his chest. Sol is already at the workbench, leather notebook open. Elio is leaning against the LeMans fender with a rag in his hands, waiting. 10:31 AM. The garage is the only room in Miami that feels the same as it did this morning. ---"
    },
    {
      "type": "image",
      "url": "/assets/EP34/ep34_panel_02.png",
      "caption": "JP's hands spreading all six routing cards across Elio's workbench in sequence, side by side. Cream plastic, thick, each one labeled in handwritten black marker \u2014 sector codes, frequency numbers, dates of installation. Sol's leather notebook is open beside them. \"Six cards. Mid-city routing band \u2014 NW 2nd Avenue through NW 14th. Every frequency assignment for every transmitter Vanguard anchored in the sector.\" \"In English.\" \"A handwritten map of everything they installed. And everything they were planning to install.\" ---"
    },
    {
      "type": "image",
      "url": "/assets/EP34/ep34_panel_03.png",
      "caption": "JP pointing at one of the cards. Sol running his finger down a column in his notebook, comparing addresses. **SOL (DIALOGUE):** \"The frequency codes \u2014 cross-reference them against the parcel numbers.\" \"Already did it in the car.\" **SOL (DIALOGUE):** \"And?\" \"Every address in your notebook flagged for demolition has a corresponding frequency assignment on these cards.\" ---"
    },
    {
      "type": "image",
      "url": "/assets/EP34/ep34_panel_04.png",
      "caption": "Axel standing slightly back from the workbench, watching JP and Sol work. Elio still leaning against the car, arms crossed now, listening. The cards weren't a backup copy. They were the directory. Every anchor point Vanguard has already put in this city, written in black marker on cream plastic. A paper map of a system that was supposed to be invisible. ---"
    },
    {
      "type": "image",
      "url": "/assets/EP34/ep34_panel_05.png",
      "caption": "Sol has pulled the notebook flush against the spread of cards. He's sketching a rough diagram in the margin \u2014 circles connected by lines, sector labels. His pen moving. **SOL (DIALOGUE):** \"Mid-city is dark. They lose NW 2nd through 14th the moment these cards are gone. But there are four sectors they still need to anchor before end of summer.\" **SOL (DIALOGUE):** \"Port corridor. Brickell residential. Upper bay grid.\" **SOL (DIALOGUE):** \"And this one.\" ---"
    },
    {
      "type": "image",
      "url": "/assets/EP34/ep34_panel_06.png",
      "caption": "Extreme close-up of a single routing card held in Sol's fingers. The handwritten label is clearly legible: **BISCAYNE ENTERTAINMENT BAND / NW CORRIDOR.** The handwriting is the same bureaucratic black marker as all the others. It looks identical to every other card. That's the point. ---"
    },
    {
      "type": "image",
      "url": "/assets/EP34/ep34_panel_07.png",
      "caption": "Axel reading the card. Flat. No surprise. The Mutiny. The Fontainebleau. The Forge. Three miles of neon and credit and people who believe the worst thing that can happen to them is a bad table at a mediocre restaurant. ---"
    },
    {
      "type": "image",
      "url": "/assets/EP34/ep34_panel_08.png",
      "caption": "Nobody moving. The cards on the bench, the notebook open, the diagram half-sketched. The weight of it sitting in the room. Elio and Axel on one side, Sol and JP on the other. The workbench between them like a table at a meeting nobody wanted to have. **ELIO (DIALOGUE):** \"So Vance isn't just taking the neighborhoods.\" **SOL (DIALOGUE):** \"He never was. He's taking everything that runs on debt and desperation. The nightclubs run on both.\" ---"
    },
    {
      "type": "image",
      "url": "/assets/EP34/ep34_panel_09.png",
      "caption": "Axel's hand picking up the Biscayne Entertainment card off the workbench. Just the hand and the card. The cream plastic, the black marker label. In the background, Sol closes his notebook. JP opens a fresh page. Four sectors still live. Vanguard needs the hardware anchored before the end of summer or they lose the installation window. **[END OF EPISODE]**"
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep35: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 35 (\"THE SERVICE ROUTE\")... // VOLUME 04: THE SURGE"
    },
    {
      "type": "image",
      "url": "/assets/EP35/ep35_panel_01.png",
      "caption": "Same garage from Episode 34. The routing cards still spread across the workbench. JP has a fresh notepad open and is drawing \u2014 not a circuit diagram, a rough spatial footprint. Rectangles, a loading dock, a box in the back corner labeled ELECTRICAL. Sol is at the wall-mounted phone across the garage, speaking quietly, her notebook open in her hand. Elio hasn't moved from the fender. 11:15 AM. JP draws floor plans from memory. Sol calls in a favor. The Biscayne card stays on the workbench where anyone can see it."
    },
    {
      "type": "image",
      "url": "/assets/EP35/ep35_panel_02.png",
      "caption": "JP's hand on the notepad, pen moving. The rough floor plan taking shape: bar, stage, loading dock, and a square in the back marked ELECTRICAL with a circle indicating a power drop. Lines connecting it to the exterior wall. \"The extractor needs a direct 220-volt tap. They wouldn't install it on the public floor \u2014 too visible, too hot. Electrical room or loading dock. The conduit runs from outside.\" \"How big is the box?\" \"The size of a residential water heater. Olive-green housing. Different label than the warehouse unit but the same contractor hardware.\""
    },
    {
      "type": "image",
      "url": "/assets/EP35/ep35_panel_03.png",
      "caption": "Sol replacing the handset. Turning back toward the room. Her expression is flat and specific \u2014 not satisfied, just done. **SOL (DIALOGUE):** \"The Mutiny's electrical contractor is a man named Barrios. He's run four major installs there in eighteen months. That's two more than the building needed.\" \"Vanguard's work.\" **SOL (DIALOGUE):** \"Barrios doesn't know that. He ran the conduit. That's all he knows.\" ---"
    },
    {
      "type": "image",
      "url": "/assets/EP35/ep35_panel_04.png",
      "caption": "The Mutiny Hotel from across the street, mid-afternoon. No neon yet \u2014 the lights are off and the building looks like what it is: a waterfront resort with a parking lot and a linen truck backing out of the side street. The velvet rope is coiled on a post. Axel on the sidewalk opposite, moving slowly. Not dressed for it. Just a man on a route. Three hundred people by ten PM. Forty staff. A kitchen that never closes and a bar that comps the first drink for anyone with a Dade County Amex card. The Mutiny runs on credit and the specific kind of desperation that calls itself ambition."
    },
    {
      "type": "image",
      "url": "/assets/EP35/ep35_panel_05.png",
      "caption": "Axel at the corner, looking down the side street toward the dock. Pallets, a hand truck, stacked liquor cases. Normal dock life. On the exterior wall beside the dock door: a utility box, newer than everything around it. Bigger than it needs to be for a bar with a liquor license. The dock runs from seven in the morning to three in the afternoon, six days a week. After that, the only thing moving through the side street is catering and the occasional private car that thinks a back entrance is more discreet than the front."
    },
    {
      "type": "image",
      "url": "/assets/EP35/ep35_panel_06.png",
      "caption": "Close on the utility box mounted to the exterior wall. Standard industrial housing, padlocked. A heavy conduit disappearing into the building. The padlock is a specific model \u2014 undistinguished, catalog-standard, the kind Vanguard uses across every field install because it's the cheapest hardware that isn't memorable. I've seen that padlock on three other sites. Once you know what you're looking at, it's not hidden. They're counting on no one knowing what it means. ---"
    },
    {
      "type": "image",
      "url": "/assets/EP35/ep35_panel_07.png",
      "caption": "The Cinema Rouge. Low light, red velvet, a 16mm projector threading film somewhere in the back. Reya is at Booth 14 \u2014 a corner table set back from the floor. On the table: a rolled tube of architectural prints, the kind a contractor carries. She's already unrolled the relevant page and weighted the corners with an ashtray and a glass. Axel sits across from her, jacket off, the heat still on him from the afternoon. **REYA (DIALOGUE):** \"Original permit shows a single 110-volt service line to the south bar. The Barrios install added a 220 drop into the loading dock utility room. There's no equipment in that room that needs 220.\" \"That's where it is.\" **REYA (DIALOGUE):** \"That's where it is.\""
    },
    {
      "type": "image",
      "url": "/assets/EP35/ep35_panel_08.png",
      "caption": "The unrolled blueprint spread on the table. The loading dock utility room circled in pencil \u2014 Reya's hand. A dotted line tracing the new conduit run from the exterior box through the wall. The handwriting beside it: \"220V / BARRIOS 02-1980.\" Two jobs. Get into the utility room during dock hours. Pull the routing card from the hardware before Vanguard's installation crew shows up to anchor it. The Mutiny doesn't need to know anything happened."
    },
    {
      "type": "image",
      "url": "/assets/EP35/ep35_panel_09.png",
      "caption": "Axel and Reya at the table. The blueprint between them, the projector light catching the edge of it. The Biscayne Entertainment Band routing card face-up on the table beside the print \u2014 Axel set it there at some point. Reya looking at it. **REYA (DIALOGUE):** \"The dock opens at seven.\" There are three more venues on the card after the Mutiny. The Fontainebleau. The Forge. A private club on the bay I've never heard of. Before the end of summer, all of them. **[END OF EPISODE]**"
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep36: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 36 (\"THE LUNCH SHIFT\")... // VOLUME 04: THE SURGE"
    },
    {
      "type": "image",
      "url": "/assets/EP36/ep36_panel_01.png",
      "caption": "The Mutiny Hotel's side street, late morning. The dock is busy \u2014 a produce delivery just finishing, a kitchen porter moving cases, a linen truck double-parked ahead of a hand truck loaded with bagged laundry. Axel is the man with the hand truck. White uniform shirt, black pants, nothing unusual. He's not performing anything. He's just there. 11:47 AM. The dock runs hot during lunch prep. Twelve people moving. Nobody looking at each other."
    },
    {
      "type": "image",
      "url": "/assets/EP36/ep36_panel_02.png",
      "caption": "Sol at a payphone on Bayshore Drive, the Biscayne Entertainment routing card held flat against the metal shelf, her finger on the sector code line. She's speaking, not rushing. **SOL (DIALOGUE):** \"This is Dade County Electrical Coordination, reference number four-seven-two. We have a maintenance flag on your NW Corridor service tap \u2014 sector code BISCAYNE-E. Your dock manager should be expecting a service technician.\" **SOL (DIALOGUE):** \"No. It's a standing contract. He just needs to clear the utility room.\""
    },
    {
      "type": "image",
      "url": "/assets/EP36/ep36_panel_03.png",
      "caption": "The dock manager \u2014 a heavyset man in a Mutiny polo, phone still in hand \u2014 giving Axel a distracted wave toward the interior corridor without breaking a conversation with someone else. Axel moving past him with the hand truck, eyes forward. The sector code does the work. Nobody wants to be the person who held up a county service call. ---"
    },
    {
      "type": "image",
      "url": "/assets/EP36/ep36_panel_04.png",
      "caption": "A narrow service corridor behind the kitchen. Institutional tile, a mop bucket, the noise of the lunch service leaking through the wall. Axel moving past a prep cook who doesn't look up. The utility room door at the end of the corridor \u2014 the same model padlock as the exterior box. The utility room is where they put the things a hotel doesn't want guests to think about. Water heaters, circuit breakers. Whatever else."
    },
    {
      "type": "image",
      "url": "/assets/EP36/ep36_panel_05.png",
      "caption": "Axel inside the utility room, door closed behind him. The olive-green steel box is there \u2014 same contractor housing as the warehouse unit, bolted to the wall, coaxial cables at the base. But something is different: a secondary cable run connects it to a rack-mounted component beside it. A reel-to-reel tape recorder, institutional grade, with a stack of tape reels in a metal tray. Each reel has a strip of masking tape on the hub \u2014 names written in ballpoint pen. Room numbers. Dates. The routing hardware is there. But the routing hardware isn't the only thing there."
    },
    {
      "type": "image",
      "url": "/assets/EP36/ep36_panel_06.png",
      "caption": "Extreme close on the masking tape labels. A room number: 412. A name \u2014 not legible enough to read fully, but the format is clear: surname, initial, date. Another reel: a Dade County commissioner's name, partially visible. The handwriting is careful and administrative. Vanguard isn't just anchoring the Grid in the Mutiny. They're running a tap off the hotel's existing wire infrastructure and archiving it. Every conversation in those rooms, going onto physical tape. Filed by name. ---"
    },
    {
      "type": "image",
      "url": "/assets/EP36/ep36_panel_07.png",
      "caption": "Axel walking back out through the dock with the laundry hand truck, now weighted differently \u2014 the hardware and a selection of the tape reels are under the linen bags. The dock manager is on the phone again, back turned. The produce truck is gone. I take the routing hardware and six reels. I leave the rest. There are forty-something reels in that tray and I don't know yet what's on all of them."
    },
    {
      "type": "image",
      "url": "/assets/EP36/ep36_panel_08.png",
      "caption": "Axel in the passenger seat of the LeMans, Sol driving. The hardware is on the back seat wrapped in a linen bag. Axel is holding one of the tape reels up, reading the masking tape label. Sol watching the road. \"They're not just anchoring the grid. They're running a wire archive off the hotel's phone infrastructure. Physical tape. Filed by name.\" **SOL (DIALOGUE):** \"Whose names.\" \"I saw a commissioner. Maybe two.\""
    },
    {
      "type": "image",
      "url": "/assets/EP36/ep36_panel_09.png",
      "caption": "Sol's hands tightening slightly on the steering wheel. Not dramatic \u2014 just a small, controlled adjustment. The city moving past the window behind her. Vanguard isn't just building the Grid. They're loading it with everything they need to own the people who could stop them. **[END OF EPISODE]**"
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep37: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 37 (\"THE SCATTERED DECK\")... // VOLUME 04: THE SURGE"
    },
    {
      "type": "image",
      "url": "/assets/EP37/ep37_panel_01.png",
      "caption": "Elio's garage, early. The tape reels from the Mutiny are in a cardboard box on the workbench beside the routing cards. JP is running a wire from his mesh transmitter to a secondary unit \u2014 a frequency monitor, analog dial face. Sol has two documents spread on the workbench: the routing card and what appears to be a city electrical inspection form, blank, with a Dade County seal. Axel leaning against the car. Vanguard knows about the Mutiny. They pulled the service contract the same afternoon we cleared the utility room. Two locations left before the summer window closes: the Fontainebleau and The Forge. We can't go in the same way twice."
    },
    {
      "type": "image",
      "url": "/assets/EP37/ep37_panel_02.png",
      "caption": "JP pointing at the frequency monitor, explaining something. Elio listening with his arms crossed, expression neutral \u2014 he's not technical but he's following. \"If I park the van on Collins Avenue and run the transmitter at full output, I can flood the Fontainebleau's local band. The extractor starts fighting interference. It won't trip an alarm \u2014 it'll just look like a bad signal day.\" **ELIO (DIALOGUE):** \"How long does that buy me?\" \"Twenty minutes before someone starts making phone calls.\" ---"
    },
    {
      "type": "image",
      "url": "/assets/EP37/ep37_panel_03.png",
      "caption": "Left half: JP's van parked on Collins Avenue, the transmitter running \u2014 a needle on the frequency monitor swinging into the red. Right half: the Fontainebleau's service entrance, Elio in a maintenance uniform walking through with a toolbox. A bellman holds the door without looking at him. JP holds the frequency. Elio holds the toolbox. The Fontainebleau runs on the assumption that anyone in a uniform is supposed to be there."
    },
    {
      "type": "image",
      "url": "/assets/EP37/ep37_panel_04.png",
      "caption": "Elio in a narrow corridor, utility lighting, the olive-green hardware box on the wall ahead of him. He works the padlock with a pick \u2014 not glamorous, just methodical. The toolbox open at his feet. Elio has been opening things that don't belong to him since before I learned to drive. He doesn't rush. ---"
    },
    {
      "type": "image",
      "url": "/assets/EP37/ep37_panel_05.png",
      "caption": "The Forge on Arthur Godfrey Road, mid-morning. A service entrance on the side street. Two men in business suits are at the utility box mounted to the exterior wall \u2014 one holds a clipboard, the other is working the padlock. They have the look of people who are supposed to be there: unhurried, institutional. Axel and Reya approaching from down the block, both carrying document folders. Vanguard moved fast. Two contractors at the box, legitimate service paperwork, and nobody inside the restaurant knows who they work for."
    },
    {
      "type": "image",
      "url": "/assets/EP37/ep37_panel_06.png",
      "caption": "Axel and Reya arriving at the utility box. Axel holding out a document toward the nearest Vanguard contractor \u2014 the Dade County inspection form, filled out, sealed. The contractor taking it, reading it. His expression is careful, not hostile. **REYA (DIALOGUE):** \"County electrical coordination. We have a standing audit flag on this tap. Routine.\" **VANGUARD CONTRACTOR (DIALOGUE):** \"We have a service contract on this unit.\" \"Then you can stand here while we complete the inspection. That's how this works.\""
    },
    {
      "type": "image",
      "url": "/assets/EP37/ep37_panel_07.png",
      "caption": "The contractor a few steps away, phone to his ear, speaking quietly. His back to Axel. Axel at the utility box, working quickly. Reya watching the contractor, her folder open in her hands \u2014 performing the audit. He's calling it in. We have the time it takes Vanguard's office to call back and tell him to hold his ground. Maybe four minutes."
    },
    {
      "type": "image",
      "url": "/assets/EP37/ep37_panel_08.png",
      "caption": "Axel and Reya walking away from The Forge, the hardware in the document folder under Reya's arm. Half a block away, a second Vanguard operative \u2014 a woman in a gray blazer, on foot \u2014 stops on the sidewalk and looks directly at Reya's face for two full seconds before Reya turns away. The operative is already reaching for something in her jacket pocket. Three seconds. Long enough. ---"
    },
    {
      "type": "image",
      "url": "/assets/EP37/ep37_panel_09.png",
      "caption": "Axel driving. Reya in the passenger seat, the hardware on her lap, not looking at it. The city moving past. Axel's eyes on the mirror. Two for two. The Fontainebleau dark, The Forge dark. One venue left on the card. One venue nobody's been able to identify. **REYA (DIALOGUE):** \"She got a look at me.\" \"I know.\" **REYA (DIALOGUE):** \"Then you know what that means for the Cinema Rouge.\" **[END OF EPISODE]**"
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep38: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 38 (\"THE GHOST CLUB\")... // VOLUME 04: THE SURGE"
    },
    {
      "type": "image",
      "url": "/assets/EP38/ep38_panel_01.png",
      "caption": "The Biscayne Entertainment routing card on the workbench under a work lamp. JP's finger tracing the last entry: a sector code without a street address \u2014 just a set of coordinates in the margin, handwritten smaller than the rest. Beside the coordinates, a single word in the same bureaucratic black marker: STILTS. \"It's not a street address. It's a water coordinate. Biscayne Bay \u2014 five miles offshore.\" **SOL (DIALOGUE):** \"Stiltsville.\" Stiltsville. A dozen houses on stilts built on sandbars in the middle of the bay. Most of them abandoned or close to it. Whatever's out there, it's not on any permit Vanguard filed with the city. ---"
    },
    {
      "type": "image",
      "url": "/assets/EP38/ep38_panel_02.png",
      "caption": "A center-console boat running south across flat, bright water. Axel at the wheel, one hand on the throttle. The Miami skyline receding behind them, low and hazy. No other vessels nearby. The water color shifting from green to blue-gray as depth increases. Manny's boat. Borrowed. He didn't ask why and I didn't explain. He handed me the keys and said bring it back with fuel."
    },
    {
      "type": "image",
      "url": "/assets/EP38/ep38_panel_03.png",
      "caption": "A cluster of structures on the horizon \u2014 the Stiltsville houses on their pilings, scattered across the sandbar flats. Most look weathered and dark. One structure ahead has what might be a light on inside \u2014 difficult to tell in the afternoon glare. Axel slowing the boat. Seven structures still standing. Most of them empty for years. The coordinates put us at the southernmost one."
    },
    {
      "type": "image",
      "url": "/assets/EP38/ep38_panel_04.png",
      "caption": "Axel tying the boat to a weathered piling. The structure above: a low wooden building on stilts, wide deck, once a gathering place of some kind \u2014 a bar rail still bolted to the deck railing, rusted. A door standing half-open. No light from inside. The lights were off before we got close enough to see them go off. Or they were already off. Either way. ---"
    },
    {
      "type": "image",
      "url": "/assets/EP38/ep38_panel_05.png",
      "caption": "Inside. A single room, low ceiling, salt-warped wood. Recently occupied: folding tables still set up, an overturned glass, a deck of cards on the floor. On the far wall, an olive-green utility box \u2014 identical to the others, door already open, the routing card slot empty. They packed the hardware. Left everything else. They knew we were coming. They had time to pull the hardware and leave the furniture."
    },
    {
      "type": "image",
      "url": "/assets/EP38/ep38_panel_06.png",
      "caption": "A rotary telephone mounted to the wall beside the empty utility box. Black Bakelite, institutional, the kind that's been on that wall for fifteen years. It begins to ring. The sound fills the empty room."
    },
    {
      "type": "image",
      "url": "/assets/EP38/ep38_panel_07.png",
      "caption": "Axel lifting the handset. His expression is flat. Outside the window behind him, the open bay, the boat, nothing else."
    },
    {
      "type": "image",
      "url": "/assets/EP38/ep38_panel_08.png",
      "caption": "Axel holding the receiver. His eyes still. Whatever he's hearing, he's processing it the way he processes everything \u2014 as information, not as threat. \"The Fontainebleau. The Forge. Now this. You've been thorough, Mr. D\u00edaz. I want you to know that I consider it a professional courtesy that you've identified our anchor points so efficiently. It saved us the trouble of a full grid audit.\" \"We know where the garage is. We've known for three days.\""
    },
    {
      "type": "image",
      "url": "/assets/EP38/ep38_panel_09.png",
      "caption": "Wide shot. Axel alone in the empty stilt house, the phone to his ear, the open utility box on the wall, the cards on the floor. Through the window, the flat water of the bay. He's already thinking about the boat, the motor, the time it takes to cross five miles of open water. He hangs up first. I'm already moving. **[END OF EPISODE]**"
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
  ]
,
  ep39: [
    {
      "type": "title",
      "content": "INITIALIZING CASSETTE: EPISODE 39 (\"THE FARADAY CAGE\")... // VOLUME 04: THE SURGE"
    },
    {
      "type": "image",
      "url": "/assets/EP39/ep39_panel_01.png",
      "caption": "The center-console running hard back toward Miami, bow up, engine noise implied in the spray. The skyline growing ahead. Axel at the wheel, leaning into it. The motor running at a pitch it wasn't built to sustain. Five miles. The motor burns at full throttle in about forty minutes. I need to make it in twenty. ---"
    },
    {
      "type": "image",
      "url": "/assets/EP39/ep39_panel_02.png",
      "caption": "JP at the workbench, frequency monitor in front of him, needle jumping. His mesh transmitter is live, receiving signals it shouldn't be receiving. Sol beside him, watching the needle. The Mutiny tape reels and routing hardware are on the shelf behind them. \"Someone's pinging our transmitter frequencies. Systematic sweep \u2014 NW corridor, sector by sector.\" **SOL (DIALOGUE):** \"Vanguard.\" \"They have the routing card data from the Stiltsville unit. They're using it to triangulate us.\""
    },
    {
      "type": "image",
      "url": "/assets/EP39/ep39_panel_03.png",
      "caption": "Elio emerging from the rear of the garage bay, already carrying a roll of copper mesh \u2014 the kind used for automotive shielding projects, heavy gauge, on a wooden spool. He sets it on the workbench without being asked. **ELIO (DIALOGUE):** \"I have three rolls. Was for the Cutlass.\" \"That'll do it.\""
    },
    {
      "type": "image",
      "url": "/assets/EP39/ep39_panel_04.png",
      "caption": "JP's hands and Sol's hands working together \u2014 unrolling copper mesh, cutting it with tin snips, wrapping the Mutiny tape reels and the stack of routing cards. The mesh is crude and physical. The wrapped reels look like something salvaged, not something protected. That's correct. JP wraps the archive. Sol cuts the mesh. The frequency monitor needle drops back toward center. ---"
    },
    {
      "type": "image",
      "url": "/assets/EP39/ep39_panel_05.png",
      "caption": "Axel on foot, having left the boat at the marina and come in on the street. He stops half a block from the garage. The block is wrong: a city truck \u2014 Dade County lettering on the door \u2014 parked facing the wrong direction. A man with a clipboard on the corner, not moving, watching the garage building. Across the street, a second truck. The demolition permit on the windshield is visible from here. Not armed men. Clipboard men. Which is how Vanguard works \u2014 they send paper before they send crews, and the paper is the threat. ---"
    },
    {
      "type": "image",
      "url": "/assets/EP39/ep39_panel_06.png",
      "caption": "Axel coming in through the side door. The garage is dim, the roll door down. JP at the frequency monitor \u2014 the needle is calm now, the shielding holding. Sol is at the workbench phone, speaking quietly, her address book open beside it. \"How long before they serve the permit?\" **ELIO (DIALOGUE):** \"Clipboard man's been there forty minutes. They're waiting for a second signature.\" **SOL (DIALOGUE):** \"Give me ten minutes.\""
    },
    {
      "type": "image",
      "url": "/assets/EP39/ep39_panel_07.png",
      "caption": "Sol on the phone, her finger running down a column of handwritten entries in her address book. She's not rushing. She's working her way through a chain of people she knows, each one a step closer to someone specific. Sol has been building her network since before Vanguard existed as a company. She knows who runs what in this city. She knows who at Radio Maria has been waiting for exactly this kind of material."
    },
    {
      "type": "image",
      "url": "/assets/EP39/ep39_panel_08.png",
      "caption": "Through the narrow gap at the bottom of the roll door \u2014 seen from inside the garage, ground level \u2014 the feet of the clipboard man on the sidewalk. Then a sound from his direction: a portable radio crackling. Then his feet turn and walk away. The city truck's engine starts. Through the gap, the truck pulling away from the curb. Radio Maria broadcasts at 1550 AM. The Mutiny tape reels have forty-three hours of recorded calls. Sol's contact runs the first four minutes \u2014 two commissioners and a federal contract number \u2014 live on the air at 3:19 PM. Vanguard's crews are off the block by 3:24. ---"
    },
    {
      "type": "image",
      "url": "/assets/EP39/ep39_panel_09.png",
      "caption": "The four of them. The roll door open now, late afternoon light. The wrapped archive on the shelf. The frequency monitor dark, powered down. Nobody celebrating. Elio with the copper mesh spool in his hands, already thinking about putting it back. Sol closing her address book. The Biscayne Entertainment Band is dark. Four sectors. Four hardware units. Forty-three hours of tape that Vanguard will spend the next month trying to contain. And Sol's diagram from EP34 still on the workbench. The circles and lines. Every underground parcel, every informal economy, every off-book ledger this city runs on. Vanguard wasn't just anchoring a grid. They were mapping the architecture of everything that exists outside their system, so they could own that too. **[END OF EPISODE \u2014 END OF VOLUME 05]**"
    },
    {
      "type": "title",
      "content": "END OF TAPE. EJECT."
    }
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

// EP19 offline — assets pending rewrite
document.querySelector('#btn-play-ep19').addEventListener('click', () => {})































































































































document.querySelector('#btn-play-ep20').addEventListener('click', () => {
  activePages = episodes.ep20;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep20');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep21').addEventListener('click', () => {
  activePages = episodes.ep21;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep21');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep22').addEventListener('click', () => {
  activePages = episodes.ep22;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep22');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep23').addEventListener('click', () => {
  activePages = episodes.ep23;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep23');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep24').addEventListener('click', () => {
  activePages = episodes.ep24;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep24');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep25').addEventListener('click', () => {
  activePages = episodes.ep25;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep25');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep26').addEventListener('click', () => {
  activePages = episodes.ep26;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep26');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep27').addEventListener('click', () => {
  activePages = episodes.ep27;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep27');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep28').addEventListener('click', () => {
  activePages = episodes.ep28;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep28');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep29').addEventListener('click', () => {
  activePages = episodes.ep29;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep29');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep30').addEventListener('click', () => {
  activePages = episodes.ep30;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep30');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep31').addEventListener('click', () => {
  activePages = episodes.ep31;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep31');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep32').addEventListener('click', () => {
  activePages = episodes.ep32;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep32');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep33').addEventListener('click', () => {
  activePages = episodes.ep33;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep33');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep34').addEventListener('click', () => {
  activePages = episodes.ep34;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep34');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep35').addEventListener('click', () => {
  activePages = episodes.ep35;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep35');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep36').addEventListener('click', () => {
  activePages = episodes.ep36;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep36');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep37').addEventListener('click', () => {
  activePages = episodes.ep37;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep37');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep38').addEventListener('click', () => {
  activePages = episodes.ep38;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep38');
  renderPage(0);
  switchView('reader-view')
})

document.querySelector('#btn-play-ep39').addEventListener('click', () => {
  activePages = episodes.ep39;
  currentPage = 0; timer = 1799;
  if(window.audioEngine) window.audioEngine.startEpisode('ep39');
  renderPage(0);
  switchView('reader-view')
})

btnNext.addEventListener('click', () => {
  if (currentPage < activePages.length - 1) {
    currentPage++
    renderPage(currentPage)
    if (audioEngine.isEnabled) { sfxClack.currentTime = 0; sfxClack.play().catch(e => console.log(e)); }
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
    Object.values(this.layers).forEach(a => { if (a) a.volume = 0; });

    if (this.activeEpisode === 'ep7') {
      this.layers.drone.volume = 0.6;
      this.layers.static.volume = 0; // Disabled as per user preference
      this.layers.pulse.volume = 0.3;
    } else if (this.activeEpisode === 'ep9') {
      this.layers.drone.volume = 0.4;
      this.layers.swamp.volume = 0.7;
    } else {
      if (this.layers.base) this.layers.base.volume = 0.8;
    }
  }

  playAll() {
    Object.values(this.layers).forEach(a => {
      if (a) a.play().catch(e => console.log("Audio playback deferred:", e));
    });
  }

  pauseAll() {
    Object.values(this.layers).forEach(a => { if (a) a.pause(); });
  }

  setMute(isMuted) {
    this.isEnabled = !isMuted;
    if (this.isEnabled) this.playAll();
    else this.pauseAll();

    // Save state to local storage if needed, but for now just live
  }

  updateMood(panelIndex, _timerSeconds) {
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
