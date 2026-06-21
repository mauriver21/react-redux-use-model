const e=`import { EntityName } from '@constants/enums';
import { useMovieApiClient } from '@api-clients/useMovieApiClient';
import {
  useModel,
  EntityActionType,
  CreateQueryHandler,
  ListQueryHandler,
} from 'react-redux-use-model';
import { Movie } from '@interfaces/Movie';

export const useMovieModel3 = () => {
  const movieApiClient = useMovieApiClient();
  const model = useModel<
    Movie,
    {
      list: ListQueryHandler<Movie>;
      create: CreateQueryHandler<Movie>;
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
      create: {
        action: EntityActionType.CREATE,
        apiFn: movieApiClient.create,
        onSuccess: (response) => {
          console.log('Movie created successfully:', response.data);
        },
        onError: (error) => {
          console.error('Failed to create movie:', error);
        },
      },
    },
  });

  return model;
};
`;export{e as default};
