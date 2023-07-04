import { FunctionComponent } from 'react';
import Logout from '../../components/Logout/Logout';
import Spinner from '../../components/Spinner/Spinner';
import useUserProfile from '../../hooks/useUserProfile';

const Profile: FunctionComponent = () => {
  const { userProfileQuery } = useUserProfile();

  if (userProfileQuery.isLoading) return <Spinner />;
  

  if (userProfileQuery.isError)
    return <pre>{JSON.stringify(userProfileQuery.error)}</pre>;

  return (
    <div>
      <img
        src={userProfileQuery.data.picture}
        alt={userProfileQuery.data.name}
      />
      <h2>{userProfileQuery.data.email}</h2>
      <p>{userProfileQuery.data.name}</p>

      <Logout />
    </div>
  );
};

export default Profile;
