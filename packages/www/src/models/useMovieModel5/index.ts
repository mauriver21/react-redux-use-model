import { EntityName } from '@constants/enums';
import { useMovieApiClient } from '@api-clients/useMovieApiClient';
import {
  useModel,
  EntityActionType,
  ListQueryHandler,
  RemoveQueryHandler,
} from 'react-redux-use-model';
import { Movie } from '@interfaces/Movie';

export const useMovieModel5 = () => {
  const movieApiClient = useMovieApiClient();
  const model = useModel<
    Movie,
    {
      list: ListQueryHandler<Movie>;
      remove: RemoveQueryHandler<Movie>;
    }
  >({
    entityName: EntityName.Movies,
    handlers: {
      list: {
        apiFn: movieApiClient.list,
        action: EntityActionType.LIST,
        onSuccess: (response) => {
          console.log('Movies listed successfully:', response.data);
        },
        onError: (error) => {
          console.error('Failed to list movies:', error);
        },
      },
      remove: {
        action: EntityActionType.REMOVE,
        apiFn: movieApiClient.remove,
        onSuccess: (response) => {
          console.log('Movie removed successfully:', response.data);
        },
        onError: (error) => {
          console.error('Failed to remove movie:', error);
        },
      },
    },
  });

  return model;
};
