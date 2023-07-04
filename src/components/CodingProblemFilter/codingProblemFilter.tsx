import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state';
import MultiRangeSlider from 'multi-range-slider-react';
import { Dispatch } from '@reduxjs/toolkit';
import { fetchCProblems } from '../../state/actions/codingProblemListAction';
import './codingProblemFilter.css';

type TypeTagProps = {
  id: string;
  name: string;
  ind: number;
  removeTypeTag: (ind: number) => void;
};

function TypeTag({ id, name, ind, removeTypeTag }: TypeTagProps) {
  return (
    <div className='tag-item'>
      <button style={{ border: 'none' }} onClick={e => removeTypeTag(ind)}>
        x
      </button>
      <span style={{ fontSize: '14px' }}>{name}</span>
    </div>
  );
}

export const CodingProblemFilter = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const problemTags = useSelector(
    (state: RootState) => state.codingProblemList.problemTags
  );
  const problemCategories = useSelector(
    (state: RootState) => state.codingProblemList.problemCategories
  );
  const [category, setCategory] = useState('0');
  const [q, setQ] = useState('');

  const [startDif, setStartDif] = useState(0);
  const [endDif, setEndDif] = useState(400);

  const handleInput = (e: any) => {
    setStartDif(e.minValue);
    setEndDif(e.maxValue);
  };

  const handleAddTag = (e: any) => {
    const ind = e.currentTarget.value;
    console.log('add tag: ind= ' + ind);
    if (chosenTypes.includes(ind) || ind == 0) return;
    let lst = [...chosenTypes];
    lst.push(ind);
    setChosenTypes(lst);
  };

  const handleChangeCategory = (e: any) => {
    console.log('set category to :' + e.currentTarget.value);
    setCategory(e.currentTarget.value);
  };

  const handleFind = (e: any) => {
    let tagList: Array<string> = chosenTypes.map(
      item => problemCategories[item].id
    );

    const params: GetProblemsParam = {
      category: category == '0' ? null : (category as string),
      startDif: startDif == 0 ? null : startDif,
      endDif: endDif == 400 ? null : endDif,
      page: 1,
      q: q.length > 0 ? q : null,
      tagList: tagList
    };
    dispatch(fetchCProblems(params));
  };

  const removeTypeTag = (ind: number) => {
    console.log('remove ' + ind);
    if (chosenTypes.includes(ind as never)) {
      var lst = [...chosenTypes];
      let index = lst.indexOf(ind as never);
      lst.splice(index, 1);
      setChosenTypes(lst);
    }
  };

  const [chosenTypes, setChosenTypes] = useState([] as Array<number>);

  return (
    <div className='filter-container'>
      <div className='filter-header'>Problem Filter</div>
      <div className='filter-item'>
        <Form.Label>Search</Form.Label>
        <Form.Control
          type='text'
          placeholder='Search'
          onChange={e => setQ(e.currentTarget.value)}
        />
      </div>
      <div className='filter-item'>
        <Form.Label>Category</Form.Label>
        <Form.Select onChange={handleChangeCategory}>
          {problemCategories.map(item => (
            <option value={item.id} key={item.id}>
              {item.name}
            </option>
          ))}
        </Form.Select>

        <div>
          <div className='tag-list'>
            {chosenTypes.map(item => (
              <TypeTag
                id={problemTags[item].id as string}
                name={problemTags[item].name}
                removeTypeTag={removeTypeTag}
                ind={item}
                key={item}
              />
            ))}
          </div>
          <div style={{ paddingBottom: '10px' }}>
            <Form.Label>Problem Type</Form.Label>
            <Form.Select
              onChange={handleAddTag}
              id='demo-simple-select'
              defaultValue='10'
            >
              {problemTags.map((item, ind) => (
                <option value={ind} key={item.id}>
                  {item.name}
                </option>
              ))}
            </Form.Select>
          </div>

          <Form.Label>Dificulty</Form.Label>

          <MultiRangeSlider
            className='diff-range'
            ruler='false'
            min={0}
            max={400}
            step={5}
            minValue={startDif}
            maxValue={endDif}
            onInput={e => {
              handleInput(e);
            }}
          />
          <div className='space-around'>
            <Button onClick={handleFind}>Find</Button>
            <Button>Reset</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
