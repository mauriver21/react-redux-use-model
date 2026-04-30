const e=`import { useEffect } from 'react';
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
  const moviePaginatedQuery = useSelector(movieModel.selectPaginatedQuery);
  const {
    paginationParams = { _page: 0, _size: 10 },
    creating,
    ids,
    pagination,
  } = moviePaginatedQuery;

  const create = () => {
    movieModel.create(createRandomMovie());
  };

  const list = (params: PaginationParams) => {
    movieModel.list({
      queryKey: QueryKey.MoviesCrud,
      paginationParams: params,
    });
  };

  const filter = useDebounce(list);

  useEffect(() => {
    list(paginationParams);
  }, []);

  return (
    <Stack p={2} spacing={1}>
      <H5 fontWeight={500}>Movies Crud</H5>
      <Box display="grid" gridTemplateColumns="1fr auto" columnGap={1}>
        <SearchField
          autoComplete="off"
          onChange={(value) =>
            filter({ ...paginationParams, _page: 0, _filter: value })
          }
        />
        <Button
          sx={{ height: '100%', minWidth: '210px' }}
          color="secondary"
          onClick={create}
          disabled={creating}
        >
          {creating ? \`Creating Random Movie...\` : \`Create Random Movie\`}
        </Button>
      </Box>
      <Stack spacing={1}>
        {ids?.map((id, index) => (
          <MovieItem
            index={index}
            key={id}
            movieId={id}
            pagination={pagination}
          />
        ))}
      </Stack>
      <Pagination
        page={pagination?.page}
        count={pagination?.totalPages}
        onChange={(_page) => {
          list({ ...paginationParams, _page });
        }}
      />
    </Stack>
  );
};
`;export{e as default};
