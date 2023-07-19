import { DatePicker, DatePickerProps, TimePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import { FunctionComponent } from 'react';
import './AdminCreateContest.css';

interface Props {
  contestName: React.RefObject<HTMLInputElement>;
  contestDuration: React.RefObject<HTMLInputElement>;
  contestRatingFloor: React.RefObject<HTMLInputElement>;
  contestRatingCeil: React.RefObject<HTMLInputElement>;
  handleChangeStartDate: DatePickerProps['onChange'];
  handleChangeStartTime: (time: Dayjs | null, timeString: string) => void;
}

const AdminCreateContest: FunctionComponent<Props> = ({
  contestName,
  contestDuration,
  contestRatingFloor,
  contestRatingCeil,
  handleChangeStartDate,
  handleChangeStartTime
}) => {
  return (
    <div className='admin-create-contest-container'>
      <h1 className='admin-create-contest-header'>Create a new contest</h1>
      <div className='admin-create-contest-create-contest'>
        <form className='admin-create-contest-form-container'>
          <div className='admin-create-contest-form-group'>
            <div className='admin-create-contest-form-item'>
              <label className='admin-create-contest-form-label'>
                Contest name
              </label>
              <input
                className='admin-create-contest-form-input'
                type='text'
                required
                ref={contestName}
              />
            </div>

            <div className='admin-create-contest-form-item'>
              <label className='admin-create-contest-form-label'>
                Start date
              </label>
              <DatePicker
                className='admin-create-contest-form-input'
                onChange={handleChangeStartDate}
              />
            </div>

            <div className='admin-create-contest-form-item'>
              <label className='admin-create-contest-form-label'>
                Start time
              </label>
              <TimePicker
                className='admin-create-contest-form-input'
                onChange={handleChangeStartTime}
              />
            </div>

            <div className='admin-create-contest-form-item'>
              <label className='admin-create-contest-form-label'>
                Contest duration (in minutes)
              </label>
              <input
                className='admin-create-contest-form-input'
                type='number'
                required
                min={1}
                ref={contestDuration}
              />
            </div>

            <div className='admin-create-contest-form-item'>
              <label className='admin-create-contest-form-label'>
                Rating Floor
              </label>
              <input
                className='admin-create-contest-form-input'
                type='number'
                required
                min={0}
                ref={contestRatingFloor}
              />
            </div>

            <div className='admin-create-contest-form-item'>
              <label className='admin-create-contest-form-label'>
                Rating Ceiling
              </label>
              <input
                className='admin-create-contest-form-input'
                type='number'
                required
                min={0}
                ref={contestRatingCeil}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateContest;
