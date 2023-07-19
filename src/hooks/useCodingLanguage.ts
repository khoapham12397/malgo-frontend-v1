import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { handleError } from '../utils/errorHandler';

const useCodingLanguage = () => {
  const codingLanguageQuery = useQuery({
    queryKey: ['coding-language'],
    queryFn: async () => {
      try {
        const response = await axios.get(
          (import.meta.env.VITE_API_URL_2 as string) + 'coding/language'
        );
        return response.data as CodingLanguage[];
      } catch (error: any) {
        handleError(error);
        throw error.message;
      }
    },
    staleTime: Infinity
  });

  return { codingLanguageQuery };
};

export default useCodingLanguage;
