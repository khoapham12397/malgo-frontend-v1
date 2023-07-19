import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { handleError } from '../utils/errorHandler';

const useCodingContestProblem = (
  contestId: string | undefined,
  problemId: string | undefined
) => {
  const codingContestProblemQuery = useQuery({
    queryKey: ['coding-contest-problem', contestId, problemId],
    queryFn: async () => {
      try {
        const url =
          (import.meta.env.VITE_API_URL_2 as string) +
          `contest/${contestId}/problem/${problemId}`;

        const response = await axios.get(url);

        return response.data as CodingContestProblem;
      } catch (error: any) {
        handleError(error);
        throw error.message;
      }
    },
    staleTime: 30 * 60 * 1000 // 30 minutes
  });

  return { codingContestProblemQuery };
};

export default useCodingContestProblem;
