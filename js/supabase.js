// ===== 2SHAKING DANCE — SUPABASE CONNECTION =====

const SUPABASE_URL = 'https://hfosngjlvowxnujplnfo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmb3NuZ2psdm93eG51anBsbmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDE1NzYsImV4cCI6MjA5NDYxNzU3Nn0.qpi62Qd3CURTIbvTk8DOv1P1Dw17WjzjnWQdW4z0opo';

const DB = {

  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Prefer': 'return=representation'
  },

  // ===== ALUMNOS =====
  async getAlumnos() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/alumnos?order=created_at.desc`, { headers: this.headers });
    return res.ok ? await res.json() : [];
  },

  async createAlumno(data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/alumnos`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      console.error('Supabase createAlumno error:', err);
      // Email duplicado
      if (err.code === '23505') throw new Error('email_duplicado');
      return null;
    }
    const json = await res.json();
    return Array.isArray(json) ? json[0] : json;
  },

  async updateAlumno(id, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/alumnos?id=eq.${id}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    return res.ok;
  },

  async deleteAlumno(id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/alumnos?id=eq.${id}`, {
      method: 'DELETE',
      headers: this.headers
    });
    return res.ok;
  },

  // ===== CURSOS =====
  async getCursos() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/cursos?order=created_at.asc`, { headers: this.headers });
    return res.ok ? await res.json() : [];
  },

  // ===== CURSOS CRUD =====
  async createCurso(data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/cursos`, {
      method: 'POST', headers: this.headers, body: JSON.stringify(data)
    });
    return res.ok ? (await res.json())[0] : null;
  },

  async updateCurso(id, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/cursos?id=eq.${id}`, {
      method: 'PATCH', headers: this.headers, body: JSON.stringify(data)
    });
    return res.ok;
  },

  async deleteCurso(id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/cursos?id=eq.${id}`, {
      method: 'DELETE', headers: this.headers
    });
    return res.ok;
  },

  // ===== LECCIONES =====
  async getLecciones(cursoId) {
    if (!cursoId) return [];
    const res = await fetch(`${SUPABASE_URL}/rest/v1/lecciones?curso_id=eq.${cursoId}&order=numero.asc,created_at.asc`, { headers: this.headers });
    if (!res.ok) {
      console.error('getLecciones error:', res.status, await res.text());
      return [];
    }
    return await res.json();
  },

  async createLeccion(data) {
    if (data.numero) data.numero = parseInt(data.numero);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/lecciones`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('createLeccion error:', res.status, err);
      return null;
    }
    const json = await res.json();
    return Array.isArray(json) ? json[0] : json;
  },

  async updateLeccion(id, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/lecciones?id=eq.${id}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    return res.ok;
  },

  async deleteLeccion(id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/lecciones?id=eq.${id}`, {
      method: 'DELETE',
      headers: this.headers
    });
    return res.ok;
  },

  // ===== PROGRESO =====
  async getProgreso(alumnoId) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/progreso?alumno_id=eq.${alumnoId}`, { headers: this.headers });
    return res.ok ? await res.json() : [];
  },

  async marcarCompleto(alumnoId, leccionId) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/progreso`, {
      method: 'POST',
      headers: { ...this.headers, 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify({ alumno_id: alumnoId, leccion_id: leccionId, completado: true, fecha_completado: new Date().toISOString() })
    });
    return res.ok;
  }
};
