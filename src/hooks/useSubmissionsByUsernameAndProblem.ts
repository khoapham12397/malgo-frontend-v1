import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { handleError } from '../utils/errorHandler';

const useSubmissionsByUsernameAndProblem = (
  problemId: string | undefined,
  limit: number = 20,
  offset: number = 0
) => {
  const submissionsByUsernameAndProblemQuery = useQuery({
    queryKey: ['submissions-by-username-and-problem', problemId],
    queryFn: async () => {
      try {
        const username = localStorage.getItem('username');
        const url =
          (import.meta.env.VITE_API_URL_2 as string) +
          `coding/submission/user/${username}/problem/${problemId}`;
        const response = await axios.get(url, {
          params: { limit, offset }
        });
        // Sort by submission time
        const data: CodingSubmission[] = response.data.sort(
          (a: CodingSubmission, b: CodingSubmission) => {
            return (
              new Date(b.SubmittedAt).getTime() -
              new Date(a.SubmittedAt).getTime()
            );
          }
        );
        return data;
      } catch (error: any) {
        handleError(error);
        throw error.message;
      }
    },
    enabled: problemId !== undefined,
    staleTime: 60 * 1000 // 1 minute
  });

  return { submissionsByUsernameAndProblemQuery };
};

export default useSubmissionsByUsernameAndProblem;
