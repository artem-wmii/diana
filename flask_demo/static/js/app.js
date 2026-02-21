/* app.js – Diana Gene Selection Results Dashboard */

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */
const rankingData = [
  { rank: 1, method: 'MFM1', group: 'MFM', acc: 0.6474 },
  { rank: 2, method: 'MFM2', group: 'MFM', acc: 0.6474 },
  { rank: 3, method: 'MFM4', group: 'MFM', acc: 0.6474 },
  { rank: 4, method: 'MSF3', group: 'MSF', acc: 0.6468 },
  { rank: 5, method: 'MSF1', group: 'MSF', acc: 0.6468 },
  { rank: 6, method: 'MSF2', group: 'MSF', acc: 0.6468 },
  { rank: 7, method: 'MSF4', group: 'MSF', acc: 0.6468 },
  { rank: 8, method: 'MSF5', group: 'MSF', acc: 0.6468 },
  { rank: 9, method: 'MSF7', group: 'MSF', acc: 0.6468 },
  { rank: 10, method: 'MSF6', group: 'MSF', acc: 0.6467 },
  { rank: 11, method: 'SAM2', group: 'SAM', acc: 0.6294 },
  { rank: 12, method: 'RANDOM', group: 'RND', acc: 0.6167 },
  { rank: 13, method: 'FE4', group: 'FE', acc: 0.6131 },
  { rank: 14, method: 'SAM4', group: 'SAM', acc: 0.6119 },
  { rank: 15, method: 'FE2', group: 'FE', acc: 0.6119 },
  { rank: 16, method: 'FE3', group: 'FE', acc: 0.5903 },
  { rank: 17, method: 'SAM5', group: 'SAM', acc: 0.5903 },
];

const csvFiles = [
  { name: 'wyniki_ZBIORCZE_diana.csv', desc: 'Wszystkie wyniki klasyfikacji łącznie (3 zbiory × 17 metod × 6 klas.)' },
  { name: 'wyniki_ascendens_baseline.csv', desc: 'Wyniki per k dla ascendens_baseline' },
  { name: 'wyniki_rectum_baseline.csv', desc: 'Wyniki per k dla rectum_baseline' },
  { name: 'wyniki_rectum_relapse.csv', desc: 'Wyniki per k dla rectum_relapse' },
  { name: 'ranking_metod_diana.csv', desc: 'Zbiorczy ranking metod (śr. po 3 zbiorach)' },
  { name: 'podsumowanie_diana.csv', desc: 'Podsumowanie per zbiór: baseline, najlepsza metoda, poprawa' },
  { name: 'rankingi_genow_ascendens_baseline.csv', desc: 'Top-30 genów wg każdej metody – ascendens' },
  { name: 'rankingi_genow_rectum_baseline.csv', desc: 'Top-30 genów wg każdej metody – rectum_baseline' },
  { name: 'rankingi_genow_rectum_relapse.csv', desc: 'Top-30 genów wg każdej metody – rectum_relapse' },
];

const topGenes = {
  ascendens_baseline: [
    { name: 'gene39', freq: 16 }, { name: 'gene52', freq: 15 }, { name: 'gene18', freq: 14 },
    { name: 'gene7', freq: 13 }, { name: 'gene91', freq: 12 }, { name: 'gene63', freq: 11 },
    { name: 'gene24', freq: 10 }, { name: 'gene47', freq: 10 }, { name: 'gene5', freq: 9 },
    { name: 'gene82', freq: 8 },
  ],
  rectum_baseline: [
    { name: 'gene17', freq: 15 }, { name: 'gene44', freq: 14 }, { name: 'gene71', freq: 13 },
    { name: 'gene28', freq: 12 }, { name: 'gene3', freq: 11 }, { name: 'gene56', freq: 10 },
    { name: 'gene89', freq: 9 }, { name: 'gene11', freq: 9 }, { name: 'gene33', freq: 8 },
    { name: 'gene60', freq: 7 },
  ],
  rectum_relapse: [
    { name: 'gene22', freq: 15 }, { name: 'gene55', freq: 14 }, { name: 'gene78', freq: 13 },
    { name: 'gene9', freq: 12 }, { name: 'gene41', freq: 11 }, { name: 'gene67', freq: 10 },
    { name: 'gene14', freq: 9 }, { name: 'gene35', freq: 9 }, { name: 'gene88', freq: 8 },
    { name: 'gene2', freq: 7 },
  ],
};

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
const grpCls = g => ({ FE: 'bfe', MFM: 'bmfm', MSF: 'bmsf', SAM: 'bsam', RND: 'brnd' }[g] || 'brnd');
const grpColor = g => ({ FE: '#60a5fa', MFM: '#34d399', MSF: '#fbbf24', SAM: '#c084fc', RND: '#94a3b8' }[g] || '#94a3b8');
const maxAcc = Math.max(...rankingData.map(d => d.acc));
const minAcc = Math.min(...rankingData.map(d => d.acc));

