'use client';

import { ReactNode, useMemo, useState } from 'react';
import { SearchInput } from '@/components/search-input';

type SearchableListShellProps<T> = {
  rows: T[];
  placeholder: string;
  getSearchText: (row: T) => string;
  render: (rows: T[]) => ReactNode;
};

export function SearchableListShell<T>({ rows, placeholder, getSearchText, render }: SearchableListShellProps<T>) {
  const [query, setQuery] = useState('');

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return rows;
    }

    return rows.filter((row) => getSearchText(row).toLowerCase().includes(normalizedQuery));
  }, [getSearchText, query, rows]);

  return (
    <>
      <section>
        <SearchInput placeholder={placeholder} value={query} onChange={setQuery} />
      </section>
      {render(filteredRows)}
    </>
  );
}
