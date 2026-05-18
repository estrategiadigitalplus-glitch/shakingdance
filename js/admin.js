// ===== SHAKING DANCE — ADMIN JS =====

const panelTitles = {
  dashboard: 'Dashboard', alumnos: 'Gestión de alumnos',
  videos: 'Subir y gestionar videos', cursos: 'Cursos',
  metricas: 'Métricas y análisis', config: 'Configuración'
};
const topBtnLabels = {
  dashboard: 'Nuevo video', alumnos: 'Nuevo alumno',
  videos: 'Subir video', cursos: 'Nuevo curso',
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
}

document.querySelectorAll('.sidebar-link[data-panel]').forEach(el => {
  el.addEventListener('click', function () { goPanel(this.dataset.panel); });
});

// DASHBOARD — progreso por estilo
document.getElementById('dash-prog').innerHTML = SD.courses.map(c => `
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
    <span style="font-size:13px;color:var(--text);min-width:80px">${c.name}</span>
    <div class="prog-bar" style="flex:1"><div class="prog-fill" style="width:${c.pct}%;background:${c.color}"></div></div>
    <span style="font-size:12px;color:var(--text2);min-width:32px;text-align:right">${c.pct}%</span>
  </div>`).join('');

// DASHBOARD — alumnos nuevos
const newData = [{ l: 'L', v: 3 }, { l: 'M', v: 5 }, { l: 'X', v: 2 }, { l: 'J', v: 7 }, { l: 'V', v: 4 }, { l: 'S', v: 8 }, { l: 'D', v: 1 }];
const maxN = Math.max(...newData.map(d => d.v));
document.getElementById('new-bars').innerHTML = newData.map(d =>
  `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end">
    <div style="width:100%;height:${Math.round(d.v / maxN * 72)}px;background:var(--teal);opacity:.7;border-radius:3px 3px 0 0"></div>
  </div>`).join('');
document.getElementById('new-lbls').innerHTML = newData.map(d =>
  `<div style="flex:1;text-align:center;font-size:10px;color:var(--text2)">${d.l}</div>`).join('');

// DASHBOARD — actividad
document.getElementById('activity-body').innerHTML = [
  { name: 'María González', ini: 'MG', action: 'Completó lección', course: 'Salsa · L.8', ago: '2 min' },
  { name: 'Luis Pérez', ini: 'LP', action: 'Nuevo registro', course: 'Plan Completo', ago: '15 min' },
  { name: 'Ana Torres', ini: 'AT', action: 'Obtuvo certificado', course: 'Hip Hop Básico', ago: '1h' },
  { name: 'Carlos Ruiz', ini: 'CR', action: 'Completó lección', course: 'Bachata · L.3', ago: '2h' },
  { name: 'Sofía Méndez', ini: 'SM', action: 'Membresía vencida', course: 'Plan Básico', ago: '3h' },
].map(a => `
  <tr>
    <td>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--teal),var(--purple));display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:600;flex-shrink:0">${a.ini}</div>
        ${a.name}
      </div>
    </td>
    <td>${a.action}</td>
    <td style="color:var(--text2)">${a.course}</td>
    <td style="color:var(--text2)">${a.ago}</td>
  </tr>`).join('');

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
cargarAlumnos();

document.getElementById('alu-filters').addEventListener('click', function (e) {
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

document.getElementById('vid-filters').addEventListener('click', function (e) {
  const p = e.target.closest('.fpill');
  if (!p) return;
  this.querySelectorAll('.fpill').forEach(x => x.classList.remove('active'));
  p.classList.add('active');
  renderVids(p.dataset.vf);
});

// CURSOS

// ===== CURSOS CON SUPABASE =====
let cursosDB = [];

async function cargarCursos() {
  try {
    const data = await DB.getCursos();
    if (data && data.length > 0) { cursosDB = data; }
  } catch(e) { console.log("Cursos locales", e); }
  renderCursos();
}

// Lecciones por curso cargadas de Supabase
let leccionesPorCurso = {};

async function renderCursos() {
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
  for (const c of cursos) {
    try {
      if (c.id && typeof c.id === 'string') {
        const lecciones = await DB.getLecciones(c.id);
        leccionesPorCurso[c.id] = lecciones || [];
      } else {
        // fallback to SD.courses lessons
        const sdCurso = SD.courses.find(s => s.cat === c.cat);
        leccionesPorCurso[c.id] = (sdCurso?.lessons_list || []).map((l, li) => ({
          id: li, titulo: l.t, duracion: l.d, done: l.done, numero: li + 1
        }));
      }
    } catch(e) {
      leccionesPorCurso[c.id] = [];
    }
  }

  document.getElementById('cursos-list').innerHTML = cursos.map((c, ci) => {
    const lecciones = leccionesPorCurso[c.id] || [];
    const totalMin = lecciones.reduce((a, l) => a + parseInt(l.duracion || l.d || 0), 0);

    const lessonRows = lecciones.map((l, li) => `
      <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:0.5px solid var(--border);transition:background .1s" onmouseover="this.style.background='rgba(255,255,255,.02)'" onmouseout="this.style.background='transparent'">
        <div style="width:24px;height:24px;border-radius:50%;background:rgba(127,119,221,.1);color:var(--purple);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0">
          ${l.numero || li + 1}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${l.titulo || l.t || 'Sin título'}</div>
          <div style="font-size:11px;color:var(--text2);margin-top:1px"><i class="ti ti-clock" style="font-size:12px"></i> ${l.duracion || l.d || '—'} ${l.publicado ? '<span style='color:var(--teal);margin-left:6px'>● Publicado</span>' : '<span style='color:var(--text3);margin-left:6px'>○ Borrador</span>'}</div>
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
document.getElementById('modal-alumno').addEventListener('click', function(e) {
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

document.getElementById('modal-editar').addEventListener('click', function(e) {
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
  // Find full course object from cursosDB
  const courseFromDb = cursosDB.find(c => c.id === cursoDbId);
  window._editCourseObj = courseFromDb || SD.courses[courseIdx] || {};
  abrirModalLeccion(courseIdx);
}

function abrirModalLeccion(courseIdx) {
  window._editCourseIdx = courseIdx;
  // Try SD.courses first, then cursosDB
  const course = SD.courses[courseIdx] || cursosDB[courseIdx] || {};
  window._editCourseName = course.name || course.nombre || 'Curso';
  window._editCourseObj = course;
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

document.getElementById('modal-leccion').addEventListener('click', function(e) {
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
        publicado: false
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
let _editCursoId = null;

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

document.getElementById('modal-curso').addEventListener('click', function(e) {
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

// Initial load
cargarCursos();
