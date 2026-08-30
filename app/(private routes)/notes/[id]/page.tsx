import { fetchServerNoteById } from '@/lib/api/serverApi';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import { Metadata } from 'next';

export async function generateMetadata({ params }: NoteDetailsProps): Promise<Metadata> {


  const { id } = await params;
  const note = await fetchServerNoteById(id);

  return {
    title: note.title,
    description: note.content.slice(0, 160),
    openGraph: {
      title: note.title,
      description: note.content.slice(0, 160),
      url: `https://08-zustand-zeta-tawny.vercel.app/notes/${id}`,
      images: [{
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHUB - Personal Notes App',
      }]
    }
  };
}

type NoteDetailsProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NoteDetails({
  params,
}: NoteDetailsProps) {
  const queryClient = new QueryClient();

  const { id } = await params;
  

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchServerNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}