import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './SingleMathProblem.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import { MathProblemItem } from '../../components/MathProblemItem/MathProblemItem';
import { Table } from 'react-bootstrap';
import { BiBookAdd, BiEdit, BiLink, BiNote, BiStar } from 'react-icons/bi';
import { MathEditor } from '../../components/MathEditor/MathEditor';
import { TestLogin } from '../../components/TestLogin/TestLogin';
import { UserContext } from '../../contexts/UserContext';
import { MathNoteItem } from '../../components/MathNoteItem/MathNoteItem';
import { getAccessTokenFromStorage } from '../../utils/getUser';
import { getMathProblem } from '../../state/actions/mathProblemListAction';

export function SingleMathProblem() {
  const { problemId } = useParams();
  const [problemState, setProblemState] = useState<MathProbState | null>(null);
  const [tags, setTags] = useState<Array<MathProblemTag>>([]);
  const [showTags, setShowTags] = useState(false);
  const [showType, setShowType] = useState('');
  const noteArea = useRef<HTMLTextAreaElement>(null);
  const { user, setUser } = useContext(UserContext);

  //show note | solution | editor

  const problemTags = useSelector(
    (state: RootState) => state.mathProblemList.problemTags
  );

  useEffect(() => {
    
    let url = import.meta.env.VITE_API_URL + 'mathproblem/problem/' + problemId;
    if (user) url += '?username=' + user.username;

    if(problemId) {
      getMathProblem(problemId, user?user.username:undefined)
      .then(result => {
        const problemState: MathProbState = {
          mathProblem: result.data.mathProblem,
          note: result.data.mathNote,
          mySolution: result.data.mathSolution,
          otherSolutions: []
        };

        setProblemState(problemState);

        let lst: Array<MathProblemTag> = [];

        problemState.mathProblem.tags.forEach((item: any) => {
          for (let i = 0; i < problemTags.length; i++) {
            if (problemTags[i].id == item.tagId) {
              lst.push(problemTags[i]);
              break;
            }
          }
        });
        console.log(lst);
        setTags(lst);
      });
    }
  }, []);

  const handeChangeNoteAndSol = (note: MathNote, mySolution: MathSolution) => {
    if (!problemState) return;

    if (mySolution != null)
      setProblemState({ ...problemState, note: note, mySolution: mySolution });
    else setProblemState({ ...problemState, note: note });
  };
  const handleShowType = () => {
    if (!problemState?.note) {
      if (showType == 'editor') setShowType('');
      else setShowType('editor');
    } else {
      if (showType == 'note') setShowType('');
      else {
        setShowType('note');
      }
    }
  };

  const handleShowTag = () => {
    setShowTags(true);
  };

  return (
    <div className='container'>
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <TestLogin />
      </div>

      <div className='contain-all'>
        <div className='main-container'>
          {problemState != null ? (
            <MathProblemItem mathProbData={problemState.mathProblem} />
          ) : (
            ''
          )}
          <div style={{ display: 'flex', justifyContent: 'right',marginBottom:'10px' }}>
            <Button className='btn btn-info' onClick={handleShowType}>
              {' '}
              <BiNote /> {showType == 'note' ? 'Close Note' : 'Note '}
              | <BiBookAdd /> Add Solution
            </Button>
          </div>
          <div>
            <div
              className={showType == 'note' ? 'slide-down-open' : 'slide-down'}
            >
              <div className='note-item'>
                {problemState?.note ? (
                  <MathNoteItem mathNote={problemState.note} type='note' />
                ) : (
                  ''
                )}
                <Button onClick={e => setShowType('editor')}>
                  <BiEdit /> Edit Note
                </Button>
              </div>
            </div>
            
            <div className={showType == '' ? 'edit-box' : 'edit-box-open'}>
              <div
                className={showType == 'editor' ? 'note-box-open' : 'note-box'}
              >
                {problemState ? (
                  <MathEditor
                    mathProblem={problemState.mathProblem as MathProbItem}
                    type='note'
                    showType={showType}
                    mathNote={problemState.note ? problemState.note : null}
                    setMathNoteAndSolution={handeChangeNoteAndSol}
                  />
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='sidebar'>
          <Table
            className='table table-striped'
            style={{ border: '1px solid #ddd' }}
          >
            <thead>
              <tr style={{ backgroundColor: 'dimgray', color: 'white' }}>
                <th>Info</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='bold'>Category</td>
                <td>{problemState?.mathProblem?.category?.name}</td>
              </tr>
              <tr>
                <td className='bold'>Author</td>
                <td>Admin</td>
              </tr>
              <tr>
                <td className='bold'>Difficulty</td>
                <td>{problemState?.mathProblem?.difficulty}</td>
              </tr>
              <tr>
                <td className='bold'>Year</td>
                <td>2023</td>
              </tr>
              <tr>
                <td className='bold'>Tags</td>
                <td>
                  {!showTags ? (
                    <Button
                      className='btn btn-secondary'
                      onClick={handleShowTag}
                    >
                      Show
                    </Button>
                  ) : (
                    <div>
                      {tags.length > 0
                        ? tags.map(item => <div>{item.name}</div>)
                        : 'There are no tags'}
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </Table>
          <div className='box-side-bar'>
            <div
              className='d-flex'
              style={{ borderBottom: '0.5px solid #ddd', padding: '10px' }}
            >
              <BiStar size={25} />
              <div style={{ fontSize: '18px', paddingLeft: '15px' }}>
                Should learn before
              </div>
            </div>
            <ul>
              <li>Divisibility</li>
              <li>Prime number</li>
              <li>Diophantine Equation</li>
            </ul>
            <div
              className='d-flex'
              style={{ borderBottom: '0.5px solid #ddd', padding: '10px' }}
            >
              <BiLink size={25} />
              <div style={{ fontSize: '18px', paddingLeft: '15px' }}>
                Related problems
              </div>
            </div>
            <ul>
              <li>IMO Shortlist 2017 N1</li>
              <li>IMO Shortlist 2014 N2</li>
              <li>HSGSO 2015 P1</li>
              <li>IMO Shortlist 2017 N1</li>
              <li>IMO Shortlist 2014 N2</li>
              <li>HSGSO 2015 P1</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
