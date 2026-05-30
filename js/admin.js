// ===== SHAKING DANCE — ADMIN JS =====

// Global state variables
let cursosDB = [];
let leccionesPorCurso = {};
let _editCursoId = null;
let todosVideos = [];

const panelTitles = {
  dashboard: 'Dashboard', alumnos: 'Gestión de alumnos',
  videos: 'Biblioteca de videos', cursos: 'Cursos',
  metricas: 'Métricas y análisis', config: 'Configuración'
};
const topBtnLabels = {
  dashboard: 'Nuevo video', alumnos: 'Nuevo alumno',
  videos: 'Nueva lección', cursos: 'Nuevo curso',
  metricas: 'Exportar', config: 'Guardar'
};

function goPanel(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-link[data-panel]').forEach(l => l.classList.remove('active'));
  const panel = document.getElementById('panel-' + id);
  const link = document.querySelector('.sidebar-link[data-panel="' + id + '"]');
  if (panel) panel.classList.add('active');
  if (link) link.classList.add('active');
  document.getElementById('panel-title').textContent = panelTitles[id] || id;
  document.getElementById('top-btn').innerHTML = '<i class="ti ti-plus"></i>' + (topBtnLabels[id] || 'Nuevo');
  // Load data for each panel
  if (id === 'cursos') cargarCursos();
  if (id === 'alumnos') cargarAlumnos();
  if (id === 'videos') cargarVideos();
}

document.querySelectorAll('.sidebar-link[data-panel]').forEach(el => {
  el.addEventListener('click', function () { goPanel(this.dataset.panel); });
});

// Load all data on start
document.addEventListener('DOMContentLoaded', async function() {
  try { await cargarDashboard(); } catch(e) { console.error('dashboard error:', e); }
  try { await cargarCursos(); } catch(e) { console.error('cursos error:', e); }
  try { await cargarAlumnos(); } catch(e) { console.error('alumnos error:', e); renderAlumnos('todos'); }
});

async function cargarDashboard() {
  try {
    // Alumnos activos
    const alumnos = await DB.getAlumnos();
    const activos = alumnos.filter(a => a.status === 'activo').length;
    const total = alumnos.length;

    // Cursos y lecciones
    const cursos = await DB.getCursos();
    let totalLecciones = 0;
    for (const c of cursos) {
      const lecs = await DB.getLecciones(c.id);
      totalLecciones += lecs.length;
    }

    // Update dashboard stats
    const stats = document.querySelectorAll('.stat-val');
    if (stats[0]) stats[0].textContent = activos;
    if (stats[1]) stats[1].textContent = totalLecciones;
    if (stats[2]) stats[2].textContent = total;

    // Update activity table - recent alumnos
    const recentAlumnos = [...alumnos].slice(0, 5);
    const tbody = document.getElementById('activity-body');
    if (tbody && recentAlumnos.length) {
      tbody.innerHTML = recentAlumnos.map(a => {
        const ini = (a.nombre[0] + (a.nombre.split(' ')[1]?.[0] || 'X')).toUpperCase();
        const fecha = new Date(a.created_at);
        const hace = Math.floor((Date.now() - fecha) / 60000);
        const haceTxt = hace < 60 ? hace + ' min' : Math.floor(hace/60) + 'h';
        return `<tr>
          <td><div style="display:flex;align-items:center;gap:8px">
            <div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--teal),var(--purple));display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:600">${ini}</div>
            ${a.nombre}
          </div></td>
          <td>Registro</td>
          <td style="color:var(--text2)">${a.plan}</td>
          <td style="color:var(--text2)">${haceTxt}</td>
        </tr>`;
      }).join('');
    }

    // Dash sched - show real courses
    const dashSched = document.getElementById('dash-sched');
    if (dashSched && cursos.length) {
      dashSched.innerHTML = cursos.slice(0,3).map(c => `
        <div class="sched-item">
          <div class="sched-color" style="background:${c.color || 'var(--teal)'}"></div>
          <div style="flex:1">
            <div class="sched-name">${c.nombre} — ${c.nivel}</div>
            <div class="sched-meta"><i class="ti ti-users"></i>${activos} alumnos activos</div>
          </div>
        </div>`).join('');
    }

    // Dash prog - show real courses
    const dashProg = document.getElementById('dash-prog');
    if (dashProg && cursos.length) {
      dashProg.innerHTML = cursos.map(c => `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <span style="font-size:13px;color:var(--text);min-width:80px">${c.nombre}</span>
          <div class="prog-bar" style="flex:1"><div class="prog-fill" style="width:0%;background:${c.color || 'var(--teal)'}"></div></div>
          <span style="font-size:12px;color:var(--text2);min-width:32px;text-align:right">—</span>
        </div>`).join('');
    }

    // New bars - alumnos por día (últimos 7 días)
    const dias = ['L','M','X','J','V','S','D'];
    const hoy = new Date().getDay();
    const conteos = new Array(7).fill(0);
    alumnos.forEach(a => {
      const d = new Date(a.created_at);
      const diff = Math.floor((Date.now() - d) / 86400000);
      if (diff < 7) conteos[6 - diff]++;
    });
    const maxV = Math.max(...conteos, 1);
    const newBars = document.getElementById('new-bars');
    const newLbls = document.getElementById('new-lbls');
    if (newBars) newBars.innerHTML = conteos.map(v =>
      `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end">
        <div style="width:100%;height:${Math.round(v/maxV*72)}px;background:var(--teal);opacity:.7;border-radius:3px 3px 0 0;min-height:4px"></div>
      </div>`).join('');
    if (newLbls) newLbls.innerHTML = dias.map(d =>
      `<div style="flex:1;text-align:center;font-size:10px;color:var(--text2)">${d}</div>`).join('');

  } catch(e) {
    console.error('cargarDashboard error:', e);
  }
}

