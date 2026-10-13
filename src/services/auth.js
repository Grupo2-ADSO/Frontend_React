// Relación entre el número del rol que envía Laravel y su nombre.
export const roleNames = {
  1: 'Administrador',
  2: 'Supervisor',
  3: 'Operario',
};

// Devuelve el rol guardado durante el inicio de sesión.
export function getRole() {
  const rol = Number(localStorage.getItem('rol'));

  if (roleNames[rol]) {
    return rol;
  }

  return null;
}

// Cada rol tiene una página principal distinta.
export function getHomePath(rol = getRole()) {
  if (rol === 1) return '/admin';
  if (rol === 2) return '/supervisor';
  if (rol === 3) return '/operario';
  return '/';
}

// Obtiene los datos de la persona que inició sesión.
export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('usuario') || 'null');
  } catch {
    return null;
  }
}

// Guarda el token, el usuario y el rol en el navegador.
export function saveSession({ token, user, role }) {
  localStorage.setItem('token', token);
  localStorage.setItem('usuario', JSON.stringify(user || {}));
  localStorage.setItem('rol', String(role));
}

// Elimina los datos de la sesión al cerrar sesión.
export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('rol');
}
