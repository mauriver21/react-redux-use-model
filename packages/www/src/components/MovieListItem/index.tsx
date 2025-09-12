import React from 'react';
import { useMovieModel } from '@models/useMovieModel';
import { RootState } from '@store';
import { useSelector } from 'react-redux';
import { Id } from 'react-redux-use-model';
import { TableRow, TableCell } from '@mui/material';
import { SkeletonLoader, Body1 } from 'reactjs-shared-ui';

export interface MovieListItemProps {
  id: Id | undefined;
}

export const MovieListItem: React.FC<MovieListItemProps> = ({ id }) => {
  const movieModel = useMovieModel();
  const entity = useSelector((state: RootState) =>
    movieModel.selectEntity(state, id)
  );
  return (
    <TableRow
      key={id}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell>
        <SkeletonLoader loading={entity.loading}>
          <Body1 skeletonText="XXXXXXXXXXX">{entity.data?.name}</Body1>
        </SkeletonLoader>
      </TableCell>
    </TableRow>
  );
};
