import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../state';

export const ThreadTypeBar = () => {
  const navigate = useNavigate();
  const state = useSelector((state: RootState) => state.threadList);

  return (
    <div className='d-flex' style={{ padding: '0px' }}>
      <div
        className={state.type == 'latest' ? 'tag-chosen' : 'tag-thread'}
        onClick={e => {
          navigate('/threads/' + state.category + '?type=latest');
        }}
      >
        Latest
      </div>
      <div
        className={state.type == 'top' ? 'tag-chosen' : 'tag-thread'}
        onClick={e => {
          navigate('/threads/' + state.category + '?type=top');
        }}
      >
        Popular
      </div>
      <div
        className={state.type == 'oldest' ? 'tag-chosen' : 'tag-thread'}
        onClick={e => {
          navigate('/threads/' + state.category + '?type=oldest');
        }}
      >
        Oldest
      </div>
    </div>
  );
};
