//@ts-nocheck
import {
  useModel,
  EntityActionType,
  UpdateQueryHandler,
} from 'react-redux-use-model';
import { EntityName } from '@constants/enums';
import { Movie } from '@interfaces/Movie';
import { useMovieApiClient } from '@api-clients/useMovieApiClient';

export const useMovieModel = () => {
  const movieApiClient = useMovieApiClient();
  const model = useModel<
    Movie,
    {
      update: UpdateQueryHandler<Movie>;
    }
  >({
    entityName: EntityName.Movies,
    handlers: {
      update: {
        action: EntityActionType.UPDATE,
        apiFn: movieApiClient.update,
        onSuccess: (response) => {
          console.log('Movie updated successfully:', response.data);
        },
        onError: (error) => {
          console.error('Failed to update movie:', error);
        },
      },
    },
  });

  return model;
};
