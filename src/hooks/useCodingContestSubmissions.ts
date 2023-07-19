import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { handleError } from '../utils/errorHandler';

const useCodingContestSubmissions = (
  contestId: string | undefined,
  problemId: string | undefined
) => {
  const codingContestSubmissionsQuery = useQuery({
    queryKey: ['coding-contest-submissions', contestId, problemId],
    queryFn: async () => {
      try {
        const username = localStorage.getItem('username');

        const url =
          (import.meta.env.VITE_API_URL_2 as string) +
          `contest/${contestId}/problem/${problemId}/user/${username}/submission`;

        const response = await axios.get(url);

        // Sort by submission time
        const data: CodingContestSubmission[] = response.data.sort(
          (a: CodingContestSubmission, b: CodingContestSubmission) => {
            return (
              new Date(b.submitted_at).getTime() -
              new Date(a.submitted_at).getTime()
            );
          }
        );

        return data;
      } catch (error: any) {
        handleError(error);
        throw error.message;
      }
    },
    staleTime: 60 * 1000 // 1 minute
  });

  return { codingContestSubmissionsQuery };
};

export default useCodingContestSubmissions;
