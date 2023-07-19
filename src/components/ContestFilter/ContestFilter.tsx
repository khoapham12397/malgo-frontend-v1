import { FunctionComponent, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import MultiRangeSlider from 'multi-range-slider-react';
import './ContestFilter.css';

interface Props {
  onSubmit: (term: string, minRange: number, maxRange: number) => void;
}

const ContestFilter: FunctionComponent<Props> = ({ onSubmit }) => {
  const [term, setTerm] = useState<string>('');
  const [minRange, setMinRange] = useState<number>(0);
  const [maxRange, setMaxRange] = useState<number>(3000);

  const handleClickFind = () => {
    onSubmit(term, minRange, maxRange);
  };

  const handleClickReset = () => {
    setTerm('');
    setMinRange(0);
    setMaxRange(3000);
    onSubmit('', 0, 3000);
  };

  return (
    <div className='contest-filter-container'>
      <div className='contest-filter-header'>Contest Filter</div>
      <div className='contest-filter-item'>
        <Form.Label>Search</Form.Label>
        <Form.Control
          type='text'
          placeholder='Search'
          value={term}
          onChange={e => setTerm(e.target.value)}
        />
      </div>
      <div className='contest-filter-item'>
        <Form.Label>
          Range of Rating{' '}
          {minRange === 0 && maxRange === 3000 ? (
            ''
          ) : (
            <span className='contest-filter-range-rating'>
              {`(${minRange} - ${maxRange})`}
            </span>
          )}
        </Form.Label>
        <MultiRangeSlider
          className='diff-range'
          ruler='false'
          min={0}
          max={3000}
          step={5}
          minValue={minRange}
          maxValue={maxRange}
          onChange={e => {
            setMinRange(e.minValue);
            setMaxRange(e.maxValue);
          }}
        />
      </div>
      <div className='d-flex justify-content-around mt-2'>
        <Button
          onClick={handleClickFind}
          style={{ backgroundColor: '#3b5998', border: '#3b5998' }}
        >
          Find
        </Button>
        <Button
          onClick={handleClickReset}
          style={{ backgroundColor: '#3b5998', border: '#3b5998' }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ContestFilter;
