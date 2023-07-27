import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { BiPlusCircle } from 'react-icons/bi';
import { MathJax } from 'better-react-mathjax';
import { processText, formatMathExpr } from '../../utils/utils';
import parse from 'html-react-parser';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state';
import { Dispatch } from '@reduxjs/toolkit';
import { fetchCategoriesAndTags } from '../../state/actions/threadBaseAction';
import { toast } from 'react-hot-toast';
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
  type: string;
  handleSubmitThread: (params: any) => void;
};

function ModalWritePost({ handleSubmitThread, type }: Props) {
  const dispatch: Dispatch<any> = useDispatch();
  const myUsername = getUsernameFromStorage();
  const [show, setShow] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [chosenTypes, setChosenTypes] = useState([] as Array<number>);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (categories.length == 0) dispatch(fetchCategoriesAndTags());
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
    const x = formatMathExpr(processText(rawContent));

    const params: CreateThreadParam = {
      categoryId: category,
      content: x,
      published: true,
      summary: null,
      title: title,
      tags: tagList,
      username: myUsername ? myUsername : undefined
    };

    handleSubmitThread(params);

    setShow(false);
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
    (state: RootState) => state.threadBase.categories
  );
  const tags = useSelector((state: RootState) => state.threadBase.tags);
  const removeTypeTag = (ind: number) => {
    //console.log('remove ' + ind);
    if (chosenTypes.includes(ind as never)) {
      var lst = [...chosenTypes];
      let index = lst.indexOf(ind as never);
      lst.splice(index, 1);
      setChosenTypes(lst);
    }
  };
  return (
    <>
      <Button
        onClick={handleShow}
        className={type == 'thread' ? 'btn-new-thread' : 'btn-new-postgroup'}
      >
        <BiPlusCircle /> Thread
      </Button>

      <Modal show={show} onHide={handleClose} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>
            New Thread <BiPlusCircle />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
              <Form.Label>Title Thread</Form.Label>
              <Form.Control
                type='text'
                placeholder='title'
                autoFocus
                onChange={e => setTitle(e.currentTarget.value)}
              />
            </Form.Group>
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
              style={{ display: showPreview ? 'block' : 'none' }}
              className='mb-3'
              controlId='exampleForm.ControlTextarea1'
            >
              <MathJax>{parse(content)}</MathJax>
            </Form.Group>
            <div style={{ display: 'flex' }}>
              <Form.Group style={{ width: '32%' }}>
                <Form.Label>Topic</Form.Label>
                <Form.Select onChange={e => setCategory(e.currentTarget.value)}>
                  {categories.map((item, index) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group style={{ width: '65%', marginLeft: '3%' }}>
                <Form.Label>Tags</Form.Label>
                <Form.Select onChange={handleAddTag}>
                  {tags.map((item, index) => (
                    <option key={item.id} value={index}>
                      {item.title}
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
                      name={tags[item].title}
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

export default ModalWritePost;
