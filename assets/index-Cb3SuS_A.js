const e=`import { EntityName } from '@constants/enums';
import { useMovieApiClient } from '@api-clients/useMovieApiClient';
import {
  useModel,
  EntityActionType,
  ListQueryHandler,
  UpdateQueryHandler,
} from 'react-redux-use-model';
import { Movie } from '@interfaces/Movie';

export const useMovieModel4 = () => {
  const movieApiClient = useMovieApiClient();
  const model = useModel<
    Movie,
    {
      list: ListQueryHandler<Movie>;
      update: UpdateQueryHandler<Movie>;
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
`;export{e as default};
