import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import parse from 'html-react-parser';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

type Props = {
  comment: string;
  show: boolean;
  handleClose: () => void;
  handleSendCmt: () => void;
};

function ModalReviewCmt({ comment, show, handleClose, handleSendCmt }: Props) {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <MathJaxContext>
                <MathJax>{parse(comment)}</MathJax>
              </MathJaxContext>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary' onClick={handleSendCmt}>
            Post
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalReviewCmt;
