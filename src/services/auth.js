
export const roleNames = {
  1: 'Administrador',
  2: 'Supervisor',
  3: 'Operario',
};


export function getRole() {
  const rol = Number(localStorage.getItem('rol'));

  if (roleNames[rol]) {
    return rol;
  }

  return null;
}


export function getHomePath(rol = getRole()) {
  if (rol === 1) return '/admin';
  if (rol === 2) return '/supervisor';
  if (rol === 3) return '/operario';
  return '/';
}


export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('usuario') || 'null');
  } catch {
    return null;
  }
}


export function saveSession({ token, user, role }) {
  localStorage.setItem('token', token);
  localStorage.setItem('usuario', JSON.stringify(user || {}));
  localStorage.setItem('rol', String(role));
}


export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('rol');
}
