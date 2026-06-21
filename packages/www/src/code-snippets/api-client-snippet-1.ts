//@ts-nocheck
import axios from 'axios';
import { ListResponse, PaginationParams } from 'react-redux-use-model';
import { Movie } from '@interfaces/Movie';

export const useMovieApiClient = () => {
  const list = async (
    params: PaginationParams,
  ): Promise<ListResponse<Movie>> => {
    const response = await axios.get<ListResponse<Movie>>('/movies', {
      params,
    });

    return response.data;
  };

  const create = async (entity: Movie): Promise<CreateResponse<Movie>> => {
    return axios.post<Movie>('/movies', entity);
  };

  return {
    list,
    create,
  };
};
