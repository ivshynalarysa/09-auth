'use client';

import { useRouter } from 'next/navigation';
import css from './SignInPage.module.css';
import { useState } from 'react';
import { SignRequest } from '@/types/services';
import { signIn } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { SignFormsValues } from '@/types/user';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
	email: Yup.string().required('Email is required').email('Enter a valid email address'),
	password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const SignIn = () => {
	const router = useRouter();
	const [error, setError] = useState('');
	const setUser = useAuthStore(state => {
		return state.setUser;
	});
	const [formLoginData, setLoginFormData] = useState<SignFormsValues>({
		email: '',
		password: '',
	});

	async function validateLogin(data: SignFormsValues): Promise<string | null> {
		try {
			await validationSchema.validate(data, { abortEarly: false });
			return null;
		} catch (err) {
			if (err instanceof Yup.ValidationError) {
				return err.errors[0];
			}
			return 'Unknown validation error';
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoginFormData(data => ({
			...data,
			[name]: value,
		}));
	};

	const handleSubmit = async (formData: FormData) => {
		try {
			setError('');

			const raw = Object.fromEntries(formData);
			const data: SignRequest = {
				email: raw.email.toString(),
				password: raw.password.toString(),
			};

			const errorValidation = await validateLogin(data);

			if (errorValidation) {
				setError(errorValidation);
				return;
			}

			const res = await signIn(data);
			if (res) {
				setUser(res);
				router.push('/profile');
			} else {
				setError('Invalid data');
			}
		} catch {
			setError('Invalid data');
		}
	};
	return (
		<main className={css.mainContent}>
			<form className={css.form} action={handleSubmit}>
				<h1 className={css.formTitle}>Sign in</h1>

				<div className={css.formGroup}>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
						name="email"
						className={css.input}
						required
						value={formLoginData.email}
						onChange={handleChange}
					/>
				</div>

				<div className={css.formGroup}>
					<label htmlFor="password">Password</label>
					<input id="password"
						type="password"
						name="password"
						className={css.input} required
						value={formLoginData.password}
						onChange={handleChange}
					/>
				</div>

				<div className={css.actions}>
					<button type="submit" className={css.submitButton}>
						Log in
					</button>
				</div>

				<p className={css.error}>{error}</p>
			</form>
		</main>
	);
};

export default SignIn;