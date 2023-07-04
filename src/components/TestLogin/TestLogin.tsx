import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../contexts/UserContext';

export const TestLogin = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSetTestUser = () => {
    setUser({ username: 'test2', email: 'test2@gmail.com' });
    toast.success('you are logined as test2 user');
  };
  return (
    <div>
      {user ? (
        <div>Wellcome {user.username.split('@')[0]}</div>
      ) : (
        <Button onClick={handleSetTestUser}>Login as test user</Button>
      )}
    </div>
  );
};
