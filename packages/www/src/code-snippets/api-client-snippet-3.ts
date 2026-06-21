//@ts-nocheck
import axios from 'axios';
import { CreateResponse } from 'react-redux-use-model';
import { Movie } from '@interfaces/Movie';

export const useMovieApiClient = () => {
  const create = async (
    entity: Omit<Movie, 'id'>,
  ): Promise<CreateResponse<Movie>> => {
    const response = await axios.post<Movie>('/movies', entity);
    return response.data;
  };

  return {
    create,
  };
};
