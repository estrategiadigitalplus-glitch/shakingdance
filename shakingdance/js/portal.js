// ===== SHAKING DANCE — PORTAL JS =====

function goPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  const link = document.querySelector('.nav-link[data-page="' + id + '"]');
  if (page) page.classList.add('active');
  if (link) link.classList.add('active');
  window.scrollTo(0, 0);
}

document.querySelectorAll('.nav-link[data-page]').forEach(el => {
  el.addEventListener('click', function () { goPage(this.dataset.page); });
});

// HOME — Cursos en progreso (primeros 3)
document.getElementById('home-courses').innerHTML = SD.courses
  .filter(c => c.pct > 0)
  .slice(0, 3)
  .map(c => SD.makeCourseCard(c, "goPage('cursos')"))
  .join('');

// HOME — Continuar viendo
document.getElementById('cw-list').innerHTML = [
  { title: 'Salsa en pareja — Salsa Básico', sub: 'Lección 9 · 18 min · sin empezar', color: '#0d1a14', icon: 'ti-music', ic: '#1D9E75' },
  { title: 'Cuerpo a cuerpo — Bachata Básico', sub: 'Lección 5 · 16 min · 60% visto', color: '#1a0d18', icon: 'ti-heart', ic: '#7F77DD' },
].map(v => `
  <div class="cw-item">
    <div class="cw-thumb" style="background:${v.color};border:0.5px solid rgba(255,255,255,.06)">
      <i class="ti ${v.icon}" style="color:${v.ic};font-size:18px"></i>
    </div>
    <div class="cw-info">
      <div class="cw-title">${v.title}</div>
      <div class="cw-sub">${v.sub}</div>
    </div>
    <button class="play-btn"><i class="ti ti-player-play"></i>Ver</button>
  </div>`).join('');

// CURSOS — Catálogo con lecciones
function renderCursos(cat) {
  const filtered = cat === 'todos' ? SD.courses : SD.courses.filter(c => c.cat === cat);
  document.getElementById('curso-content').innerHTML = filtered.map(c => `
    <div style="margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div style="width:10px;height:10px;border-radius:50%;background:${c.color};flex-shrink:0"></div>
        <span style="font-size:15px;font-weight:600;color:var(--text)">${c.name}</span>
        <span style="font-size:12px;color:var(--text2)">${c.level} · ${c.lessons} lecciones</span>
        ${c.pct > 0 ? `<span style="margin-left:auto;font-size:12px;font-weight:600;color:${c.color}">${c.pct === 100 ? '✓ Completado' : c.pct + '% avance'}</span>` : ''}
      </div>
      <div class="lesson-list">
        ${c.lessons_list.map((l, i) => SD.makeLessonItem(l, i)).join('')}
      </div>
    </div>`).join('');
}
renderCursos('todos');

document.getElementById('curso-filters').addEventListener('click', function (e) {
  const p = e.target.closest('.fpill');
  if (!p) return;
  this.querySelectorAll('.fpill').forEach(x => x.classList.remove('active'));
  p.classList.add('active');
  renderCursos(p.dataset.cat);
});

// BIBLIOTECA — todas las lecciones como lista
function renderBib(cat) {
  const filtered = cat === 'todos' ? SD.courses : SD.courses.filter(c => c.cat === cat);
  const allLessons = [];
  filtered.forEach(c => {
    c.lessons_list.forEach((l, i) => {
      allLessons.push({ ...l, course: c.name, color: c.color, icon: c.icon, num: i + 1 });
    });
  });
  document.getElementById('bib-list').innerHTML = allLessons.map(l => `
    <div class="lesson-item${l.done ? ' lesson-done' : ''}" style="margin-bottom:6px">
      <div class="lesson-num" style="background:${l.color}18;color:${l.color}">
        ${l.done ? '<i class="ti ti-check" style="font-size:12px"></i>' : l.num}
      </div>
      <div class="lesson-info">
        <div class="lesson-title">${l.t}</div>
        <div class="lesson-meta">
          <i class="ti ti-layout-grid"></i>${l.course}
          <i class="ti ti-clock"></i>${l.d}
        </div>
      </div>
      ${l.done
        ? '<i class="ti ti-check" style="color:var(--teal);font-size:16px"></i>'
        : '<button class="play-btn"><i class="ti ti-player-play"></i>Ver</button>'}
    </div>`).join('');
}
renderBib('todos');

document.getElementById('bib-filters').addEventListener('click', function (e) {
  const p = e.target.closest('.fpill');
  if (!p) return;
  this.querySelectorAll('.fpill').forEach(x => x.classList.remove('active'));
  p.classList.add('active');
  renderBib(p.dataset.cat);
});

// PROGRESO
document.getElementById('prog-list').innerHTML = SD.courses
  .filter(c => c.pct > 0)
  .map(c => `
    <div class="prog-section">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
        <div style="width:36px;height:36px;border-radius:9px;background:${c.color}18;display:flex;align-items:center;justify-content:center;color:${c.color};font-size:18px;flex-shrink:0">
          <i class="ti ${c.icon}"></i>
        </div>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:600;color:var(--text)">${c.name} — ${c.level}</div>
          <div style="font-size:12px;color:var(--text2);margin-top:2px">${c.lessons_list.filter(l => l.done).length} de ${c.lessons} lecciones completadas</div>
        </div>
        <div style="font-size:20px;font-weight:700;color:${c.color}">${c.pct}%</div>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${c.pct}%;background:${c.color}"></div></div>
    </div>`).join('');