// DASHBOARD — progreso por estilo
// Dashboard data loaded from Supabase in cargarDashboard()
document.getElementById('activity-body').innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text2);padding:20px">Cargando actividad...</td></tr>';

// ALUMNOS
function renderAlumnos(filter) {
  const filtered = filter === 'todos' ? SD.members : SD.members.filter(m => m.status === filter);
  const badgeClass = { activo: 'badge-teal', trial: 'badge-amber', expirado: '' };
  const badgeStyle = { activo: '', trial: '', expirado: 'background:rgba(226,75,74,.12);color:#E24B4A;border:0.5px solid rgba(226,75,74,.25)' };
  document.getElementById('alu-body').innerHTML = filtered.map((m, i) => {
    const realIdx = SD.members.indexOf(m);
    return `
    <tr style="cursor:pointer" onclick="abrirModalEditar(${realIdx})" title="Click para editar">
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--teal),var(--purple));display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:600;flex-shrink:0">${m.ini}</div>
          ${m.name}
        </div>
      </td>
      <td>${m.plan}</td>
      <td><span class="badge ${badgeClass[m.status]}" style="${badgeStyle[m.status]}">${SD.statusLabel[m.status]}</span></td>
      <td style="text-align:center">${m.courses}</td>
      <td style="min-width:90px">
        <div style="display:flex;align-items:center;gap:8px">
          <div class="prog-bar" style="flex:1"><div class="prog-fill" style="width:${m.prog}%;background:var(--teal)"></div></div>
          <span style="font-size:12px;color:var(--text2)">${m.prog}%</span>
        </div>
      </td>
      <td style="color:${m.status === 'expirado' ? '#E24B4A' : 'var(--text2)'}">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
          <span>${m.exp}</span>
          <button onclick="event.stopPropagation();abrirModalEditar(${realIdx})" style="padding:3px 8px;border-radius:6px;border:0.5px solid rgba(255,255,255,.1);background:transparent;color:rgba(255,255,255,.4);font-size:11px;cursor:pointer;display:flex;align-items:center;gap:3px" title="Editar"><i class="ti ti-edit"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');
}
// Load alumnos from Supabase
async function cargarAlumnos() {
  try {
    const data = await DB.getAlumnos();
    if (data && data.length > 0) {
      // Merge with SD.members format
      SD.members = data.map(a => ({
        id: a.id,
        name: a.nombre,
        ini: (a.nombre[0] + (a.nombre.split(' ')[1]?.[0] || a.nombre[1] || 'X')).toUpperCase(),
        plan: a.plan,
        status: a.status,
        courses: 0,
        prog: 0,
        exp: a.fecha_vencimiento || '—',
        email: a.email
      }));
    }
  } catch(e) {
    console.log('Usando datos locales', e);
  }
  renderAlumnos('todos');
  const total = document.getElementById('total-alumnos');
  if (total) total.textContent = SD.members.length + ' alumnos totales';
}
// cargarAlumnos called in DOMContentLoaded

document.getElementById('alu-filters')?.addEventListener('click', function (e) {
  const p = e.target.closest('.fpill');
  if (!p) return;
  this.querySelectorAll('.fpill').forEach(x => x.classList.remove('active'));
  p.classList.add('active');
  renderAlumnos(p.dataset.af);
});

// VIDEOS
const adminVideos = SD.courses.flatMap(c =>
  c.lessons_list.slice(0, 3).map((l, i) => ({
    title: l.t, course: c.name, lesson: `L.${i + 1}`,
    dur: l.d, color: c.color, icon: c.icon, cat: c.cat
  }))
);

function renderVids(filter) {
  const filtered = filter === 'todos' ? adminVideos : adminVideos.filter(v => v.cat === filter);
  document.getElementById('vid-list').innerHTML = filtered.map(v => `
    <div style="display:flex;align-items:center;gap:10px;padding:9px 13px;background:var(--dark2);border:0.5px solid var(--border);border-radius:var(--radius-md);margin-bottom:7px;transition:border-color .12s" onmouseover="this.style.borderColor='var(--teal)'" onmouseout="this.style.borderColor='var(--border)'">
      <div style="width:62px;height:38px;border-radius:7px;background:${v.color}22;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:0.5px solid ${v.color}33">
        <i class="ti ${v.icon}" style="color:${v.color};font-size:17px"></i>
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px">${v.title}</div>
        <div style="font-size:11px;color:var(--text2);display:flex;align-items:center;gap:7px">
          <i class="ti ti-layout-grid"></i>${v.course} · ${v.lesson}
          <i class="ti ti-clock"></i>${v.dur}
        </div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-sm" onclick="window.location.href='leccion.html'"><i class="ti ti-edit"></i>Editar</button>
        <button class="btn btn-sm" style="color:#E24B4A;border-color:rgba(226,75,74,.3)"><i class="ti ti-trash"></i></button>
      </div>
    </div>`).join('');
}
renderVids('todos');

document.getElementById('vid-filters')?.addEventListener('click', function (e) {
  const p = e.target.closest('.fpill');
  if (!p) return;
  this.querySelectorAll('.fpill').forEach(x => x.classList.remove('active'));
  p.classList.add('active');
  renderVids(p.dataset.vf);
});

// CURSOS

// ===== CURSOS CON SUPABASE =====

async function cargarCursos() {
  try {
    const data = await DB.getCursos();
    if (data && Array.isArray(data) && data.length > 0) {
      cursosDB = data;
    }
  } catch(e) {
    console.log('Supabase no disponible, usando datos locales');
    cursosDB = [];
  }
  await renderCursos();
}

// Lecciones por curso cargadas de Supabase

async function renderCursos() {
  try {
  // Load courses from Supabase or fallback to SD.courses
  const cursos = cursosDB.length > 0 ? cursosDB.map((c, ci) => ({
    id: c.id,
    ci: ci,
    name: c.nombre,
    level: c.nivel || 'Básico',
    color: c.color || '#1D9E75',
    icon: c.icono || 'ti-music',
    cat: c.estilo
  })) : SD.courses.map((c, ci) => ({
    id: c.id || ci,
    ci: ci,
    name: c.name,
    level: c.level,
    color: c.color,
    icon: c.icon,
    cat: c.cat
  }));

  // Load lessons for each course from Supabase
  // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  for (const c of cursos) {
    const isValidUUID = c.id && uuidRegex.test(c.id);
    if (isValidUUID) {
      try {
        const lecciones = await DB.getLecciones(c.id);
        leccionesPorCurso[c.id] = lecciones || [];
      } catch(e) {
        leccionesPorCurso[c.id] = [];
      }
    } else {
      // Not a real UUID — show empty (real lessons come from Supabase)
      leccionesPorCurso[c.id] = [];
    }
  }

  document.getElementById('cursos-list').innerHTML = cursos.map((c, ci) => {
    const lecciones = leccionesPorCurso[c.id] || [];
    const totalMin = lecciones.reduce((a, l) => {
      const dur = (l.duracion || l.d || '0').toString().replace(/[^0-9]/g, '');
      return a + (parseInt(dur) || 0);
    }, 0);

    const lessonRows = lecciones.map((l, li) => `
      <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:0.5px solid var(--border);transition:background .1s" onmouseover="this.style.background='rgba(255,255,255,.02)'" onmouseout="this.style.background='transparent'">
        <div style="width:24px;height:24px;border-radius:50%;background:rgba(127,119,221,.1);color:var(--purple);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0">
          ${l.numero || li + 1}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${l.titulo || l.t || 'Sin título'}</div>
          <div style="font-size:11px;color:var(--text2);margin-top:1px"><i class="ti ti-clock" style="font-size:12px"></i> ${l.duracion || l.d || '—'} ${l.publicado ? '<span style=\"color:var(--teal);margin-left:6px\">● Publicado</span>' : '<span style=\"color:var(--text3);margin-left:6px\">○ Borrador</span>'}</div>
        </div>
        <div style="display:flex;gap:5px">
          <button class="btn btn-sm" onclick="window.location.href='leccion.html?id=${l.id}&course=${ci}&title=${encodeURIComponent(l.titulo||l.t||'')}' "><i class="ti ti-edit"></i>Editar</button>
          <button class="btn btn-sm" style="color:#E24B4A;border-color:rgba(226,75,74,.25)" onclick="eliminarLeccionDB('${l.id}','${c.id}',${ci})"><i class="ti ti-trash"></i></button>
        </div>
      </div>`).join('');

    return `
    <div class="card" style="margin-bottom:14px;padding:0;overflow:hidden">
      <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid var(--border);background:var(--dark3)">
        <div style="width:36px;height:36px;border-radius:9px;background:${c.color}18;display:flex;align-items:center;justify-content:center;color:${c.color};font-size:19px;flex-shrink:0"><i class="ti ${c.icon}"></i></div>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:600;color:var(--text)">${c.name} — ${c.level}</div>
          <div style="font-size:12px;color:var(--text2);margin-top:1px">${lecciones.length} lecciones · ${totalMin} min en total</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm" onclick="abrirModalCurso(${JSON.stringify({id:c.id,name:c.name,cat:c.cat,level:c.level,color:c.color,icon:c.icon}).replace(/"/g,'&quot;')})"><i class="ti ti-edit"></i>Editar</button>
          <button class="btn btn-sm" style="color:#E24B4A;border-color:rgba(226,75,74,.25)" onclick="eliminarCurso('${c.id}','${c.name}')"><i class="ti ti-trash"></i></button>
          <button class="btn btn-teal btn-sm" onclick="abrirModalLeccionPorId('${c.id}',${ci})"><i class="ti ti-plus"></i>Nueva lección</button>
        </div>
      </div>
      <div id="lessons-list-${ci}">
        ${lessonRows.length > 0 ? lessonRows : '<div style="padding:14px 18px;font-size:13px;color:var(--text3);text-align:center">Sin lecciones aún — agrega la primera</div>'}
      </div>
      <div style="padding:10px 14px;border-top:0.5px solid var(--border)">
        <button class="btn btn-sm" style="width:100%;justify-content:center;color:var(--teal);border-color:rgba(29,158,117,.25)" onclick="abrirModalLeccionPorId('${c.id}',${ci})">
          <i class="ti ti-plus"></i>Agregar nueva lección a ${c.name}
        </button>
      </div>
    </div>`;
  }).join('');
  } catch(e) {
    console.error('renderCursos error:', e);
    document.getElementById('cursos-list').innerHTML = '<div style="padding:20px;color:var(--text2);text-align:center">Error cargando cursos. <button class="btn btn-sm btn-teal" onclick="renderCursos()">Reintentar</button></div>';
  }
}

async function eliminarLeccionDB(leccionId, cursoId, ci) {
  if (!confirm('¿Eliminar esta lección?')) return;
  try {
    await DB.deleteLeccion(leccionId);
    if (leccionesPorCurso[cursoId]) {
      leccionesPorCurso[cursoId] = leccionesPorCurso[cursoId].filter(l => l.id !== leccionId);
    }
  } catch(e) { console.log('Delete error', e); }
  await renderCursos();
}

renderCursos();

// MÉTRICAS
const topLessons = [
  ['Bounce básico — Hip Hop', 445], ['Paso básico — Salsa', 320],
  ['Groove — Hip Hop', 389], ['Tiempo y ritmo — Salsa', 298], ['Movimiento cadera — Bachata', 212]
];
const maxL = Math.max(...topLessons.map(l => l[1]));
document.getElementById('top-lessons').innerHTML = topLessons.map(([n, v]) => `
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
    <span style="font-size:12px;color:var(--text2);flex:1.2">${n}</span>
    <div class="prog-bar" style="flex:1"><div class="prog-fill" style="width:${Math.round(v / maxL * 100)}%;background:var(--teal)"></div></div>
    <span style="font-size:12px;color:var(--text2);min-width:28px;text-align:right">${v}</span>
  </div>`).join('');

document.getElementById('style-dist').innerHTML = SD.courses.map(c => `
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
    <div style="width:9px;height:9px;border-radius:50%;background:${c.color};flex-shrink:0"></div>
    <span style="font-size:13px;color:var(--text);flex:1">${c.name}</span>
    <div class="prog-bar" style="flex:1.5"><div class="prog-fill" style="width:${c.pct || 15}%;background:${c.color}"></div></div>
    <span style="font-size:12px;color:var(--text2)">${c.pct || 0}%</span>
  </div>`).join('');

// ===== MODAL NUEVO ALUMNO =====

function abrirModalAlumno() {
  const modal = document.getElementById('modal-alumno');
  modal.style.display = 'flex'; modal.style.alignItems = 'center'; modal.style.justifyContent = 'center';
  // Limpiar campos
  document.getElementById('alu-nombre').value = '';
  document.getElementById('alu-apellido').value = '';
  document.getElementById('alu-email').value = '';
  document.getElementById('alu-tel').value = '';
  document.getElementById('modal-error').style.display = 'none';
  document.getElementById('modal-success').style.display = 'none';
  document.querySelectorAll('#curso-checks input').forEach(c => c.checked = false);
}

function cerrarModalAlumno() {
  document.getElementById('modal-alumno').style.display = 'none';
}

// Cerrar al click fuera del modal
document.getElementById('modal-alumno')?.addEventListener('click', function(e) {
  if (e.target === this) cerrarModalAlumno();
});

async function guardarAlumno() {
  const nombre   = document.getElementById('alu-nombre').value.trim();
  const apellido = document.getElementById('alu-apellido').value.trim();
  const email    = document.getElementById('alu-email').value.trim();
  const plan     = document.getElementById('alu-plan').value;
  const status   = document.getElementById('alu-status').value;
  const errEl    = document.getElementById('modal-error');
  const okEl     = document.getElementById('modal-success');

  // Validaciones
  errEl.style.display = 'none';
  okEl.style.display = 'none';

  if (!nombre) {
    errEl.textContent = 'El nombre es obligatorio.';
    errEl.style.display = 'block';
    return;
  }
  if (!email || !email.includes('@')) {
    errEl.textContent = 'Ingresa un correo electrónico válido.';
    errEl.style.display = 'block';
    return;
  }

  // Initiales para el avatar
  const ini = (nombre[0] + (apellido[0] || nombre[1] || 'X')).toUpperCase();
  const planCorto = plan.split('—')[0].trim();

  // Cursos seleccionados
  const cursosSeleccionados = [...document.querySelectorAll('#curso-checks input:checked')].length;

  // Guardar en Supabase
  okEl.textContent = 'Guardando...';
  okEl.style.display = 'block';
  errEl.style.display = 'none';

  try {
    const result = await DB.createAlumno({
      nombre: nombre + (apellido ? ' ' + apellido : ''),
      email: email,
      telefono: document.getElementById('alu-tel').value.trim(),
      plan: planCorto,
      status: status,
      fecha_vencimiento: '—'
    });

    if (result && result.id) {
      okEl.textContent = `✓ Alumno "${nombre} ${apellido}" guardado correctamente.`;
      okEl.style.display = 'block';
      await cargarAlumnos();
      const total = document.getElementById('total-alumnos');
      if (total) total.textContent = SD.members.length + ' alumnos totales';
      setTimeout(() => cerrarModalAlumno(), 1500);
    } else {
      // Supabase returned null — likely email duplicado u otro error
      errEl.textContent = 'No se pudo guardar. Verifica que el correo no esté registrado ya.';
      errEl.style.display = 'block';
      okEl.style.display = 'none';
    }
  } catch(e) {
    console.error('Error al guardar alumno:', e);
    if (e.message === 'email_duplicado') {
      errEl.textContent = 'Ese correo ya está registrado. Usa uno diferente.';
    } else {
      errEl.textContent = 'Error de conexión. Verifica tu internet e intenta de nuevo.';
    }
    errEl.style.display = 'block';
    okEl.style.display = 'none';
  }

  const total = document.getElementById('total-alumnos');
  if (total) total.textContent = SD.members.length + ' alumnos totales';

  setTimeout(() => cerrarModalAlumno(), 1500);
}

// Cerrar con Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') cerrarModalAlumno();
});

// ===== BOTÓN SUPERIOR DINÁMICO =====
function topBtnAction() {
  const active = document.querySelector('.sidebar-link.active');
  const panel = active ? active.dataset.panel : 'dashboard';
  if (panel === 'alumnos') {
    abrirModalAlumno();
  } else if (panel === 'videos') {
    document.querySelector('.upload-zone').scrollIntoView({ behavior: 'smooth' });
  } else if (panel === 'cursos') {
    alert('Función próximamente disponible');
  } else {
    abrirModalAlumno();
  }
}

// ===== MODAL EDITAR ALUMNO =====
function abrirModalEditar(idx) {
  const m = SD.members[idx];
  if (!m) return;
  document.getElementById('edit-idx').value = idx;
  document.getElementById('edit-nombre').value = m.name;
  document.getElementById('edit-email').value = m.email || '';
  document.getElementById('edit-exp').value = m.exp;
  document.getElementById('edit-error').style.display = 'none';
  document.getElementById('edit-success').style.display = 'none';

  // Set plan select
  const planSel = document.getElementById('edit-plan');
  for (let i = 0; i < planSel.options.length; i++) {
    if (planSel.options[i].value === m.plan || planSel.options[i].text === m.plan) {
      planSel.selectedIndex = i; break;
    }
  }
  // Set status select
  const statusSel = document.getElementById('edit-status');
  for (let i = 0; i < statusSel.options.length; i++) {
    if (statusSel.options[i].value === m.status) {
      statusSel.selectedIndex = i; break;
    }
  }

  const modal = document.getElementById('modal-editar');
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
}

function cerrarModalEditar() {
  document.getElementById('modal-editar').style.display = 'none';
}

document.getElementById('modal-editar')?.addEventListener('click', function(e) {
  if (e.target === this) cerrarModalEditar();
});

async function guardarEdicion() {
  const idx    = parseInt(document.getElementById('edit-idx').value);
  const nombre = document.getElementById('edit-nombre').value.trim();
  const email  = document.getElementById('edit-email').value.trim();
  const plan   = document.getElementById('edit-plan').value;
  const status = document.getElementById('edit-status').value;
  const exp    = document.getElementById('edit-exp').value.trim();
  const errEl  = document.getElementById('edit-error');
  const okEl   = document.getElementById('edit-success');

  errEl.style.display = 'none';
  okEl.style.display = 'none';

  if (!nombre) {
    errEl.textContent = 'El nombre es obligatorio.';
    errEl.style.display = 'block';
    return;
  }

  okEl.textContent = 'Guardando...';
  okEl.style.display = 'block';

  const member = SD.members[idx];

  // Update in Supabase if has id
  if (member.id) {
    try {
      await DB.updateAlumno(member.id, { nombre, email, plan, status, fecha_vencimiento: exp || member.exp });
    } catch(e) { console.log('Update error', e); }
  }

  // Update local
  SD.members[idx].name   = nombre;
  SD.members[idx].email  = email;
  SD.members[idx].plan   = plan;
  SD.members[idx].status = status;
  SD.members[idx].exp    = exp || SD.members[idx].exp;
  SD.members[idx].ini    = (nombre[0] + (nombre.split(' ')[1]?.[0] || nombre[1] || 'X')).toUpperCase();

  okEl.textContent = '✓ Alumno actualizado correctamente.';
  okEl.style.display = 'block';

  renderAlumnos('todos');
  setTimeout(() => cerrarModalEditar(), 1200);
}

async function eliminarAlumno() {
  const idx = parseInt(document.getElementById('edit-idx').value);
  const member = SD.members[idx];
  const nombre = member?.name || 'este alumno';
  if (!confirm(`¿Seguro que quieres eliminar a ${nombre}?`)) return;

  if (member?.id) {
    try { await DB.deleteAlumno(member.id); } catch(e) { console.log('Delete error', e); }
  }

  SD.members.splice(idx, 1);
  renderAlumnos('todos');
  const total = document.getElementById('total-alumnos');
  if (total) total.textContent = SD.members.length + ' alumnos totales';
  cerrarModalEditar();
}

// ===== MODAL NUEVA LECCIÓN =====
function abrirModalLeccionPorId(cursoDbId, courseIdx) {
  // Always find from cursosDB using the real DB id
  const courseFromDb = cursosDB.find(c => c.id === cursoDbId);
  window._editCourseObj = courseFromDb || {};
  window._editCourseIdx = courseIdx;
  window._editCourseName = courseFromDb?.nombre || courseFromDb?.name || 'Curso';
  abrirModalLeccion(courseIdx);
}

function abrirModalLeccion(courseIdx) {
  window._editCourseIdx = courseIdx;
  // ONLY use _editCourseObj if already set by abrirModalLeccionPorId
  if (!window._editCourseObj || !window._editCourseObj.id) {
    window._editCourseObj = cursosDB[courseIdx] || {};
    window._editCourseName = window._editCourseObj.nombre || 'Curso';
  }
  document.getElementById('modal-leccion-titulo').textContent = `Nueva lección — ${window._editCourseName}`;
  document.getElementById('leccion-titulo').value = '';
  document.getElementById('leccion-dur').value = '';
  document.getElementById('leccion-yt').value = '';
  document.getElementById('leccion-desc').value = '';
  document.getElementById('leccion-error').style.display = 'none';
  document.getElementById('leccion-success').style.display = 'none';
  const modal = document.getElementById('modal-leccion');
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
}

function cerrarModalLeccion() {
  document.getElementById('modal-leccion').style.display = 'none';
}

document.getElementById('modal-leccion')?.addEventListener('click', function(e) {
  if (e.target === this) cerrarModalLeccion();
});

async function guardarLeccion() {
  const titulo = document.getElementById('leccion-titulo').value.trim();
  const dur    = document.getElementById('leccion-dur').value.trim();
  const errEl  = document.getElementById('leccion-error');
  const okEl   = document.getElementById('leccion-success');

  errEl.style.display = 'none';
  okEl.style.display  = 'none';

  if (!titulo) { errEl.textContent = 'El título es obligatorio.'; errEl.style.display = 'block'; return; }
  if (!dur)    { errEl.textContent = 'Indica la duración en minutos.'; errEl.style.display = 'block'; return; }

  okEl.textContent = 'Guardando...';
  okEl.style.display = 'block';

  const ci     = window._editCourseIdx;
  const course = window._editCourseObj || {};
  console.log('Guardando lección para curso:', course.id, course.nombre || course.name);
  const newLesson = { t: titulo, d: dur + ' min', done: false };

  // 1. Add to SD.courses local (siempre funciona)
  if (ci !== undefined && SD.courses[ci]) {
    SD.courses[ci].lessons_list.push(newLesson);
    SD.courses[ci].lessons = SD.courses[ci].lessons_list.length;
  }

  // 2. Guardar en Supabase
  let savedToDb = false;
  try {
    // Get curso_id — puede venir de cursosDB o del objeto del curso
    const cursoId = course.id || cursosDB[ci]?.id;
    if (cursoId) {
      const lecciones = await DB.getLecciones(cursoId);
      const result = await DB.createLeccion({
        curso_id: cursoId,
        titulo: titulo,
        duracion: dur + ' min',
        descripcion: '',
        youtube_url: '',
        numero: (lecciones.length || 0) + 1,
        publicado: true
      });
      savedToDb = !!result;
    }
  } catch(e) {
    console.log('Supabase error (guardado local):', e);
  }

  okEl.innerHTML = `✓ Lección "<strong>${titulo}</strong>" creada${savedToDb ? ' y guardada' : ''}. Abriendo editor...`;
  okEl.style.display = 'block';
  renderCursos();

  setTimeout(() => {
    cerrarModalLeccion();
    window.location.href = `leccion.html?course=${ci}&title=${encodeURIComponent(titulo)}&dur=${encodeURIComponent(dur)}`;
  }, 900);
}

function eliminarLeccion(ci, li, btn) {
  const lesson = SD.courses[ci].lessons_list[li];
  if (!confirm(`¿Eliminar la lección "${lesson.t}"?`)) return;
  SD.courses[ci].lessons_list.splice(li, 1);
  SD.courses[ci].lessons = SD.courses[ci].lessons_list.length;
  renderCursos();
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    cerrarModalLeccion();
    cerrarModalAlumno();
    cerrarModalEditar();
  }
});

// ===== MODAL NUEVO / EDITAR CURSO =====

function abrirModalCurso(curso) {
  _editCursoId = curso?.id || null;
  document.getElementById('modal-curso-ttl').textContent = curso ? 'Editar curso' : 'Nuevo curso';
  document.getElementById('curso-nombre').value = curso?.name || curso?.nombre || '';
  document.getElementById('curso-estilo').value = curso?.cat || curso?.estilo || 'salsa';
  document.getElementById('curso-nivel').value = curso?.level || curso?.nivel || 'Básico';
  document.getElementById('curso-color').value = curso?.color || '#1D9E75';
  document.getElementById('curso-error').style.display = 'none';
  document.getElementById('curso-success').style.display = 'none';
  const modal = document.getElementById('modal-curso');
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
}

function cerrarModalCurso() {
  document.getElementById('modal-curso').style.display = 'none';
}

document.getElementById('modal-curso')?.addEventListener('click', function(e) {
  if (e.target === this) cerrarModalCurso();
});

async function guardarCurso() {
  const nombre  = document.getElementById('curso-nombre').value.trim();
  const estilo  = document.getElementById('curso-estilo').value;
  const nivel   = document.getElementById('curso-nivel').value;
  const color   = document.getElementById('curso-color').value;
  const errEl   = document.getElementById('curso-error');
  const okEl    = document.getElementById('curso-success');

  errEl.style.display = 'none';
  okEl.style.display = 'none';

  if (!nombre) {
    errEl.textContent = 'El nombre del curso es obligatorio.';
    errEl.style.display = 'block';
    return;
  }

  okEl.textContent = 'Guardando...';
  okEl.style.display = 'block';

  const iconMap = { salsa:'ti-music', bachata:'ti-heart', hiphop:'ti-trending-up', reggaeton:'ti-flame', cumbia:'ti-music', otro:'ti-star' };

  try {
    if (_editCursoId) {
      // UPDATE
      await DB.updateCurso(_editCursoId, { nombre, estilo, nivel, color, icono: iconMap[estilo] || 'ti-music' });
      okEl.textContent = `✓ Curso "${nombre}" actualizado correctamente.`;
    } else {
      // CREATE
      await DB.createCurso({ nombre, estilo, nivel, color, icono: iconMap[estilo] || 'ti-music' });
      okEl.textContent = `✓ Curso "${nombre}" creado correctamente.`;
    }
    await cargarCursos();
    setTimeout(() => cerrarModalCurso(), 1200);
  } catch(e) {
    // Fallback local
    if (!_editCursoId) {
      SD.courses.push({ id: Date.now(), name: nombre, cat: estilo, level: nivel, color, icon: iconMap[estilo] || 'ti-music', lessons_list: [], lessons: 0, pct: 0 });
    }
    okEl.textContent = `✓ Curso "${nombre}" ${_editCursoId ? 'actualizado' : 'creado'}.`;
    renderCursos();
    setTimeout(() => cerrarModalCurso(), 1200);
  }
}

async function eliminarCurso(id, nombre) {
  if (!confirm(`¿Eliminar el curso "${nombre}"? Esto eliminará todas sus lecciones.`)) return;
  try {
    await DB.deleteCurso(id);
    await cargarCursos();
  } catch(e) {
    SD.courses = SD.courses.filter(c => c.id !== id);
    renderCursos();
  }
}

// Load cursos on panel open
const _origGoPanel = goPanel;
goPanel = function(id) {
  _origGoPanel(id);
  if (id === 'cursos') cargarCursos();
  if (id === 'alumnos') cargarAlumnos();
};

// Initial load — wrapped in try/catch so errors don't break navigation
(async function init() {
  try { await cargarCursos(); } catch(e) { console.error('cargarCursos error:', e); renderCursos(); }
  try { await cargarAlumnos(); } catch(e) { console.error('cargarAlumnos error:', e); renderAlumnos('todos'); }
})();

// ===== VIDEOS =====
function previewVideo(input) {
  const file = input.files[0];
  if (!file) return;
  const preview = document.getElementById('vid-file-preview');
  preview.style.display = 'flex';
  document.getElementById('vid-fname').textContent = file.name;
  document.getElementById('vid-fsize').textContent = (file.size / 1024 / 1024).toFixed(1) + ' MB';
}

function quitarVideo() {
  document.getElementById('vid-file-preview').style.display = 'none';
  document.getElementById('vid-file-input').value = '';
}

function mostrarMsgVideo(msg, ok) {
  const el = document.getElementById('vid-msg');
  el.textContent = msg;
  el.style.display = 'block';
  el.style.background = ok ? 'rgba(29,158,117,.12)' : 'rgba(226,75,74,.12)';
  el.style.color = ok ? 'var(--teal)' : '#E24B4A';
  el.style.border = '0.5px solid ' + (ok ? 'rgba(29,158,117,.3)' : 'rgba(226,75,74,.3)');
}

async function publicarVideo(publicado = true) {
  const titulo    = document.getElementById('vid-titulo')?.value.trim();
  const youtube   = document.getElementById('vid-youtube')?.value.trim();
  const cursoSel  = document.getElementById('vid-curso')?.value;
  const duracion  = document.getElementById('vid-duracion')?.value.trim();
  const desc      = document.getElementById('vid-descripcion')?.value.trim();

  if (!titulo) { mostrarMsgVideo('El título es obligatorio.', false); return; }
  if (!cursoSel) { mostrarMsgVideo('Selecciona un curso.', false); return; }

  mostrarMsgVideo('Guardando...', true);

  try {
    const lecciones = await DB.getLecciones(cursoSel);
    const result = await DB.createLeccion({
      curso_id: cursoSel,
      titulo,
      duracion: duracion ? duracion + ' min' : '—',
      descripcion: desc || '',
      youtube_url: youtube || '',
      numero: (lecciones.length || 0) + 1,
      publicado
    });

    if (result) {
      mostrarMsgVideo('✓ Video ' + (publicado ? 'publicado' : 'guardado como borrador') + ' correctamente.', true);
      // Clear form
      document.getElementById('vid-titulo').value = '';
      document.getElementById('vid-youtube').value = '';
      document.getElementById('vid-duracion').value = '';
      document.getElementById('vid-descripcion').value = '';
      document.getElementById('vid-file-preview').style.display = 'none';
      document.getElementById('vid-file-input').value = '';
      // Refresh list
      await cargarVideos();
    } else {
      mostrarMsgVideo('Error al guardar. Intenta de nuevo.', false);
    }
  } catch(e) {
    console.error('publicarVideo error:', e);
    mostrarMsgVideo('Error de conexión.', false);
  }
}

function guardarBorradorVideo() {
  publicarVideo(false);
}

// Load all videos from Supabase
async function cargarVideos(filtro) {
  try {
    const cursos = await DB.getCursos();
    let todas = [];
    for (const c of cursos) {
      const lecs = await DB.getLecciones(c.id);
      lecs.forEach(l => {
        l._cursoNombre = c.nombre;
        l._cursoEstilo = c.estilo;
        l._cursoColor = c.color || '#1D9E75';
      });
      todas = todas.concat(lecs);
    }
    todosVideos = todas;

    // Update stats
    const total = todas.length;
    const publicados = todas.filter(v => v.publicado).length;
    const borradores = total - publicados;
    const elTotal = document.getElementById('bib-total');
    const elPub = document.getElementById('bib-publicados');
    const elBor = document.getElementById('bib-borradores');
    if (elTotal) elTotal.textContent = total;
    if (elPub) elPub.textContent = publicados;
    if (elBor) elBor.textContent = borradores;

    renderVids(filtro || 'todos');
  } catch(e) {
    console.log('cargarVideos error:', e);
    document.getElementById('vid-list').innerHTML = '<div style="padding:20px;text-align:center;color:var(--text2)">Error cargando videos.</div>';
  }
}

function buscarVideos(q) {
  if (!q) { renderVids('todos'); return; }
  const filtered = todosVideos.filter(v => v.titulo.toLowerCase().includes(q.toLowerCase()));
  document.getElementById('vid-list').innerHTML = filtered.length
    ? filtered.map(v => makeVidRow(v)).join('')
    : '<div style="padding:20px;text-align:center;color:var(--text2)">No se encontraron videos.</div>';
}

const iconMap = { salsa:'ti-music', bachata:'ti-heart', hiphop:'ti-trending-up', reggaeton:'ti-flame', cumbia:'ti-music' };

function makeVidRow(v) {
  return `
    <div style="display:flex;align-items:center;gap:10px;padding:11px 15px;background:var(--dark2);border:0.5px solid var(--border);border-radius:var(--border-radius-md);margin-bottom:8px;transition:border-color .12s" onmouseover="this.style.borderColor='var(--teal)'" onmouseout="this.style.borderColor='var(--border)'">
      <div style="width:64px;height:40px;border-radius:8px;background:${v._cursoColor}18;display:flex;align-items:center;justify-content:center;color:${v._cursoColor};font-size:20px;flex-shrink:0;border:0.5px solid ${v._cursoColor}30">
        <i class="ti ${iconMap[v._cursoEstilo] || 'ti-video'}"></i>
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:500;color:var(--text);margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${v.titulo}</div>
        <div style="font-size:11px;color:var(--text2);display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span style="display:flex;align-items:center;gap:4px"><i class="ti ti-layout-grid" style="font-size:11px"></i>${v._cursoNombre || ''}</span>
          <span style="display:flex;align-items:center;gap:4px"><i class="ti ti-clock" style="font-size:11px"></i>${v.duracion || '—'}</span>
          <span style="color:${v.publicado ? 'var(--teal)' : '#EF9F27'};font-weight:500">${v.publicado ? '● Publicado' : '○ Borrador'}</span>
        </div>
      </div>
      <div style="display:flex;gap:6px;flex-shrink:0">
        ${v.youtube_url ? `<a href="${v.youtube_url}" target="_blank" class="btn btn-sm" style="color:#E24B4A"><i class="ti ti-brand-youtube"></i>YouTube</a>` : ''}
        <button class="btn btn-sm" onclick="window.location.href='leccion.html?id=${v.id}'"><i class="ti ti-edit"></i>Editar</button>
        <button class="btn btn-sm" style="color:#E24B4A;border-color:rgba(226,75,74,.25)" onclick="eliminarVideo('${v.id}')"><i class="ti ti-trash"></i></button>
      </div>
    </div>`;
}

function renderVids(filtro) {
  const videos = filtro === 'todos' ? todosVideos : todosVideos.filter(v => v._cursoEstilo === filtro);
  if (!videos.length) {
    document.getElementById('vid-list').innerHTML = '<div style="padding:40px;text-align:center;color:var(--text2);font-size:13px"><i class="ti ti-archive" style="font-size:32px;display:block;margin-bottom:8px;opacity:.3"></i>No hay videos en esta categoría</div>';
    return;
  }
  document.getElementById('vid-list').innerHTML = videos.map(v => makeVidRow(v)).join('');
}

async function eliminarVideo(id) {
  if (!confirm('¿Eliminar este video?')) return;
  try {
    await DB.deleteLeccion(id);
    await cargarVideos();
  } catch(e) { console.error('eliminarVideo error:', e); }
}


