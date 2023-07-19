import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { handleError } from '../utils/errorHandler';

const useContests = () => {
  const contestsQuery = useQuery({
    queryKey: ['list-contests'],
    queryFn: async () => {
      try {
        const username = localStorage.getItem('username');
        const withUser = username ? `username/${username}` : '';
        const url =
          (import.meta.env.VITE_API_URL_2 as string) + `contest/${withUser}`;

        const response = await axios.get(url);
        const { current, future, past } = response.data;

        const sortStartTime = (a: AlgorithmContest, b: AlgorithmContest) => {
          return (
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
          );
        };

        return {
          current: current.sort(sortStartTime) as AlgorithmContest[] | null,
          future: future.sort(sortStartTime) as AlgorithmContest[] | null,
          past: past.sort(sortStartTime) as AlgorithmContest[] | null
        };
      } catch (error: any) {
        handleError(error);
        throw error.message;
      }
    },
    staleTime: 10 * 60 * 1000 // 10 minutes
  });

  return { contestsQuery };
};

export default useContests;
