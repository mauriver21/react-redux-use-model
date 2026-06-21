import { Button } from '@components/Button';
import { useMovieModel5 } from '@models/useMovieModel5';
import { TableRow, TableCell } from '@mui/material';
import { RootState } from '@store';
import { useSelector } from 'react-redux';
import { Id } from 'react-redux-use-model';
import { Body1, SkeletonLoader } from 'reactjs-shared-ui';

interface MovieRemoveRowProps {
  id: Id;
}

export const MovieRemoveRow: React.FC<MovieRemoveRowProps> = ({ id }) => {
  const movieModel = useMovieModel5();
  const entity = useSelector((state: RootState) =>
    movieModel.selectEntity(state, id),
  );
  const removing = movieModel.removeState.isLoading;

  const remove = () => {
    movieModel.remove(entity.id);
  };

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell style={{ width: '75%' }}>
        <SkeletonLoader loading={entity.loading || removing}>
          <Body1 skeletonText={'XXXXXXXXXXX'}>{entity.data?.name}</Body1>
        </SkeletonLoader>
      </TableCell>
      <TableCell style={{ width: '25%', textAlign: 'right' }}>
        <Button onClick={remove} disabled={removing}>
          {removing ? 'Removing...' : 'Remove'}
        </Button>
      </TableCell>
    </TableRow>
  );
};
