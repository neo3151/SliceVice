import './style.css'

const app = document.querySelector('#app')
const EPISODE_DATA = {}
const SPECIAL_DATA = {}

const state = {
  view: 'home',
  currentEp: null,
  currentSpecial: null,
  episodes: [],
  specials: []
}

function render() {
  app.innerHTML = ''
  if (state.view === 'home') renderHome()
}

function renderHome() {
  const el = document.createElement('div')
  el.className = 'home-container'
  
  el.innerHTML = `
    <h1 class="home-title">SLICE VICE</h1>
    <p class="home-subtitle">30 MINUTES OR LESS... OR ELSE</p>
    <p style="color: #ccc; margin-top:2rem; font-size:1.2rem; line-height: 1.6;">
      Delivering pizza in South Florida means dealing with swamp cryptids, category 5 hurricanes, <br>
      and Miami-Vice-level cartels out of a rusted 1999 Honda Civic.
    </p>

    <div class="promo-banner">
      <h2 style="color:var(--accent-neon); font-family:'Bangers'; font-size: 2.5rem; margin:0; letter-spacing:2px;">WORKSPACE DEPLOYED</h2>
      <p style="color:#00ffff; font-size:1.2rem; font-weight:bold;">The Cinematic Comic Engine is ready for Phase 1.</p>
    </div>
  `
  app.appendChild(el)
}

render()
