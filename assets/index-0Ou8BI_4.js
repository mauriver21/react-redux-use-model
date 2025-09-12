const e=`import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, H5, Stack } from 'reactjs-shared-ui';
import { QueryKey } from '@constants/enums';
import { useMovieModel } from '@models/useMovieModel';
import { createRandomMovie } from '@mocks/fakers';
import { Pagination } from '@components/Pagination';
import { SearchField } from '@components/SearchField';
import { Button } from '@components/Button';
import { MovieItem } from '@components/MovieItem';
import { PaginationParams, useDebounce } from 'react-redux-use-model';

export const MoviesCrud: React.FC = () => {
  const movieModel = useMovieModel();
  const query = useSelector(movieModel.selectPaginatedQuery);
  const [params, setParams] = useState<PaginationParams>({
    _page: 0,
    _size: 10,
    _filter: '',
  });

  const create = () => {
    movieModel.create(createRandomMovie());
  };

  const list = useDebounce((params: Partial<PaginationParams>) => {
    setParams((prev) => ({ ...prev, ...params }));
  });

  useEffect(() => {
    if (params._filter) {
      movieModel.list({
        queryKey: QueryKey.MoviesCrudFiltered,
        paginationParams: params,
        invalidateQuery: { strategy: 'onFilterChange' },
      });
    } else {
      movieModel.list({
        queryKey: QueryKey.MoviesCrud,
        paginationParams: params,
      });
    }
  }, [params]);

  return (
    <Stack p={2} spacing={1}>
      <H5 fontWeight={500}>Movies Crud</H5>
      <Box display="grid" gridTemplateColumns="1fr auto" columnGap={1}>
        <SearchField
          autoComplete="off"
          onChange={(value) => list({ _filter: value })}
        />
        <Button
          sx={{ height: '100%', minWidth: '210px' }}
          color="secondary"
          onClick={create}
          disabled={query.creating}
        >
          {query.creating ? \`Creating Random Movie...\` : \`Create Random Movie\`}
        </Button>
      </Box>
      <Stack spacing={1}>
        {query?.ids?.map((id, index) => (
          <MovieItem
            index={index}
            key={id}
            movieId={id}
            pagination={query?.pagination}
          />
        ))}
      </Stack>
      <Pagination
        page={query?.pagination?.page}
        count={query?.pagination?.totalPages}
        onChange={async (page) =>
          setParams((prev) => ({ ...prev, _page: page }))
        }
      />
    </Stack>
  );
};
`;export{e as default};
