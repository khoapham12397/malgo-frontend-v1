import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { handleError } from '../utils/errorHandler';

const useCodingContestSubmissionDetail = (
  contestId: string | undefined,
  submissionId: string | undefined
) => {
  const codingContestSubmissionDetailQuery = useQuery({
    queryKey: ['coding-contest-submission-detail', contestId, submissionId],
    queryFn: async () => {
      try {
        const url =
          (import.meta.env.VITE_API_URL_2 as string) +
          `contest/${contestId}/submission/${submissionId}`;

        const response = await axios.get(url);

        return response.data as CodingContestSubmission;
      } catch (error: any) {
        handleError(error);
        throw error.message;
      }
    },
    staleTime: 10 * 60 * 1000 // 10 minutes
  });

  return { codingContestSubmissionDetailQuery };
};

export default useCodingContestSubmissionDetail;
