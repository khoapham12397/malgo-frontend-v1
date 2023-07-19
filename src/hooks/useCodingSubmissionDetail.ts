import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { handleError } from '../utils/errorHandler';

const useCodingSubmissionDetail = (submissionId: string | undefined) => {
  const codingSubmissionDetail = useQuery({
    queryKey: ['coding-submission-detail', submissionId],
    queryFn: async () => {
      try {
        const url =
          (import.meta.env.VITE_API_URL_2 as string) +
          `coding/submission/${submissionId}`;

        const response = await axios.get(url);

        return response.data as CodingSubmission;
      } catch (error: any) {
        handleError(error);
        throw error.message;
      }
    },
    enabled: submissionId !== undefined,
    staleTime: 10 * 60 * 1000 // 10 minutes
  });

  return { codingSubmissionDetail };
};

export default useCodingSubmissionDetail;
