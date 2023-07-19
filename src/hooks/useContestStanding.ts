import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { handleError } from '../utils/errorHandler';

const useContestStanding = (contestId: string | undefined) => {
  const codingContestStandingQuery = useQuery({
    queryKey: ['coding-contest-standing', contestId],
    queryFn: async () => {
      try {
        const url =
          (import.meta.env.VITE_API_URL_2 as string) +
          `contest/${contestId}/standing`;

        const response = await axios.get(url);

        // sort by rank in ascending order
        const sortRank = (
          a: CodingContestStanding,
          b: CodingContestStanding
        ) => {
          return a.rank - b.rank;
        };

        const data: CodingContestStanding[] = response.data.sort(sortRank);

        return data;
      } catch (error: any) {
        handleError(error);
        throw error.message;
      }
    },
    staleTime: 10 * 60 * 1000 // 10 minutes
  });

  return { codingContestStandingQuery };
};

export default useContestStanding;
