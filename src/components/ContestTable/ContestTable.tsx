import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { FunctionComponent, useState } from 'react';
import { Table } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { AiOutlineCheck } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { ContestTableHeader } from '../../config/enums';
import { getDuration } from '../../utils/getDuration';
import ModalRegisterContest from '../ModalRegisterContest/ModalRegisterContest';
import './ContestTable.css';

interface Props {
  contests: AlgorithmContest[] | undefined;
  header: string;
  reloadContests?: () => void;
}

const ContestTable: FunctionComponent<Props> = ({
  contests,
  header,
  reloadContests
}) => {
  const [contest, setContest] = useState<AlgorithmContest | null>(
    contests ? contests[0] : null
  );
  const [showModalRegisterContest, setShowModalRegisterContest] =
    useState<boolean>(false);
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const handleClickContestLink = (contest: AlgorithmContest) => {
    if (header === ContestTableHeader.currentContest) {
      if (!isAuthenticated) {
        toast.error('You must login to join the contest!');
        return;
      }
      // If the user has already registered for the contest, then navigate to the contest page.
      // Otherwise, toast error message.
      if (!contest.has_register) {
        toast.error('The contest has already started!');
        return;
      }
      navigate(`/contest/${contest.id}`);
    } else if (header === ContestTableHeader.upcomingContest) {
      // If the user has already registered for the contest, then navigate to the contest page.
      // Otherwise, show the modal to register for the contest.
      setContest(contest);
      setShowModalRegisterContest(true);
    } else {
      // header === ContestTableHeader.pastContest
      navigate(`/contest/${contest.id}`);
    }
  };

  const handleClickCancel = () => {
    setShowModalRegisterContest(false);
  };

  const handleClickRegister = async () => {
    if (!isAuthenticated) {
      toast.error('You must login to register for the contest!');
      return;
    }
    if (contest?.has_register) {
      toast.error('You have already registered for this contest!');
      return;
    }

    const username = localStorage.getItem('username');
    const url =
      (import.meta.env.VITE_API_URL_2 as string) +
      `contest/${contest?.id}/username/${username}/register`;

    const response = await axios.post(url);

    // reload the page to update the contest table
    if (response.status === 200 || response.status === 201) {
      toast.success('Register successfully!');
      setShowModalRegisterContest(false);
      reloadContests?.();
    }
  };

  const handleClickUnregister = async () => {
    const username = localStorage.getItem('username');
    const url =
      (import.meta.env.VITE_API_URL_2 as string) +
      `contest/${contest?.id}/username/${username}/register`;

    const response = await axios.delete(url);

    // reload the page to update the contest table
    if (response.status === 200 || response.status === 201) {
      toast.success('De-register successfully!');
      setShowModalRegisterContest(false);
      reloadContests?.();
    }
  };

  return (
    <div className='contest-table-container'>
      <ModalRegisterContest
        showModalRegisterContest={showModalRegisterContest}
        contest={contest}
        handleClickCancel={handleClickCancel}
        handleClickRegister={handleClickRegister}
        handleClickUnregister={handleClickUnregister}
      />
      <h3 className='contest-table-header mb-3'>{header}</h3>
      <Table striped bordered hover responsive size='sm'>
        <thead className='contest-table-title'>
          <tr>
            <th style={{ width: '20%' }}>Start Time</th>
            <th style={{ width: '45%' }}>Contest Name</th>
            <th style={{ width: '10%' }}>Duration</th>
            <th style={{ width: '15%' }}>Rating</th>
            <th style={{ width: '10%' }}>Registered</th>
          </tr>
        </thead>
        <tbody>
          {contests?.map((contest: AlgorithmContest) => (
            <tr key={contest.id}>
              <td>{new Date(contest.start_time).toLocaleString()}</td>
              <td>
                <div
                  className='contest-table-link'
                  onClick={() => {
                    handleClickContestLink(contest);
                  }}
                >
                  {contest.name}
                </div>
              </td>
              <td>{getDuration(contest.duration)}</td>
              <td>
                {contest.rating_floor} - {contest.rating_ceil}
              </td>
              <td className='contest-table-registered'>
                {contest.has_register ? (
                  <AiOutlineCheck style={{ color: 'green' }} />
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ContestTable;
