//@ts-nocheck
import { ListQueryHandler, useModel } from 'react-redux-use-model';
import { EntityName } from '@constants/enums';

const useMovieModel = () => {
  const movieApiClient = useMovieApiClient();
  const model = useModel<
    Movie,
    {
      list: ListQueryHandler<Movie>;
    }
  >({
    entityName: EntityName.Movies,
    config: {
      paginationSizeMultiplier: 5,
    },
    handlers: {
      list: {
        apiFn: movieApiClient.list,
        action: EntityActionType.LIST,
        onSuccess: (response) => {
          console.log('Movie created successfully:', response.data);
        },
        onError: (error) => {
          console.error('Failed to create movie:', error);
        },
      },
    },
  });
};
