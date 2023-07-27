import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';

export const TestLogin = () => {
  const handleSetTestUser = () => {
    toast.success('you are logined as test2 user');
  };
  return <></>;
};
