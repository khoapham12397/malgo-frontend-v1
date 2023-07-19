import { OAuthError } from '@auth0/auth0-react';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-hot-toast';

export const handleError = async (error: any) => {
  console.error('Error:', error.message);

  if (error instanceof OAuthError) {
    switch (error.error) {
      case 'login_required':
        toast.error("You're not logged in!");
        break;
      case 'consent_required':
        toast.error('You are not allowed to access!');
        break;
      default:
        toast.error('Something went wrong!');
    }
  } else {
    console.error("Error's details:", error.response);

    const { message } = error.response.data;

    switch (error.response.status) {
      case StatusCodes.BAD_REQUEST:
        toast.error(message.length > 100 ? 'Bad request!' : message);
        break;
      case StatusCodes.UNAUTHORIZED:
      case StatusCodes.FORBIDDEN:
        toast.error(message.length > 100 ? 'You are not allowed!' : message);
        break;
      case StatusCodes.NOT_FOUND:
        toast.error(message.length > 100 ? 'Resource not found!' : message);
        break;
      case StatusCodes.INTERNAL_SERVER_ERROR:
        toast.error(message.length > 100 ? 'Internal server error!' : message);
        break;
      default:
        toast.error(message.length > 100 ? 'Something went wrong!' : message);
    }
  }
};
