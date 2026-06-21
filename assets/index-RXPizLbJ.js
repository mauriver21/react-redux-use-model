const e=`import { Button } from '@components/Button';
import { createRandomMovie } from '@mocks/fakers';
import { useMovieModel4 } from '@models/useMovieModel4';
import { TableRow, TableCell } from '@mui/material';
import { RootState } from '@store';
import { useSelector } from 'react-redux';
import { Id } from 'react-redux-use-model';
import { Body1, SkeletonLoader } from 'reactjs-shared-ui';

interface MovieUpdateRowProps {
  id: Id;
}

export const MovieUpdateRow: React.FC<MovieUpdateRowProps> = ({ id }) => {
  const movieModel = useMovieModel4();
  const entity = useSelector((state: RootState) =>
    movieModel.selectEntity(state, id),
  );
  const updating = movieModel.updateState.isLoading;

  const update = () => {
    const { id: _, ...rest } = createRandomMovie();
    movieModel.update(entity.id, rest);
  };

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell style={{ width: '75%' }}>
        <SkeletonLoader loading={entity.loading || updating}>
          <Body1 skeletonText={'XXXXXXXXXXX'}>{entity.data?.name}</Body1>
        </SkeletonLoader>
      </TableCell>
      <TableCell style={{ width: '25%', textAlign: 'right' }}>
        <Button onClick={update} disabled={updating}>
          {updating ? 'Updating...' : 'Update'}
        </Button>
      </TableCell>
    </TableRow>
  );
};
`;export{e as default};
