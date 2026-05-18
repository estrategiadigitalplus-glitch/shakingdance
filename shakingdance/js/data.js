// ===== SHAKING DANCE — DATOS COMPARTIDOS =====

const SD = {

  courses: [
    {
      id: 'salsa', name: 'Salsa', cat: 'salsa', level: 'Básico',
      lessons: 10, color: '#1D9E75', bg: 'ct-salsa', icon: 'ti-music',
      badge: 'En progreso', badgeCls: 'cb-teal', pct: 80,
      ytUrl: 'https://youtube.com',
      lessons_list: [
        { t: 'Introducción a la Salsa', d: '6 min', done: true },
        { t: 'Paso básico', d: '8 min', done: true },
        { t: 'Tiempo y ritmo', d: '10 min', done: true },
        { t: 'Giro básico', d: '12 min', done: true },
        { t: 'Movimiento de caderas', d: '11 min', done: true },
        { t: 'Combinación 1', d: '15 min', done: true },
        { t: 'Vuelta doble', d: '14 min', done: true },
        { t: 'Combinación 2', d: '16 min', done: true },
        { t: 'Salsa en pareja', d: '18 min', done: false },
        { t: 'Coreografía final', d: '22 min', done: false }
      ]
    },
    {
      id: 'bachata', name: 'Bachata', cat: 'bachata', level: 'Básico',
      lessons: 10, color: '#7F77DD', bg: 'ct-bachata', icon: 'ti-heart',
      badge: 'En progreso', badgeCls: 'cb-purple', pct: 40,
      ytUrl: 'https://youtube.com',
      lessons_list: [
        { t: 'Historia de la Bachata', d: '5 min', done: true },
        { t: 'Paso básico bachata', d: '9 min', done: true },
        { t: 'Movimiento de cadera', d: '11 min', done: true },
        { t: 'Giro sencillo', d: '13 min', done: true },
        { t: 'Cuerpo a cuerpo', d: '16 min', done: false },
        { t: 'Dips básicos', d: '14 min', done: false },
        { t: 'Combinación 1', d: '18 min', done: false },
        { t: 'Estilo sensual', d: '15 min', done: false },
        { t: 'Combinación 2', d: '20 min', done: false },
        { t: 'Coreografía final', d: '25 min', done: false }
      ]
    },
    {
      id: 'hiphop', name: 'Hip Hop', cat: 'hiphop', level: 'Básico',
      lessons: 10, color: '#1D9E75', bg: 'ct-hiphop', icon: 'ti-trending-up',
      badge: 'Completado', badgeCls: 'cb-teal', pct: 100,
      ytUrl: 'https://youtube.com',
      lessons_list: [
        { t: 'Bounce básico', d: '7 min', done: true },
        { t: 'Paso caballo', d: '9 min', done: true },
        { t: 'Groove', d: '11 min', done: true },
        { t: 'The Running Man', d: '12 min', done: true },
        { t: 'Waving', d: '10 min', done: true },
        { t: 'Popping intro', d: '14 min', done: true },
        { t: 'Locking básico', d: '13 min', done: true },
        { t: 'Combinación 1', d: '16 min', done: true },
        { t: 'Freestyle intro', d: '14 min', done: true },
        { t: 'Coreografía final', d: '20 min', done: true }
      ]
    },
    {
      id: 'reggaeton', name: 'Reggaeton', cat: 'reggaeton', level: 'Básico',
      lessons: 8, color: '#EF9F27', bg: 'ct-reggaeton', icon: 'ti-flame',
      badge: 'Nuevo', badgeCls: '', pct: 0,
      ytUrl: 'https://youtube.com',
      lessons_list: [
        { t: 'Paso dembow', d: '8 min', done: false },
        { t: 'Perreo básico', d: '10 min', done: false },
        { t: 'Twerk intro', d: '12 min', done: false },
        { t: 'Combinación reggaeton', d: '13 min', done: false },
        { t: 'Paso del caballo', d: '9 min', done: false },
        { t: 'Cuadrante', d: '11 min', done: false },
        { t: 'Combinación 2', d: '15 min', done: false },
        { t: 'Coreografía final', d: '20 min', done: false }
      ]
    },
    {
      id: 'cumbia', name: 'Cumbia', cat: 'cumbia', level: 'Básico',
      lessons: 8, color: '#378ADD', bg: 'ct-cumbia', icon: 'ti-music',
      badge: 'Nuevo', badgeCls: '', pct: 0,
      ytUrl: 'https://youtube.com',
      lessons_list: [
        { t: 'Paso cumbia', d: '9 min', done: false },
        { t: 'Ritmo y tiempo', d: '11 min', done: false },
        { t: 'Giros básicos', d: '12 min', done: false },
        { t: 'Combinación 1', d: '14 min', done: false }
      ]
    }
  ],

  members: [
    { name: 'María González', ini: 'MG', plan: 'Plan Completo', status: 'activo', courses: 3, prog: 68, exp: '30 jun' },
    { name: 'Luis Pérez', ini: 'LP', plan: 'Plan Básico', status: 'activo', courses: 1, prog: 40, exp: '15 jun' },
    { name: 'Ana Torres', ini: 'AT', plan: 'Plan Completo', status: 'activo', courses: 2, prog: 100, exp: '20 jul' },
    { name: 'Carlos Ruiz', ini: 'CR', plan: 'Plan Básico', status: 'trial', courses: 1, prog: 20, exp: '5 jun' },
    { name: 'Sofía Méndez', ini: 'SM', plan: 'Plan Básico', status: 'expirado', courses: 1, prog: 15, exp: '1 jun' },
    { name: 'Pedro Vega', ini: 'PV', plan: 'Plan Completo', status: 'activo', courses: 3, prog: 55, exp: '28 jun' },
    { name: 'Daniela Cruz', ini: 'DC', plan: 'Plan Básico', status: 'activo', courses: 2, prog: 72, exp: '10 jul' },
    { name: 'Roberto Lima', ini: 'RL', plan: 'Plan Completo', status: 'trial', courses: 1, prog: 10, exp: '18 jun' },
  ],

  statusBadge: { activo: 'badge-teal', trial: 'badge-amber', expirado: 'badge bg-red' },
  statusLabel: { activo: 'Activo', trial: 'Trial', expirado: 'Expirado' },

  // HELPERS
  makeCourseCard(c, onclick) {
    return `
      <div class="course-card" onclick="${onclick || `window.location.href='biblioteca.html'`}">
        <div class="course-thumb ${c.bg}">
          <i class="ti ${c.icon} course-icon"></i>
          ${c.badgeCls ? `<div class="course-badge ${c.badgeCls}">${c.badge}</div>` : ''}
          <div class="course-level">${c.pct === 100 ? '✓ Listo' : c.pct + '%'}</div>
        </div>
        <div class="course-info">
          <div class="course-name">${c.name}</div>
          <div class="course-meta"><i class="ti ti-video"></i>${c.level} · ${c.lessons} lecciones</div>
          <div class="prog-bar"><div class="prog-fill" style="width:${c.pct}%;background:${c.color}"></div></div>
          <div class="prog-label"><span>${c.pct}%</span><span>${c.pct === 100 ? 'Completo' : 'En progreso'}</span></div>
        </div>
      </div>`;
  },

  makeLessonItem(l, i) {
    return `
      <div class="lesson-item${l.done ? ' lesson-done' : ''}">
        <div class="lesson-num">
          ${l.done ? '<i class="ti ti-check" style="font-size:12px"></i>' : i + 1}
        </div>
        <div class="lesson-info">
          <div class="lesson-title">${l.t}</div>
          <div class="lesson-meta"><i class="ti ti-clock"></i>${l.d}</div>
        </div>
        ${l.done
          ? '<i class="ti ti-check" style="color:var(--teal);font-size:16px"></i>'
          : '<button class="play-btn"><i class="ti ti-player-play"></i>Ver</button>'}
      </div>`;
  }
};
