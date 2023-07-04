import { useAuth0 } from '@auth0/auth0-react';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import axiosInstance from '../../config/axiosInstance';
import useUserAuth from '../../hooks/useUserAuth';
import { handleError } from '../../utils/errorHandler';
import './Home.css';

const Home: FunctionComponent = () => {
  const { isAuthenticated, userAuthQuery } = useUserAuth();
  const { getAccessTokenSilently } = useAuth0(); // TODO: just keep this for testing private button, will be removed later

  // TODO: just keep this for testing private button, will be removed later
  const handleClickPrivate = async () => {
    try {
      const accessToken = await getAccessTokenSilently();

      const response = await axiosInstance.get('admin/users', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log(response.data);
    } catch (error: any) {
      handleError(error);
      return error.message;
    }
  };
  console.log('vao init home page');
  console.log('isAuthenticated: ' + isAuthenticated);
  if (isAuthenticated && userAuthQuery.isLoading) return <Spinner />;

  if (userAuthQuery.isError)
    return <pre>{JSON.stringify(userAuthQuery.error)}</pre>;

  return (
    <div className='home-container'>
      <Link to='coding'>Coding Problem</Link>
      <Link to='math'>Math Problem</Link>
      <Link to='contest'>Contest</Link>
      <Link to='discussion'>Discussion</Link>
      <Link to='rank'>Ranking</Link>
      <button onClick={handleClickPrivate}>
        Private button (Get All Users - Admin Role)
      </button>
    </div>
  );
};

export default Home;
