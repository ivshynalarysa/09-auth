'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, type NewNoteData } from '@/lib/api/clientApi';
import { useNoteDraftStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';

export default function NoteForm() {
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      window.history.back();
    },
  });

  const formAction = (formData: FormData) => {
    const values: NewNoteData = {
      title: String(formData.get('title') ?? ''),
      content: String(formData.get('content') ?? ''),
      tag: String(formData.get('tag') ?? 'Todo') as NewNoteData['tag'],
    };

    createNoteMutation.mutate(values);
  };

  return (
    <form action={formAction} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>

        <input
          id="title"
          type="text"
          name="title"
          value={draft.title}
          onChange={(event) =>
            setDraft({
              ...draft,
              title: event.target.value,
            })
          }
          className={css.input}
          minLength={3}
          maxLength={50}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>

        <textarea
          id="content"
          name="content"
          rows={8}
          value={draft.content}
          onChange={(event) =>
            setDraft({
              ...draft,
              content: event.target.value,
            })
          }
          className={css.textarea}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>

        <select
          id="tag"
          name="tag"
          value={draft.tag}
          onChange={(event) =>
            setDraft({
              ...draft,
              tag: event.target.value as NewNoteData['tag'],
            })
          }
          className={css.select}
          required
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => window.history.back()}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? 'Creating...' : 'Create Note'}
        </button>
      </div>
    </form>
  );
}