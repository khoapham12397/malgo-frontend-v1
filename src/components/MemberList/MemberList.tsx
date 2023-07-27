import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import { getGroupMembers } from '../../state/actions/chatAction';
import { getUsernameFromStorage } from '../../utils/getUser';
import { MemberItem } from '../MemberItem/MemberItem';

export const MemberList = () => {
  const currentGroupId = useSelector(
    (state: RootState) => state.chat.currentGroupId
  );
  const myUsername = getUsernameFromStorage();
  const members = useSelector((state: RootState) => {
    const x = state.chat.groupUsers.filter(
      item => item.groupId == currentGroupId
    );
    if (x.length > 0) return x[0].users;
    else return null;
  });
  const onlineUsers = members
    ? members.filter(
        item => item.isOnline == true && item.username !== myUsername
      )
    : null;
  const offlineUsers = members
    ? members.filter(
        item => item.isOnline != true && item.username !== myUsername
      )
    : null;

  const groupUsers = useSelector((state: RootState) => state.chat.groupUsers);

  useEffect(() => {
    if (myUsername && currentGroupId) {
      if (
        groupUsers.filter(item => item.groupId === currentGroupId).length == 0
      )
        getGroupMembers(currentGroupId, myUsername);
    }
  }, [currentGroupId]);

  return (
    <div className='member-list'>
      <div className='member-list-title'>Online List</div>
      {onlineUsers
        ? onlineUsers.map(item => (
            <MemberItem key={item.username} item={item} />
          ))
        : ''}
      <div className='member-list-title'>Offline List</div>
      {offlineUsers
        ? offlineUsers.map(item => (
            <MemberItem key={item.username} item={item} />
          ))
        : ''}
    </div>
  );
};
