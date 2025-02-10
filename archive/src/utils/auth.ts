export function getToken(): string {
    return localStorage.getItem('token') || ''
}

export function setToken(token: string): void {
    localStorage.setItem('token', token)
}

export function removeToken(): void {
    localStorage.removeItem('token')
}

export function hasPermission(permission: string): boolean {
    const userPermissions = JSON.parse(localStorage.getItem('permissions') || '[]')
    return userPermissions.includes(permission)
} 