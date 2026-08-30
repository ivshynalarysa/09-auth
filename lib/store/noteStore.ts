import { create } from 'zustand';
import { NewNoteData } from '../api'
import { persist } from 'zustand/middleware';

type NoteDraftStore = {
    draft: NewNoteData;
    setDraft: (note: NewNoteData) => void;
    clearDraft: () => void;
};

const initialDraft: NewNoteData = {
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
)