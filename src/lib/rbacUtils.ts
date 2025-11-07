import { browser } from "$app/environment";

export function getUserRole(cookieName: string = 'user_info'): string | null {
    if (!browser) return null;

    try {
        // Ambil raw cookie value
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${cookieName}=`);

        if (parts.length === 2) {
            const cookieValue = parts.pop()?.split(';').shift();

            if (!cookieValue) return null;

            console.log('Raw Cookie Value:', cookieValue);

            // Decode URL encoded string
            const decodedData = decodeURIComponent(cookieValue);
            console.log('Decoded Data:', decodedData);

            // Parse JSON
            const userData = JSON.parse(decodedData);
            console.log('Parsed User Data:', userData);

            // Return role langsung
            return userData.role; // "Cashier"
        }

        return null;
    } catch (error) {
        console.error('Error parsing user role from cookie:', error);
        return null;
    }
}

export function checkRole(requiredRole: string) {
    const user = getUserRole('user_info')
    console.log(user, 'ok')
    if (!user) {
        return false;
    }

    return user === requiredRole;
}
// Fungsi validasi akses
export function hasAccess(requiredRoles: string[]) {
    const userRole:any = getUserRole('user_info');
    return requiredRoles.includes(userRole);
};
