const e=`import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { QueryKey } from '@constants/enums';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Pagination } from '@components/Pagination';
import { Button } from '@components/Button';
import { Stack } from 'reactjs-shared-ui';
import { useMovieModel3 } from '@models/useMovieModel3';
import { MovieListItem } from '@components/MovieListItem';
import { createRandomMovie } from '@mocks/fakers';
import { PaginationParams } from 'react-redux-use-model';

export const MovieCreateExample1: React.FC = () => {
  const movieModel = useMovieModel3();
  const query = useSelector(movieModel.selectPaginatedQuery);
  const { paginationParams = { _page: 0, _size: 10 }, creating, ids } = query;

  const create = () => {
    movieModel.create(createRandomMovie());
  };

  const list = (params: PaginationParams) => {
    movieModel.list({
      queryKey: QueryKey.MovieCreateExample1,
      paginationParams: params,
    });
  };

  useEffect(() => {
    list(paginationParams);
  }, []);

  return (
    <Stack spacing={2}>
      {/* Creation form */}
      <Stack pt={2}>
        <Button
          sx={{ height: '40px', minWidth: '150px' }}
          onClick={create}
          disabled={creating}
        >
          {creating ? 'Creating...' : 'Create Movie'}
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ids?.map((id) => (
              <MovieListItem key={id} id={id} />
            ))}
          </TableBody>
        </Table>
        <Pagination
          page={query?.pagination?.page}
          count={query?.pagination?.totalPages}
          onChange={(_page) => {
            list({ ...paginationParams, _page });
          }}
        />
      </TableContainer>
    </Stack>
  );
};
`;export{e as default};
