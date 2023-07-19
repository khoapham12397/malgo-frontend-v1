import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { handleError } from '../utils/errorHandler';

const useContestSubmissions = (contestId: string | undefined) => {
  const codingContestSubmissionsQuery = useQuery({
    queryKey: ['coding-contest-submissions', contestId],
    queryFn: async () => {
      try {
        const url =
          (import.meta.env.VITE_API_URL_2 as string) +
          `contest/${contestId}/submission`;

        const response = await axios.get(url);

        // sort by submitted_at in descending order
        const sortSubmittedAt = (
          a: CodingSubmissionRecord,
          b: CodingSubmissionRecord
        ) => {
          const dateA = new Date(a.submitted_at);
          const dateB = new Date(b.submitted_at);
          return dateB.getTime() - dateA.getTime();
        };

        const data: CodingSubmissionRecord[] =
          response.data.sort(sortSubmittedAt);

        return data;
      } catch (error: any) {
        handleError(error);
        throw error.message;
      }
    },
    staleTime: 10 * 60 * 1000 // 10 minutes
  });

  return { codingContestSubmissionsQuery };
};

export default useContestSubmissions;
