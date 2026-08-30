'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { useEffect, useState } from 'react';

import css from './page.module.css';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';

import SearchBox from '@/components/SearchBox/SearchBox';


import { fetchNotes } from '@/lib/api/clientApi';

import Link  from 'next/link';

type NotesClientProps = {
 tag: string;
};

function NotesClient({
 tag
  
}: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const [searchQuery, setSearchQuery] = useState('');

  const [debouncedText] = useDebounce(searchQuery, 300);

  const { data, isSuccess, isError, error } = useQuery({
    queryKey: ['notes', debouncedText, currentPage, tag],
    queryFn: () => fetchNotes(debouncedText, currentPage, tag),
    placeholderData: keepPreviousData,
   
  });

  

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedText]);

  if (isError) {
    throw error;
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

 

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          searchQuery={searchQuery}
          onChange={handleSearchChange}
        />

        {isSuccess && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
          />
        )}

        <Link
          href="/notes/action/create"
          className={css.button}
          >
          Create note +
        </Link>
      </header>

      {isSuccess && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

    
    </div>
  );
}

export default NotesClient;