import { FunctionComponent } from 'react';
import Loader from '../Loader/Loader';
import './Spinner.css';

const Spinner: FunctionComponent = () => {
  return (
    <div>
      <div className='loading'>
        <Loader />
      </div>
    </div>
  );
};

export default Spinner;
