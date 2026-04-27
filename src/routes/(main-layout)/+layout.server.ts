import { ROLES } from '@/constants/permission';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
	const currentUser = event.locals.currentUser;

	// Jika tidak ada user yang login, redirect ke login
	if (!currentUser) {
		redirect(307, '/auth/login');
	}

	console.log(currentUser, 'ok p');

	const userRole = currentUser.userInfo.role; // Ambil role dari currentUser
	const currentPath = event.url.pathname;

	// Definisikan role permissions
	const rolePermissions = {
		[ROLES.SUPERADMIN]: [
			'/dashboard',
			'/master/user',
			'/master/point',
			'/master/customer',
			'/master/item',
			'/transaction',
			'/purchase',
			'/sto',
			'/report/sales',
			'/report/purchase',
			'/report/shift',
			'/report/monitoring-stock'
		],
		[ROLES.ADMIN]: [
			'/dashboard',
			'/purchase',
			'/report/sales',
			'/report/purchase',
			'/report/shift',
			'/sto',
			'/report/monitoring-stock'
		],
		[ROLES.CASHIER]: ['/transaction', '/master/customer', '/report/sales'],
		[ROLES.GUDANG]: ['/report/purchase', '/report/monitoring-stock']
	};

	// Cek role user dan dapatkan allowed routes
	let allowedRoutes: string[] = [];

	if (userRole === ROLES.SUPERADMIN) {
		allowedRoutes = rolePermissions[ROLES.SUPERADMIN];
	} else if (userRole === ROLES.ADMIN) {
		allowedRoutes = rolePermissions[ROLES.ADMIN];
	} else if (userRole === ROLES.GUDANG) {
		allowedRoutes = rolePermissions[ROLES.GUDANG];
	} else if (userRole === ROLES.CASHIER) {
		allowedRoutes = rolePermissions[ROLES.CASHIER];
	} else {
		// Jika role tidak dikenali
		redirect(307, '/unauthorized');
	}

	console.log('User Role:', userRole);
	console.log('Current Path:', currentPath);
	console.log('Allowed Routes:', allowedRoutes);

	// Validasi apakah current path diizinkan untuk role ini
	const hasAccess = allowedRoutes.some((route) => currentPath.startsWith(route));

	if (hasAccess) {
		return {
			currentUser,
			userRole // Tambahkan ini untuk debugging
		};
	} else {
		redirect(307, `/unauthorized`);
	}
};
