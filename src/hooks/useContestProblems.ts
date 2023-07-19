import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { handleError } from '../utils/errorHandler';

const useCodingContestProblems = (contestId: string | undefined) => {
  const codingContestProblemsQuery = useQuery({
    queryKey: ['coding-contest-problems', contestId],
    queryFn: async () => {
      try {
        const url =
          (import.meta.env.VITE_API_URL_2 as string) +
          `contest/${contestId}/problem/`;

        const response = await axios.get(url);

        const data: CodingContestProblem[] = response.data.sort(
          (a: CodingContestProblem, b: CodingContestProblem) =>
            a.display_order - b.display_order
        );

        return data;
      } catch (error: any) {
        handleError(error);
        throw error.message;
      }
    },
    staleTime: 10 * 60 * 1000 // 10 minutes
  });

  return { codingContestProblemsQuery };
};

export default useCodingContestProblems;
