import React, { useContext, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { BiPlusCircle } from 'react-icons/bi';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { processText, formatMathExpr } from '../../utils/utils';
import parse from 'html-react-parser';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state';
import { Dispatch } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import {
  fetchMathCategoriesAndTags,
  postMathProblem
} from '../../state/actions/mathProblemListAction';
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

function CreateMathProblemModal() {
  const dispatch: Dispatch<any> = useDispatch();
  const myUsername = getUsernameFromStorage();

  const [show, setShow] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [chosenTypes, setChosenTypes] = useState([] as Array<number>);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState(0);
  const [hint, setHint] = useState('');

  useEffect(() => {
    if (categories.length == 0) dispatch(fetchMathCategoriesAndTags());
  }, []);
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
    const tagList = chosenTypes.map(item => tags[item].id);
    //const x = formatMathExpr(processText(rawContent));
    console.log(tagList);
    const params: CreateMathProblemParam = {
      categoryId: category,
      description: rawContent,
      title: title,
      tags: tagList,
      username: myUsername ? myUsername: undefined,
      difficulty: difficulty,
      hint: hint
    };

    postMathProblem(params);
    setShow(false);
  };

  const handleAddTag = (e: any) => {
    const ind = e.currentTarget.value;
    console.log('add tag: ind= ' + ind);
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
    <>
      <Button variant='primary' onClick={handleShow}>
        <BiPlusCircle /> New Problem
      </Button>

      <Modal show={show} onHide={handleClose} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>
            <BiPlusCircle /> New Problem
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className='space-between'>
              <Form.Group
                className='mb-3'
                controlId='exampleForm.ControlInput1'
              >
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

            <Form.Group
              className='mb-3'
              controlId='exampleForm.ControlTextarea1'
            >
              <Form.Label>Content</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                value={rawContent}
                onChange={e => setRawContent(e.currentTarget.value)}
              />
            </Form.Group>
            <Form.Group
              className='mb-3'
              controlId='exampleForm.ControlTextarea1'
            >
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleShowPreview}>
            Preview
          </Button>
          <Button variant='primary' onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateMathProblemModal;
