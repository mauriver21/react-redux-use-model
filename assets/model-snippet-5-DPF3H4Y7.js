const e=`//@ts-nocheck
import {
  useModel,
  EntityActionType,
  CreateQueryHandler,
} from 'react-redux-use-model';
import { EntityName } from '@constants/enums';
import { Movie } from '@interfaces/Movie';
import { useMovieApiClient } from '@api-clients/useMovieApiClient';

export const useMovieModel = () => {
  const movieApiClient = useMovieApiClient();
  const model = useModel<
    Movie,
    {
      create: CreateQueryHandler<Movie>;
    }
  >({
    entityName: EntityName.Movies,
    handlers: {
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
