import { Note } from '@/types/note';
import { nextServer } from './api';
import { CheckSessionResponse, SignRequest } from '@/types/services';
import { User } from '@/types/user';

interface NotesResponse {
	notes: Note[];
	totalPages: number;
}

interface SearchParams {
	page: number;
	perPage: number;
	search?: string;
	tag?: string;
}

export interface CreateNoteValues {
	title: string;
	content?: string;
	tag: 'Work' | 'Personal' | 'Meeting' | 'Shopping' | 'Todo';
}

export type EditUserRequest = {
	username: string;
};

export async function fetchNotes(search: string, page: number, tag?: string): Promise<NotesResponse> {
	const perPage = 12;
	const params: SearchParams = { page, perPage };

	if (search) params.search = search;
	if (tag) params.tag = tag;

	const res = await nextServer.get<NotesResponse>('/notes', {
		params,
	});

	return res.data;
}

export async function createNote({ title, content, tag }: CreateNoteValues): Promise<Note> {
	const res = await nextServer.post<Note>('/notes', {
		title,
		content,
		tag,
	});

	return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
	const res = await nextServer.delete<Note>(`/notes/${id}`);
	return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
	const res = await nextServer.get<Note>(`/notes/${id}`);
	return res.data;
}

export async function signUp(data: SignRequest) {
	const res = await nextServer.post<User>('/auth/register', data);
	return res.data;
}

export async function signIn(data: SignRequest) {
	const res = await nextServer.post<User>('/auth/login', data);
	return res.data;
}

export const checkSession = async () => {
	const res = await nextServer.get<CheckSessionResponse>('/auth/session');
	return res.data.success;
};

export const getMe = async () => {
	const { data } = await nextServer.get<User>('/users/me');
	return data;
};

export const logout = async () => {
	const { data } = await nextServer.post('/auth/logout');
	return data;
};

export const editUser = async (userData: EditUserRequest) => {
	const { data } = await nextServer.patch<User>('/users/me', userData);
	return data;
};