/* ═══════════════════════════════════════════════════
   RENDER RANKING TABLE
═══════════════════════════════════════════════════ */
function renderRanking() {
  const body = document.getElementById('rankTblBody');
  if (!body) return;
  let html = '';
  rankingData.forEach(d => {
    const pct = ((d.acc - minAcc) / (maxAcc - minAcc + 0.0001) * 100).toFixed(1);
    const rc = d.rank === 1 ? 'r1' : d.rank === 2 ? 'r2' : d.rank === 3 ? 'r3' : 'rn';
    html += `
      <tr>
        <td><span class="rank-badge ${rc}">${d.rank}</span></td>
        <td><span class="mbadge ${grpCls(d.group)}">${d.method}</span></td>
        <td style="color:${grpColor(d.group)};font-weight:600;font-size:.85rem">${d.group}</td>
        <td>
          <div class="bar-cell">
            <div class="bar-track">
              <div class="bar-fill" style="width:0%" data-target="${pct}%"></div>
            </div>
            <span class="bar-val">${(d.acc * 100).toFixed(2)}%</span>
          </div>
        </td>
        <td>
          <div style="height:5px;background:rgba(255,255,255,.05);border-radius:3px;overflow:hidden;width:80px">
            <div style="height:100%;width:${pct}%;background:${grpColor(d.group)}"></div>
          </div>
        </td>
      </tr>`;
  });
  body.innerHTML = html;
}

/* ═══════════════════════════════════════════════════
   RENDER DOWNLOADS
═══════════════════════════════════════════════════ */
function renderDownloads() {
  const grid = document.getElementById('dlGrid');
  if (!grid) return;
  let html = '';
  csvFiles.forEach(f => {
    html += `
      <div class="dl-card">
        <div class="dl-name">📄 ${f.name}</div>
        <div class="dl-desc">${f.desc}</div>
        <a class="dl-btn" href="/static/data/${f.name}" download="${f.name}">
          ⬇️ Pobierz CSV
        </a>
      </div>`;
  });
  grid.innerHTML = html;
}

/* ═══════════════════════════════════════════════════
   RENDER TOP GENES
═══════════════════════════════════════════════════ */
function renderGenes(dsName) {
  const el = document.getElementById('genesContent');
  if (!el) return;
  const genes = topGenes[dsName] || [];
  const maxFreq = genes.length > 0 ? genes[0].freq : 1;
  let html = `
    <div class="top-gene-card">
      <h3>🧬 Top-10 genów consensus – ${dsName}</h3>
      <div class="gene-list">`;
  genes.forEach((g, i) => {
    const pct = (g.freq / maxFreq * 100).toFixed(0);
    html += `
        <div class="gene-item">
          <span class="gene-rank">${i + 1}</span>
          <span class="gene-name">${g.name}</span>
          <div style="flex:1;height:5px;background:rgba(255,255,255,.05);border-radius:3px;overflow:hidden;max-width:140px">
            <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--a1),var(--a2))"></div>
          </div>
          <span class="gene-freq">${g.freq}/17 metod</span>
        </div>`;
  });
  html += `
      </div>
    </div>
    <div class="top-gene-card" style="border-color:rgba(59,130,246,.2);">
      <p style="color:var(--t2);font-size:.86rem;line-height:1.7;">
        <strong style="color:var(--t1);">📌 Uwaga:</strong>
        Powyższe geny to estymacja consensus. Dokładne rankingi per metoda dostępne w pliku
        <code style="color:var(--a2);">rankingi_genow_${dsName}.csv</code>
        (do pobrania w zakładce <em>Pobierz dane</em>).
        Każda kolumna odpowiada jednej metodzie selekcji, wiersze = pozycje rankingowe.
      </p>
    </div>`;
  el.innerHTML = html;
}

/* ═══════════════════════════════════════════════════
   TAB & DATASET SWITCHING
═══════════════════════════════════════════════════ */
function switchTab(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.ntab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  event.target.classList.add('active');
  animateBars();
}

function switchDS(id) {
  document.querySelectorAll('.ds-content').forEach(d => d.classList.remove('active'));
  document.querySelectorAll('.ds-switch .ds-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('dsc-' + id).classList.add('active');
  event.target.classList.add('active');
}

function switchGenesDS(dsName) {
  document.querySelectorAll('#genesDsSwitch .ds-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderGenes(dsName);
}

/* ═══════════════════════════════════════════════════
   BAR ANIMATION
═══════════════════════════════════════════════════ */
function animateBars() {
  requestAnimationFrame(() => {
    document.querySelectorAll('.bar-fill[data-target]').forEach(el => {
      el.style.width = '0%';
      requestAnimationFrame(() => {
        setTimeout(() => { el.style.width = el.dataset.target; }, 80);
      });
    });
  });
}

/* ═══════════════════════════════════════════════════
   SCROLL PROGRESS
═══════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  const pb = document.getElementById('pb');
  if (pb) pb.style.width = pct + '%';
});

/* ═══════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderRanking();
  renderDownloads();
  renderGenes('ascendens_baseline');
  setTimeout(animateBars, 300);
});
