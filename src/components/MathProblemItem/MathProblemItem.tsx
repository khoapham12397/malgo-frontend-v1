import { Button, ButtonGroup } from 'react-bootstrap';
import { processText, formatMathExpr, getAvatarLink } from '../../utils/utils';
import { Link } from 'react-router-dom';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import parse from 'html-react-parser';
import { useState } from 'react';
import './MathProblemItem.css';
import {
  BsFillCaretDownFill,
  BsFillCaretUpFill,
  BsLightbulb
} from 'react-icons/bs';
import { toast } from 'react-hot-toast';
import { MathNoteItem } from '../MathNoteItem/MathNoteItem';
import { getMathSolutions } from '../../state/actions/mathProblemListAction';
interface ItemProps {
  mathProbData: MathProbItem;
}

export const MathProblemItem = ({ mathProbData }: ItemProps) => {
  // id, author(username) + avatar username: + summary , created date , title
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const [solutions, setSolutions] = useState<Array<MathSolution> | null>(null);

  const handleShowSolution = () => {
    if (solutions == null) {

      getMathSolutions(mathProbData.id)
      .then(result => {
        if (result.successed) {
          setSolutions(result.data.solutions);
          setShowSolution(true);
        } else toast.error(result.message);
      });
      
    } else setShowSolution(!showSolution);
  };
  return (
    <div className='thread-item'>
      <div className='space-between'>
        <div className='d-flex'>
          <img
            src={getAvatarLink('Admin')}
            className='avatar-icon'
          />
          <div style={{ padding: '10px' }}>
            <div style={{ fontWeight: 'bold' }}>Admin</div>
            <div>{new Date(Date.now()).toDateString()}</div>
          </div>
        </div>
      </div>

      <div className='title'>{mathProbData.title}</div>

      <div id='summary-content'>
        <MathJaxContext>
          <MathJax>
            {parse(processText(formatMathExpr(mathProbData.description)))}
          </MathJax>
        </MathJaxContext>
      </div>

      <Button
        className='btn btn-secondary btn-control'
        style={{ marginRight: '10px', marginTop: '10px', width: '110px' }}
        onClick={e => {
          setShowHint(!showHint);
        }}
      >
        <BsLightbulb style={{ marginBottom: '2px' }} /> Hint{' '}
        {!showHint ? (
          <BsFillCaretUpFill style={{ marginBottom: '2px' }} />
        ) : (
          <BsFillCaretDownFill style={{ marginBottom: '2px' }} />
        )}
      </Button>

      <div className={showHint ? 'hint-open' : 'hint'}>
        <MathJaxContext>
          <MathJax>
            {parse(formatMathExpr(mathProbData.hint as string))}
          </MathJax>
        </MathJaxContext>
      </div>

      <Button
        className='btn btn-success'
        style={{ marginTop: '10px' }}
        onClick={handleShowSolution}
      >
        Solution{' '}
        {!showSolution ? (
          <BsFillCaretUpFill style={{ marginBottom: '2px' }} />
        ) : (
          <BsFillCaretDownFill style={{ marginBottom: '2px' }} />
        )}
      </Button>
      {solutions && showSolution ? (
        <div>
          {solutions.length > 0
            ? solutions.map(item => (
                <MathNoteItem mathNote={item} type='solution' />
              ))
            : 'There are no solutions.'}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
