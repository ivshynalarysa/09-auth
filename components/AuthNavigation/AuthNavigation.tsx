'use client';

import css from './AuthNavigation.module.css';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';

const AuthNavigation = () => {
	const isAuth = useAuthStore(state => {
		return state.isAuthenticated;
	});
	const user = useAuthStore(state => {
		return state.user;
	});
	const clear = useAuthStore(state => {
		return state.clearIsAuthenticated;
	});
	const router = useRouter();

	const handleLogout = async () => {
		await logout();
		clear();
		router.push('/sign-in');
		router.refresh();
	};

	return (
		<>
			{isAuth ? (
				<>
					<li className={css.navigationItem}>
						<Link href="/profile" prefetch={false} className={css.navigationLink}>
							Profile
						</Link>
					</li>

					<li className={css.navigationItem}>
						<p className={css.userEmail}>{user?.email}</p>
						<button className={css.logoutButton} onClick={handleLogout}>
							Logout
						</button>
					</li>
				</>
			) : (
				<>
					<li className={css.navigationItem}>
						<Link href="/sign-in" prefetch={false} className={css.navigationLink}>
							Login
						</Link>
					</li>

					<li className={css.navigationItem}>
						<Link href="/sign-up" prefetch={false} className={css.navigationLink}>
							Sign up
						</Link>
					</li>
				</>
			)}
		</>
	);
};

export default AuthNavigation;