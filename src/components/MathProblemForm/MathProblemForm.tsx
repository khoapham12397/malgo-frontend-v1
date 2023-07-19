import React, { useContext, useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { processText, formatMathExpr } from '../../utils/utils';
import parse from 'html-react-parser';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state';
import { Dispatch } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import {
  editMathProblem,
  fetchMathCategoriesAndTags,
  getMathProblem,
} from '../../state/actions/mathProblemListAction';
import { Button, FormProps } from 'react-bootstrap';
import './MathProblemForm.css';
import { BiBookAdd } from 'react-icons/bi';
import './MathProblemForm.css';
import { Modal } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import { getUsernameFromStorage } from '../../utils/getUser';

type TypeTagProps = {
  id: string;
  name: string;
  ind: number;
  removeTypeTag: (ind: number) => void;
};

function TypeTag({ id, name, ind, removeTypeTag }: TypeTagProps) {
  return (
    <div
      style={{
        margin: '8px',
        backgroundColor: '#DDDDDD',
        padding: '5px',
        borderRadius: '5px'
      }}
    >
      <button style={{ border: 'none' }} onClick={e => removeTypeTag(ind)}>
        x
      </button>
      <span style={{ fontSize: '14px' }}> {name}</span>
    </div>
  );
}
type Props = {
  problemId: string | null;
  mode: string;
  handleChangeMode: (mode: string) => void;
  prevProblems: Array<{ id: string; title: string }>;
  nextProblems: Array<{ id: string; title: string }>;
  setPrevProblems: (lst: Array<any>) => void;
  setNextProblems: (lst: Array<any>) => void;
};

type ProbSetModalProps = {
  chosenList: Array<any>;
  setChosenList: (lst: Array<string>) => void;
};

const ProbSetModal = ({ chosenList, setChosenList }: ProbSetModalProps) => {
  const [probSetList, setProbSetList] = useState<Array<any>>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // fetch('http://localhost:8080/api/mathproblem/set?username=test2')
    const url =
      (import.meta.env.VITE_API_URL as string) +
      'mathproblem/set?username=test2';
    fetch(url)
      .then(res => res.json())
      .then(result => {
        if (result.successed) {
          setProbSetList(result.data.problemSetList);
        } else {
          toast.error(result.message);
        }
      });
  }, []);

  const handleShow = () => setShow(true);

  const handleChange = (value: string, choose: boolean) => {
    if (choose) setChosenList([...chosenList, value]);
    else {
      const lst: Array<any> = [];
      chosenList.forEach(item => {
        if (item != value) lst.push(item);
      });
      setChosenList(lst);
    }
  };

  return (
    <>
      <Button variant='primary' onClick={handleShow}>
        Add Problem Set
      </Button>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Problem Set</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Option</th>
              </tr>
            </thead>
            <tbody>
              {probSetList.map(item => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>
                    <input
                      type='checkbox'
                      onChange={e =>
                        handleChange(
                          item.id + '::' + item.title,
                          e.currentTarget.checked
                        )
                      }
                      defaultChecked={chosenList.includes(
                        item.id + '::' + item.title
                      )}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

function MathProblemForm({
  problemId,
  mode,
  handleChangeMode,
  prevProblems,
  nextProblems,
  setPrevProblems,
  setNextProblems
}: Props) {
  const dispatch: Dispatch<any> = useDispatch();
  const myUsername = getUsernameFromStorage();
  //const [problem, setProblem] = useState<MathProbItem | null>(null);

  const [show, setShow] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [chosenTypes, setChosenTypes] = useState([] as Array<number>);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState(0);
  const [hint, setHint] = useState('');
  const contentArea = useRef<HTMLTextAreaElement>(null);
  const [chosenPSetLst, setChosenPSetLst] = useState<Array<any>>([]);

  useEffect(() => {
    if (categories.length == 0) dispatch(fetchMathCategoriesAndTags());
  }, []);
  
  useEffect(() => {
    if (problemId != null) {
      getMathProblem(problemId, undefined)
      .then(result => {
        if (result.successed) {
          //setProblem(result.data.mathProblem);
          const prob: MathProbItem = result.data.mathProblem;
          setTitle(prob.title);
          setDifficulty(prob.difficulty);
          setRawContent(prob.description);
          setCategory(prob.category.id);
          setHint(prob.hint);

          setPrevProblems(prob.prevProblems);
          setNextProblems(prob.nextProblems);

          const lst: Array<number> = [];

          prob.tags.forEach(item => {
            for (let i = 0; i < tags.length; i++) {
              if (tags[i].id == item.tagId) {
                lst.push(i);
                break;
              }
            }
          });

          if (prob.problemSet.length > 0)
            setChosenPSetLst(
              prob.problemSet.map(
                item => item.mathProbSet.id + '::' + item.mathProbSet.title
              )
            );

          setChosenTypes(lst);
          
        }
      });
    }
  }, [problemId]);
  const handleClose = () => {
    setShow(false);
  };

  const [rawContent, setRawContent] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('2');

  const handleShow = () => {
    if (!myUsername) {
      toast.error("You're not logged in!");
      return;
    }
    setShow(true);
  };

  const handleShowPreview = (e: React.MouseEvent) => {
    e.preventDefault();

    const x = formatMathExpr(processText(rawContent));
    //const s = "\\( f(x)=\\left\\{\\begin{array}{ll}x^{2} & \\text { if } x<0 \\\\ 2 x & \\text { if } x \\geq 0\\end{array}\\right. \\)";
    setContent(x);
    setShowPreview(true);
  };

  const handleSubmit = () => {
    if (problemId) {
      const params: EditMathProbParam = {
        categoryId: category,
        description: rawContent,
        hint: hint,
        difficulty: difficulty,
        nextProblems: JSON.stringify(nextProblems),
        prevProblems: JSON.stringify(prevProblems),
        problemId: problemId,
        tags: chosenTypes.map(item => tags[item].id),
        title: title,
        probSetList: chosenPSetLst.map(item => ({
          setId: item.split('::')[0],
          order: Date.now().toString()
        })),

        username: 'test2'
      };
      console.log(params);
      editMathProblem(params);
      handleChangeMode('');
    }
  };
  const handleCancel = () => {
    handleChangeMode('');
  };
  const handleAddTag = (e: any) => {
    const ind = e.currentTarget.value;
    //console.log('add tag: ind= ' + ind);
    if (chosenTypes.includes(ind) || ind == 0) return;
    let lst = [...chosenTypes];
    lst.push(ind);
    setChosenTypes(lst);
  };
  const categories = useSelector(
    (state: RootState) => state.mathProblemList.problemCategories
  );
  const tags = useSelector(
    (state: RootState) => state.mathProblemList.problemTags
  );
  const removeTypeTag = (ind: number) => {
    console.log('remove ' + ind);
    if (chosenTypes.includes(ind as never)) {
      var lst = [...chosenTypes];
      let index = lst.indexOf(ind as never);
      lst.splice(index, 1);
      setChosenTypes(lst);
    }
  };
  return (
    <Form>
      <div className='space-between'>
        <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
          <Form.Label>Problem Title</Form.Label>
          <Form.Control
            type='text'
            placeholder='title'
            autoFocus
            onChange={e => setTitle(e.currentTarget.value)}
            value={title}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Difficulty</Form.Label>
          <Form.Control
            type='number'
            placeholder='difficulty'
            autoFocus
            value={difficulty}
            onChange={e => setDifficulty(Number(e.currentTarget.value))}
          />
        </Form.Group>
      </div>

      <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
        <Form.Label>Content</Form.Label>
        <Form.Control
          ref={contentArea}
          as='textarea'
          rows={3}
          value={rawContent}
          onChange={e => setRawContent(e.currentTarget.value)}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
        <Form.Label>Hint</Form.Label>
        <Form.Control
          as='textarea'
          rows={2}
          value={hint}
          onChange={e => setHint(e.currentTarget.value)}
        />
      </Form.Group>
      <Form.Group
        style={{ display: showPreview ? 'block' : 'none' }}
        className='mb-3'
        controlId='exampleForm.ControlTextarea1'
      >
        <MathJaxContext>
          <MathJax>{parse(content)}</MathJax>
        </MathJaxContext>
      </Form.Group>
      <div style={{ display: 'flex' }}>
        <Form.Group style={{ width: '32%' }}>
          <Form.Label>Topic</Form.Label>
          <Form.Select
            onChange={e => setCategory(e.currentTarget.value)}
            value={category}
          >
            {categories.map((item, index) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group style={{ width: '65%', marginLeft: '3%' }}>
          <Form.Label>Tags</Form.Label>
          <Form.Select onChange={handleAddTag}>
            {tags.map((item, index) => (
              <option key={item.id} value={index}>
                {item.name}
              </option>
            ))}
          </Form.Select>
          <div
            style={{
              listStyle: 'none',
              display: 'flex',
              flexWrap: 'wrap',
              margin: '10px',
              padding: '0',
              width: '350'
            }}
          >
            {chosenTypes.map(item => (
              <TypeTag
                id={tags[item].id as string}
                name={tags[item].name}
                removeTypeTag={removeTypeTag}
                ind={item}
                key={item}
              />
            ))}
          </div>
        </Form.Group>
      </div>
      <div>
        <div>
          <Button
            disabled={mode == 'choose:next' ? true : false}
            className='btn-info'
            onClick={() => handleChangeMode('choose:prev')}
          >
            <BiBookAdd /> Prev problem
          </Button>

          {prevProblems.length > 0
            ? prevProblems.map(item => (
                <span className='relp-item' key={item.id}>
                  {item.title}
                </span>
              ))
            : ' There are no previous problem'}
        </div>
        <br />
        <div>
          <Button
            disabled={mode == 'choose:prev' ? true : false}
            className='btn-info'
            onClick={() => handleChangeMode('choose:next')}
          >
            <BiBookAdd /> Next problem
          </Button>
          {nextProblems.length > 0
            ? nextProblems.map(item => (
                <span className='relp-item' key={item.id}>
                  {item.title}
                </span>
              ))
            : ' There are no next problem'}
        </div>
      </div>
      <br />
      <Form.Group>
        <ProbSetModal
          chosenList={chosenPSetLst}
          setChosenList={setChosenPSetLst}
        />
        {chosenPSetLst.map((item: string) => {
          const arr = item.split('::');
          return (
            <span className='relp-item' key={arr[0]}>
              {arr[1]}
            </span>
          );
        })}
      </Form.Group>
      <br />
      <div style={{ display: 'flex', justifyContent: 'right' }}>
        <Button className='btn btn-danger btn-control' onClick={handleCancel}>
          Cancel
        </Button>
        <Button className='btn btn-success' onClick={handleSubmit}>
          Save Changes
        </Button>
      </div>
    </Form>
  );
}

export default MathProblemForm;
