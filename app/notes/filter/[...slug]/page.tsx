
import { fetchNotes } from '@/lib/api';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { Note } from '@/types/note';
import { Metadata } from 'next';

type NotesProps = {
	params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: NotesProps): Promise<Metadata> {
	const { slug } = await params;
	const tag: string = slug[0] === 'all' ? '' : slug[0];

	return {
		title: tag ? `${tag} - NoteHUB` : 'NoteHUB',
		description: tag ? `Notes tagged with ${tag}` : 'A simple and fast notes app to create, edit, and manage your personal or work-related notes.',
		openGraph: {
			title: tag ? `${tag} - NoteHUB` : 'NoteHUB',
			description: tag ? `Notes tagged with ${tag}` : 'A simple and fast notes app to create, edit, and manage your personal or work-related notes.',
			url: `https://08-zustand-zeta-tawny.vercel.app/notes/filter/${slug.join('/')}`,
			images: [{
				url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
				width: 1200,
				height: 630,
				alt: 'NoteHUB - Personal Notes App',
			}]
		}
	};
}



export default async function Notes({ params }: NotesProps) {
	const { slug } = await params;
	const queryClient = new QueryClient();
	const initialQuery: string = '';
	const initialPage: number = 1;
	const tag: string = slug[0] === 'all' ? '' : slug[0];

	await queryClient.prefetchQuery({
		queryKey: ['notes', '', 1, tag],
		queryFn: () => fetchNotes('', 1, tag),
	});

	const initialData = queryClient.getQueryData(['notes', initialQuery, initialPage, tag]) as {
		notes: Note[];
		totalPages: number;
	};

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<NotesClient tag={tag} />
		</HydrationBoundary>
	);
}

export const dynamic = 'force-dynamic';