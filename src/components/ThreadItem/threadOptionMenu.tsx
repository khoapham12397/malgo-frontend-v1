import { useContext, useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { BiPlusCircle } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { getRelationship, requestFriend } from '../../state/actions/chatAction';
import { getUsernameFromStorage } from '../../utils/getUser';
import ModalEditThread from '../ThreadModal/modalEditThread';

type Props = {
  threadData: Thread;
};
const RelTwoUser= {
  NONE: 'NONE',
  FRIEND: 'FRIEND',
  ONE_REQUEST_TWO: 'ORT',
  TWO_REQUEST_ONE: 'TRO',
}


export const ThreadOptionMenu = ({ threadData }: Props) => {
  const [myThread, setMyThread] = useState(false);
  const [relationship, setRelationship] = useState<string|null>(null);
  const myUsername = getUsernameFromStorage();
  useEffect(()=>{
    
    if(myUsername) {
      getRelationship(myUsername,threadData.author.username)
      .then(relationship=>{
        //console.log(`relationship: ${relationship}`);
        setRelationship(relationship);
      });     
    }
  },[myUsername,threadData.author.username]);

  useEffect(() => {
    if (!myUsername) return;
    if (threadData.author.username === myUsername) {
      setMyThread(true);
    }
    else setMyThread(false);
  }, [threadData]);

  const handleAddFriend = (username: string)=>{
    if(myUsername) {
      requestFriend(myUsername , username)
      .then(result=>{
        toast.success("Send Friend Request Successed");
        setRelationship(RelTwoUser.ONE_REQUEST_TWO);
      })
    }
  }
  return (
    <Dropdown>
      <Dropdown.Toggle
        variant='primary'
        style={{ backgroundColor: 'white', border: 'none', padding: '0px' }}
      >
        <BsThreeDotsVertical
          style={{ color: 'black', marginRight: '-20px' }}
          size={20}
        />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item>
          {myThread ? <ModalEditThread threadData={threadData} /> : 'Stored'}
        </Dropdown.Item>
        <Dropdown.Item >
          {relationship==RelTwoUser.NONE?<div onClick={()=>handleAddFriend(threadData.author.username)}><BiPlusCircle/> Add friend</div>:
          relationship== RelTwoUser.FRIEND?"Chat":
          relationship==RelTwoUser.ONE_REQUEST_TWO?"Sent Friend Request":
          "Accept friend request"
          }

        </Dropdown.Item>
        <Dropdown.Item href='#/action-3'>Something else</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
