import { useAuth0 } from '@auth0/auth0-react';
import { handleError } from '../utils/errorHandler';
import axiosInstance from '../config/axiosInstance';
import { toast } from 'react-hot-toast';

const useDeleteThread = () => {
  const { getAccessTokenSilently } = useAuth0();

  const deleteThread = async (thread: Thread) => {
    try {
      const accessToken = await getAccessTokenSilently();
      await axiosInstance.delete(`admin/thread/${thread.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      toast.success(`Thread ${thread.id} deleted!`);
    } catch (error: any) {
      handleError(error);
      throw error;
    }
  };

  return { deleteThread };
};

export default useDeleteThread;
