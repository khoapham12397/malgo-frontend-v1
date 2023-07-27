import { useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useScreen } from 'usehooks-ts';
import api from '../../config/axios2';
import { MemberItem } from '../MemberItem/MemberItem';
import './SearchUserBox.css';

export const SearchUserBox = () => {
  const inpRef = useRef<HTMLInputElement>(null);
  const [foundUser, setFoundUser] = useState<any>(null);

  const handleSearchUser = () => {
    if (!inpRef.current) return;
    const q = inpRef.current.value;
    api
      .get(`/user2/searchbyemail?email=${q}`)
      .then(result => {
        if (result.data.data.user) {
          setFoundUser(result.data.data.user);
        } else setFoundUser(null);
      })
      .catch(error => {});
    //navigate(`/search/thread?q=${q}`);
  };

  return (
    <div style={{ marginTop: '10px', padding: '10px' }}>
      <Form.Control
        type='text'
        className='search-inp-chat-page search-box'
        placeholder='search by email'
        ref={inpRef}
        onChange={handleSearchUser}
      />

      <div>
        {foundUser ? (
          <MemberItem item={{ username: foundUser.username, isOnline: null }} />
        ) : inpRef.current && inpRef.current.value.length > 0 ? (
          'There are no result'
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
