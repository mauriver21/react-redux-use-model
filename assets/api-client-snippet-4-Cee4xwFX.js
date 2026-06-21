const e=`//@ts-nocheck
import axios from 'axios';
import { UpdateResponse, Id } from 'react-redux-use-model';
import { Movie } from '@interfaces/Movie';

export const useMovieApiClient = () => {
  const update = async (
    id: Id,
    entity: Movie,
  ): Promise<UpdateResponse<Movie>> => {
    const response = await axios.put<Movie>(\`/movies/\${id}\`, entity);
    return response.data;
  };

  return {
    update,
  };
};
`;export{e as default};
