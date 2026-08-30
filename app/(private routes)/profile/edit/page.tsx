'use client';

import css from './EditProfilePage.module.css';
import { editUser } from '@/lib/api/clientApi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

type FormType = {
	username: string;
};

const ProfileEditPage = () => {
	const me = useAuthStore(state => state.user);
	const setMe = useAuthStore(state => state.setUser);

	const router = useRouter();

	const handleEditName = async (formData: FormData) => {
		const data = Object.fromEntries(formData) as FormType;

		if (!data.username.trim()) {
			return;
		}

		try {
			const response = await editUser({
				username: data.username,
			});
			setMe(response);

			router.push('/profile');
		} catch (error) {
			throw error;
		}
	};

	const handleBack = () => {
		router.back();
	};

	return (
		<main className={css.mainContent}>
			<div className={css.profileCard}>
				<h1 className={css.formTitle}>Edit Profile</h1>

				<Image src={me?.avatar || '/7236095.png'} alt="User Avatar" width={120} height={120} className={css.avatar} />

				<form className={css.profileInfo} action={handleEditName}>
					<div className={css.usernameWrapper}>
						<label htmlFor="username">Username:</label>
						<input name="username" id="username" type="text" className={css.input} defaultValue={me?.username} />
					</div>

					<p>Email: {me?.email}</p>

					<div className={css.actions}>
						<button type="submit" className={css.saveButton}>
							Save
						</button>
						<button type="button" className={css.cancelButton} onClick={handleBack}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</main>
	);
};

export default ProfileEditPage;