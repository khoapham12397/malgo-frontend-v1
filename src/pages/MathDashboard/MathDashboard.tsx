import { useContext, useEffect, useReducer, useRef, useState } from 'react';

import { Button, Form, Modal, Table } from 'react-bootstrap';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { useSelector } from 'react-redux';
import { MathProblemFilter } from '../../components/MathProblemFilter/MathProblemFilter';
import { RootState } from '../../state';
import './MathDashboard.css';
import MathProblemForm from '../../components/MathProblemForm/MathProblemForm';
import { toast } from 'react-hot-toast';
import { getMathSet } from '../../state/actions/mathProblemListAction';
import { getUsernameFromStorage } from '../../utils/getUser';

type ChosenProblem = {
  id: string;
  title: string;
};

type ProblemSetProps = {
  problems: Array<ChosenProblem>;
  setProblems: (problems: Array<ChosenProblem>) => void;
  mode: string;
  handleChangeMode: (mode: string) => void;
};

const ProblemSetForm = ({
  problems,
  setProblems,
  mode,
  handleChangeMode
}: ProblemSetProps) => {
  const [title, setTitle] = useState('');
  const myUsername = getUsernameFromStorage();
  const handleSubmit = () => {
    if(!myUsername) return;
    const params: CreateMathProbSetParam = {

      numProb: problems.length,
      title: title,
      username: myUsername,
      problems: problems.map((item, index) => ({
        problemId: item.id,
        order: String(index + 1)
      }))
    };
    const url = import.meta.env.VITE_API_URL + 'mathproblem/set'
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(result => {
        if (result.successed) toast.success('successed');
        else toast.error(result.message);
      });
  };
  return (
    <Form style={{ maxWidth: '400px' }}>
      <Form.Group>
        <Form.Label>Problem Set Title</Form.Label>
        <Form.Control
          type='text'
          placeholder='title'
          autoFocus
          onChange={e => setTitle(e.currentTarget.value)}
          value={title}
        />
      </Form.Group>
      <Form.Group>
        <br />
        <Button
          disabled={mode == '' ? false : true}
          className='btn btn-info'
          onClick={() => handleChangeMode('choose:set')}
        >
          Choose Problem
        </Button>
        <div>
          {problems.map(item => (
            <div className='prob-item' key={item.id}>
              {item.title}
            </div>
          ))}
        </div>
        <Button onClick={handleSubmit}>Create</Button>
      </Form.Group>
    </Form>
  );
};

type MathCheckListProps = {
  chosenProblems: Array<ChosenProblem>;
  setChosenProblems: (problems: Array<any>) => void;
  mode: string;
  handleChangeMode: (mode: string) => void;
};

