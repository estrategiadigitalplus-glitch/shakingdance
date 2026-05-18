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
  document.getElementById('alu-body').innerHTML = filtered.map(m => `
    <tr>
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
      <td style="color:${m.status === 'expirado' ? '#E24B4A' : 'var(--text2)'}">${m.exp}</td>
    </tr>`).join('');
}
renderAlumnos('todos');

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
        <button class="btn btn-sm"><i class="ti ti-edit"></i>Editar</button>
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
document.getElementById('cursos-list').innerHTML = SD.courses.map(c => `
  <div class="card" style="margin-bottom:12px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--border)">
      <div style="width:34px;height:34px;border-radius:9px;background:${c.color}18;display:flex;align-items:center;justify-content:center;color:${c.color};font-size:18px"><i class="ti ${c.icon}"></i></div>
      <span style="font-size:14px;font-weight:600;color:var(--text);flex:1">${c.name}</span>
      <span style="font-size:12px;color:var(--text2)">${c.lessons} lecciones · ${c.level}</span>
      <button class="btn btn-teal btn-sm"><i class="ti ti-plus"></i>Agregar nivel</button>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <div style="flex:1;min-width:140px;padding:10px 14px;background:var(--dark3);border-radius:var(--radius-sm)">
        <div style="font-size:13px;font-weight:500;color:var(--text);margin-bottom:3px">${c.level}</div>
        <div style="font-size:11px;color:var(--text2)">${c.lessons} lecciones · ${c.pct > 0 ? 'Prog. alumno: ' + c.pct + '%' : 'Sin alumnos aún'}</div>
        <button class="btn btn-sm" style="margin-top:8px;font-size:11px"><i class="ti ti-edit"></i>Editar</button>
      </div>
    </div>
  </div>`).join('');

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
  modal.style.display = 'flex';
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

function guardarAlumno() {
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

  // Agregar al array local
  SD.members.unshift({
    name: nombre + ' ' + apellido,
    ini, plan: planCorto, status,
    courses: cursosSeleccionados || 1,
    prog: 0,
    exp: '—'
  });

  // Mostrar éxito
  okEl.textContent = `✓ Alumno "${nombre} ${apellido}" agregado correctamente.`;
  okEl.style.display = 'block';

  // Actualizar tabla
  renderAlumnos('todos');

  // Actualizar contador
  const total = document.getElementById('total-alumnos');
  if (total) total.textContent = SD.members.length + ' alumnos totales';

  // Cerrar modal después de 1.5 segundos
  setTimeout(() => cerrarModalAlumno(), 1500);
}

// Cerrar con Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') cerrarModalAlumno();
});
