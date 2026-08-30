'use client';
import css from './NoteForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api/clientApi';
import ErrorMessageText from '../ErrorMessage/ErrorMessage';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNoteDraftStore } from '@/lib/store/noteStore';

interface NoteFormValues {
	title: string;
	content?: string;
	tag: 'Work' | 'Personal' | 'Meeting' | 'Shopping' | 'Todo';
}

const validationSchema = Yup.object().shape({
	title: Yup.string().required('Title is required').min(3, 'Title must be at least 3 characters').max(50, 'Title is too long'),
	content: Yup.string().max(500, 'Content is too long'),
	tag: Yup.string().oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag value').required('Tag is required'),
});

export default function NoteForm() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [validationError, setValidationError] = useState<string | null>(null);
	const { draft, setDraft, clearDraft } = useNoteDraftStore();
	const mutation = useMutation({
		mutationFn: async (task: NoteFormValues) => createNote(task),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notes'], exact: false });
			clearDraft();
			goBack();
		},
	});
	const { isPending, isError } = mutation;

	function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
		setDraft({
			...draft,
			[event.target.name]: event.target.value,
		});
	}

	function goBack() {
		router.push('/notes/filter/all');
	}

	async function validateNote(data: NoteFormValues): Promise<string | null> {
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

	async function handleSubmit(formData: FormData) {
		const unparsedData = Object.fromEntries(formData);
		const data: NoteFormValues = {
			title: unparsedData.title as string,
			tag: unparsedData.tag as NoteFormValues['tag'],
			content: unparsedData.content ? (unparsedData.content as string) : undefined,
		};

		const error = await validateNote(data);
		if (error) {
			setValidationError(error);
			return;
		}

		mutation.mutate(data);
	}

	return (
		<form className={css.form} action={handleSubmit}>
			<div className={css.formGroup}>
				<label htmlFor="title">Title</label>
				<input
					id="title"
					type="text"
					name="title"
					className={css.input}
					defaultValue={draft.title}
					onChange={handleChange}
				/>
			</div>
			<div className={css.formGroup}>
				<label htmlFor="content">Content</label>
				<textarea
					id="content"
					name="content"
					rows={8}
					className={css.textarea}
					defaultValue={draft.content}
					onChange={handleChange}
				/>
			</div>
			<div className={css.formGroup}>
				<label htmlFor="tag">Tag</label>
				<select id="tag" name="tag" className={css.select} defaultValue={draft.tag} onChange={handleChange}>
					<option value="Todo">Todo</option>
					<option value="Work">Work</option>
					<option value="Personal">Personal</option>
					<option value="Meeting">Meeting</option>
					<option value="Shopping">Shopping</option>
				</select>
			</div>
			{validationError && <span className={css.error}>{validationError}</span>}
			<div className={css.actions}>
				<button type="button" className={css.cancelButton} onClick={goBack}>
					Cancel
				</button>
				<button type="submit" className={css.submitButton} disabled={isPending ? true : false}>
					{!isPending ? 'Create note ' : 'Loading'}
				</button>
			</div>
			{isError && <ErrorMessageText />}
		</form>
	);
}