const MathCheckList = ({
  chosenProblems,
  setChosenProblems,
  mode,
  handleChangeMode
}: MathCheckListProps) => {
  const filter = useSelector(
    (state: RootState) => state.mathProblemList.filter
  );

  const problems = useSelector(
    (state: RootState) => state.mathProblemList.problems
  );
  const handleClickCheck = (
    e: any,
    problemId: string,
    problemTitle: string
  ) => {
    if (e.currentTarget.checked) {
      const lst = [...chosenProblems, { id: problemId, title: problemTitle }];
      setChosenProblems(lst);
    } else {
      const lst: Array<any> = [];
      chosenProblems.forEach(item => {
        if (item.id != problemId) lst.push(item);
      });
      setChosenProblems(lst);
    }
  };

  return (
    <div>
      <div
        style={{
          display: mode.split(':')[0] == 'choose' ? 'flex' : 'none',
          justifyContent: 'space-between'
        }}
      >
        <div>Please choose problems</div>
        <div>
          <Button
            onClick={() => {
              if (mode == 'choose:set') handleChangeMode('');
              else handleChangeMode('edit');
            }}
          >
            Confirm selected item
          </Button>
        </div>
      </div>
      <br />
      {problems.length > 0 ? (
        <Table className='problem-table'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((item: MathProbSummary, index: number) => (
              <tr key={item.id}>
                <td>
                  <div>{item.title}</div>
                </td>
                <td>{item.description}</td>
                <td>{item.category.name}</td>
                <td>{item.difficulty}</td>
                <td>
                  <input
                    style={{ width: '50px' }}
                    type='checkbox'
                    onChange={e => handleClickCheck(e, item.id, item.title)}
                    defaultChecked={
                      chosenProblems.reduce(
                        (acc: boolean, it: ChosenProblem) => {
                          return acc || it.id == item.id;
                        },
                        false
                      )
                        ? true
                        : false
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        ''
      )}
    </div>
  );
};
const MathList = () => {
  const filter = useSelector(
    (state: RootState) => state.mathProblemList.filter
  );
  const problems = useSelector(
    (state: RootState) => state.mathProblemList.problems
  );
  const [page, setPage] = useState<number>(1);
  const [mode, setMode] = useState('');
  const [isChoose, setIsChoose] = useState(false);

  const handleChangePage = (page: number) => setPage(page);
  const handleChangeMode = (mode: string) => setMode(mode);

  const [editProblem, setEditProblem] = useState<string | null>(null);
  const [problemSet, setProblemSet] = useState<Array<any>>([]);
  const [prevProblems, setPrevProblems] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [nextProblems, setNextProblems] = useState<
    Array<{ id: string; title: string }>
  >([]);

  const probsTable = useRef<HTMLDivElement>(null);
  const editForm = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      (mode == 'choose:prev' ||
        mode == 'choose:next' ||
        mode == 'choose:set') &&
      probsTable.current != null
    ) {
      probsTable.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    } else if (mode == 'edit' && editForm.current != null) {
      editForm.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
    if (mode == '') setEditProblem(null);
  }, [mode, editProblem]);

  useEffect(() => {
    if (filter.page != 0 && filter.page != null) setPage(filter.page);
  }, [filter.page]);

  const chosenProblems =
    mode == 'choose:prev'
      ? prevProblems
      : mode == 'choose:next'
      ? nextProblems
      : mode == 'choose:set'
      ? problemSet
      : [];
  const setChosenProblems =
    mode == 'choose:prev'
      ? setPrevProblems
      : mode == 'choose:next'
      ? setNextProblems
      : mode == 'choose:set'
      ? setProblemSet
      : () => {};

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
          <div ref={probsTable}>
            {problems.length > 0 && (mode == '' || mode == 'edit') ? (
              <Table className='problem-table'>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Option</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((item: MathProbSummary, index: number) => (
                    <tr key={item.id}>
                      <td>
                        <div>{item.title}</div>
                      </td>
                      <td>{item.description}</td>
                      <td>{item.category.name}</td>
                      <td>{item.difficulty}</td>
                      <td>
                        <Button
                          disabled={mode == '' ? false : true}
                          className='btn btn-info'
                          onClick={() => {
                            setEditProblem(item.id);
                            setMode('edit');
                          }}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <MathCheckList
                chosenProblems={chosenProblems}
                setChosenProblems={setChosenProblems}
                mode={mode}
                handleChangeMode={handleChangeMode}
              />
            )}
          </div>
          {editProblem != null ? (
            <div className='math-form' ref={editForm}>
              <MathProblemForm
                problemId={editProblem}
                mode={mode}
                handleChangeMode={handleChangeMode}
                nextProblems={nextProblems}
                prevProblems={prevProblems}
                setNextProblems={setNextProblems}
                setPrevProblems={setPrevProblems}
              />
            </div>
          ) : (
            ''
          )}

          <br></br>
          <div className='prolemset-form'>
            <ProblemSetForm
              problems={problemSet}
              setProblems={setProblemSet}
              mode={mode}
              handleChangeMode={handleChangeMode}
            />
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
const MathDashboard = () => {
  return (
    <>
      <div>
        <div className='sidebar-admin'>
          <div className='item'>Edit Problems</div>
          <div className='item'>Create Problem</div>
          <div></div>
          <div></div>
        </div>
        <div className='main'>
          <MathList />
        </div>
      </div>
    </>
  );
};
export default MathDashboard;
