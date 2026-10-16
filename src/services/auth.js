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