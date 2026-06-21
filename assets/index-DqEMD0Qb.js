const a=`import { useEffect } from 'react';
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
import { Stack } from 'reactjs-shared-ui';
import { useMovieModel1 } from '@models/useMovieModel1';
import { PaginationStats } from '@components/PaginationStats';
import { MovieListItem } from '@components/MovieListItem';
import { PaginationParams } from 'react-redux-use-model';

export const MoviesListExample1: React.FC = () => {
  const movieModel = useMovieModel1();
  const query = useSelector(movieModel.selectPaginatedQuery);
  const { paginationParams = { _page: 0, _size: 10 }, ids, pagination } = query;

  const list = (params: PaginationParams) => {
    movieModel.list({
      queryKey: QueryKey.MoviesListExample1,
      paginationParams: params,
    });
  };

  useEffect(() => {
    list(paginationParams);
  }, []);

  return (
    <Stack spacing={1}>
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
          page={pagination?.page}
          count={pagination?.totalPages}
          onChange={(_page) => {
            list({ ...paginationParams, _page });
          }}
        />
      </TableContainer>
      <PaginationStats query={query} params={paginationParams} />
    </Stack>
  );
};
`;export{a as default};
