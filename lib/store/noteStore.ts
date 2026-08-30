import { create } from 'zustand';
import { CreateNoteValues } from '../api/clientApi';
import { persist } from 'zustand/middleware';

type NoteDraftStore = {
	draft: CreateNoteValues;
	setDraft: (note: CreateNoteValues) => void;
	clearDraft: () => void;
};

const initialDraft: CreateNoteValues = {
	title: '',
	content: '',
	tag: 'Todo',
};

export const useNoteDraftStore = create<NoteDraftStore>()(
	persist(
		set => {
			return {
				draft: initialDraft,
				setDraft: note => {
					set(() => {
						return { draft: note };
					});
				},
				clearDraft: () => {
					set(() => {
						return { draft: initialDraft };
					});
				},
			};
		},
		{
			name: 'note-draft',
			partialize: state => {
				return {
					draft: state.draft,
				};
			},
		}
	)
);