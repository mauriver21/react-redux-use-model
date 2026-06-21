const e=`//@ts-nocheck
import axios from 'axios';
import { RemoveResponse, Id } from 'react-redux-use-model';
import { Movie } from '@interfaces/Movie';

export const useMovieApiClient = () => {
  const remove = async (id: Id): Promise<RemoveResponse<Movie>> => {
    const response = await axios.delete<Movie>(\`/movies/\${id}\`);
    return response.data;
  };

  return {
    remove,
  };
};
`;export{e as default};
