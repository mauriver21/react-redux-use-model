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
import { Stack } from 'reactjs-shared-ui';
import { useMovieModel4 } from '@models/useMovieModel4';
import { PaginationParams } from 'react-redux-use-model';
import { MovieUpdateRow } from '@components/MovieUpdateRow';

export const MovieUpdateExample1: React.FC = () => {
  const movieModel = useMovieModel4();
  const query = useSelector(movieModel.selectPaginatedQuery);
  const { paginationParams = { _page: 0, _size: 10 }, ids, pagination } = query;

  const list = (params: PaginationParams) => {
    movieModel.list({
      queryKey: QueryKey.MovieUpdateExample1,
      paginationParams: params,
    });
  };

  useEffect(() => {
    list(paginationParams);
  }, []);

  return (
    <Stack spacing={2}>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ids?.map((id) => (
              <MovieUpdateRow key={id} id={id} />
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
    </Stack>
  );
};
`;export{e as default};
