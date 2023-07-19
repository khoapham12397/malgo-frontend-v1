import { MathJax, MathJaxContext } from 'better-react-mathjax';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';
import { formatMathExpr, processText } from '../../utils/utils';
import './MathNoteItem.css';

type Props = {
  mathNote: MathNote | MathSolution;
  type: string;
};

export const MathNoteItem = ({ mathNote, type }: Props) => {
  const [show, setShow] = useState(type != 'solution');
  useEffect(() => {
    if (type == 'solution') setShow(false);
  }, []);

  return (
    <div className='mathnote'>
      {type == 'solution' ? (
        <div className='sol-item' onClick={() => setShow(!show)}>
          {' '}
          Solution of {mathNote?.creatorId}{' '}
          {!show ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />}
        </div>
      ) : (
        ''
      )}
      {show ? (
        <div>
          <MathJaxContext>
            <MathJax>
              <div className='note-text'>
                <div>Author by {mathNote?.creatorId}</div>
                {parse(formatMathExpr(processText(mathNote.content)))}
              </div>
            </MathJax>
          </MathJaxContext>
          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            {mathNote.imageLink.map(item => (
              <img width='100%' src={import.meta.env.VITE_URL+item} key={item} />
            ))}
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
