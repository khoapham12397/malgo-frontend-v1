import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import parse from 'html-react-parser';
import { MathJax } from 'better-react-mathjax';

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
          <Modal.Title>You are posting...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <MathJax>{parse(comment)}</MathJax>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button
            variant='primary'
            onClick={handleSendCmt}
            style={{ backgroundColor: '#3b5998', border: '#3b5998' }}
          >
            Post
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalReviewCmt;
