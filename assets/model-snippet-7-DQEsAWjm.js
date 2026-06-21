const e=`//@ts-nocheck
import {
  useModel,
  EntityActionType,
  RemoveQueryHandler,
} from 'react-redux-use-model';
import { EntityName } from '@constants/enums';
import { Movie } from '@interfaces/Movie';
import { useMovieApiClient } from '@api-clients/useMovieApiClient';

export const useMovieModel = () => {
  const movieApiClient = useMovieApiClient();
  const model = useModel<
    Movie,
    {
      remove: RemoveQueryHandler<Movie>;
    }
  >({
    entityName: EntityName.Movies,
    handlers: {
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
`;export{e as default};
