'use client';

import css from './SignUpPage.module.css';
import { signUp } from '@/lib/api/clientApi';
import { SignRequest } from '@/types/services';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import * as Yup from 'yup';
import { SignFormsValues } from '@/types/user';

const validationSchema = Yup.object().shape({
	email: Yup.string().required('Email is required').email('Enter a valid email address'),
	password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const SignUpPage = () => {
	const router = useRouter();
	const [error, setError] = useState('');
	const setUser = useAuthStore(state => state.setUser);
	const [formRegisterData, setRegisterFormData] = useState<SignFormsValues>({
		email: '',
		password: '',
	});

	async function validateRegister(data: SignFormsValues): Promise<string | null> {
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
		setRegisterFormData(data => ({
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

			const errorValidation = await validateRegister(data);

			if (errorValidation) {
				setError(errorValidation);
				return;
			}

			const res = await signUp(data);
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
			<h1 className={css.formTitle}>Sign up</h1>
			<form className={css.form} action={handleSubmit}>
				<div className={css.formGroup}>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
						name="email"
						className={css.input}
						required
						value={formRegisterData.email}
						onChange={handleChange}
					/>
				</div>

				<div className={css.formGroup}>
					<label htmlFor="password">Password</label>
					<input id="password"
						type="password"
						name="password"
						className={css.input} required
						value={formRegisterData.password}
						onChange={handleChange}
					/>
				</div>

				<div className={css.actions}>
					<button type="submit" className={css.submitButton}>
						Register
					</button>
				</div>
				{error && <p className={css.error}>{error}</p>}
			</form>
		</main>
	);
};

export default SignUpPage;