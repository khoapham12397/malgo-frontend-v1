import { useEffect, useReducer, useRef, useState } from 'react';

import { Button, Form, Modal, Table } from 'react-bootstrap';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { useSelector } from 'react-redux';
import { MathProblemFilter } from '../../components/MathProblemFilter/MathProblemFilter';
import { RootState } from '../../state';
import './MathDashboard.css';
import { toast } from 'react-hot-toast';
import { MathProblemEdit } from '../../components/MathProblemForm/MathProblemEdit';
import { MathProbTable } from '../../components/MathProblemForm/MathProbTable';
import { createMathSet } from '../../state/actions/mathProblemListAction';
import { getUsernameFromStorage } from '../../utils/getUser';

type ChosenProblem = {
  id: string;
  title: string;
};

type ProblemSetProps = {
  mode: string;
  handleChangeMode: (mode: string) => void;
};

const ProblemSetForm = ({ mode, handleChangeMode }: ProblemSetProps) => {
  const [title, setTitle] = useState('Set ' + Date.now());
  const [chosenProblems, setChosenProblems] = useState<Array<ChosenProblem>>(
    []
  );
  const myUsername = getUsernameFromStorage();

  const [chooseMode, setChooseMode] = useState(false);
  const [clickChoose, setClickChoose] = useState(false);

  const handleSubmit = () => {
    if (!myUsername) {
      toast.error("you haven't logined yet");
      return;
    }
    const x = inpTitle.current ? inpTitle.current.value : '';
    if (chosenProblems.length == 0) {
      toast.error('Problem Set is empty');
      return;
    }
    if (x == '') {
      toast.error('Title is empty');
      return;
    }
    const params: CreateMathProbSetParam = {
      numProb: chosenProblems.length,
      title: x,
      username: myUsername,

      problems: chosenProblems.map((item, index) => ({
        problemId: item.id,
        order: String(index + 1)
      }))
    };

    createMathSet(params).then(result => {
      if (result.successed) {
        toast.success('successed');
        handleChangeMode('');
      } else toast.error(result.message);
    });
  };

  const handleChoose = () => {
    setChooseMode(true);
    setClickChoose(true);
  };

  useEffect(() => {
    if (!chooseMode && mode == 'set' && clickChoose) {
      handleSubmit();
    }
  }, [chooseMode, chosenProblems]);
  const inpTitle = useRef<HTMLInputElement>(null);

  return (
    <div>
      <MathProbTable
        chooseMode={chooseMode}
        togleChooseMode={setChooseMode}
        chosenProblems={chosenProblems}
        setChosenProblems={setChosenProblems}
        setEditProblem={() => {}}
        type='choose'
      />
      <div className='prolemset-form'>
        <Form style={{ maxWidth: '400px' }}>
          <Form.Group>
            <Form.Label>Problem Set Title</Form.Label>
            <Form.Control
              type='text'
              placeholder='title'
              autoFocus
              ref={inpTitle}
              //onChange={e => setTitle(e.currentTarget.value)}
            />
          </Form.Group>
          <Form.Group>
            <br />
            <div className='space-between'>
              <Button
                disabled={mode == 'set' ? false : true}
                className='btn btn-info'
                onClick={handleChoose}
              >
                Choose Problem
              </Button>

              <Button
                className='btn btn-danger'
                onClick={() => handleChangeMode('')}
              >
                Cancel
              </Button>
            </div>
            <div>
              {chosenProblems.map(item => (
                <div className='prob-item' key={item.id}>
                  {item.title}
                </div>
              ))}
            </div>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

const MathPanel = () => {
  const filter = useSelector(
    (state: RootState) => state.mathProblemList.filter
  );
  const problems = useSelector(
    (state: RootState) => state.mathProblemList.problems
  );

  const [page, setPage] = useState<number>(
    filter ? (filter.page ? filter.page : 1) : 1
  );
  const [mode, setMode] = useState('');

  const handleChangePage = (page: number) => setPage(page);
  const handleChangeMode = (mode: string) => setMode(mode);

  const [editProblem, setEditProblem] = useState<string | null>(null);

  useEffect(() => {
    if (!editProblem) setMode('');
    else setMode('edit');
  }, [editProblem]);

  useEffect(() => {
    if (filter.page != 0 && filter.page != null) setPage(filter.page);
  }, [filter.page]);

  return (
    <div>
      <div className='pagination'>
        <PaginationControl
          page={page}
          between={4}
          total={filter.total == null ? 0 : filter.total}
          limit={filter.itemPerPage}
          changePage={handleChangePage}
          ellipsis={1}
        />
      </div>

      <div className='d-flex'>
        <div style={{ width: '80%', paddingRight: '20px' }}>
          <div>
            {problems.length > 0 && mode == '' ? (
              <MathProbTable
                chooseMode={false}
                chosenProblems={[]}
                setChosenProblems={() => {}}
                setEditProblem={setEditProblem}
                type='edit'
                togleChooseMode={() => {}}
              />
            ) : (
              ''
            )}
          </div>
          {mode == 'edit' || mode == 'create:problem' ? (
            <MathProblemEdit
              problemId={editProblem}
              setProblemId={setEditProblem}
              isCreate={mode == 'create:problem'}
            />
          ) : (
            ''
          )}
          <br />
          <div>
            {mode != 'set' ? (
              <Button onClick={() => setMode('set')}>New Problem Set</Button>
            ) : (
              <ProblemSetForm mode={mode} handleChangeMode={handleChangeMode} />
            )}
          </div>
        </div>
        <div>
          <MathProblemFilter page={page} />
        </div>
      </div>
      <div style={{ height: '250px' }}></div>
    </div>
  );
};
const MathDashboardV2 = () => {
  return (
    <>
      <div>
        <div className='sidebar-admin'>
          <div className='item'>Edit Problems</div>
          <div className='item'>Create Problem</div>
        </div>
        <div className='main'>
          <MathPanel />
        </div>
      </div>
    </>
  );
};
export default MathDashboardV2;
