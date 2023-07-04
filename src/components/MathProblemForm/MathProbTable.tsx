import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Button, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import { formatMathExpr, processText } from '../../utils/utils';
import parse from 'html-react-parser';

type ChosenProblem = {
  id: string;
  title: string;
};

type MathProbTableProps = {
  chosenProblems: Array<ChosenProblem>;
  setChosenProblems: (problems: Array<any>) => void;
  chooseMode: boolean;
  togleChooseMode: (mode: boolean) => void;
  setEditProblem: (problemId: string) => void;
  type: string;
};

export const MathProbTable = ({
  chosenProblems,
  setChosenProblems,
  chooseMode,
  togleChooseMode,
  setEditProblem,
  type
}: MathProbTableProps) => {
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
          display: chooseMode ? 'flex' : 'none',
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}
      >
        <div>Please choose problems</div>
        <div>
          <Button
            onClick={() => {
              togleChooseMode(false);
            }}
          >
            Confirm selected item
          </Button>
        </div>
      </div>
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
                <td>
                  <MathJaxContext>
                    <MathJax>
                      {parse(processText(formatMathExpr(item.description)))}
                    </MathJax>
                  </MathJaxContext>
                </td>
                <td>{item.category.name}</td>
                <td>{item.difficulty}</td>
                <td>
                  {chooseMode ? (
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
                  ) : type == 'edit' ? (
                    <Button
                      className='btn btn-info'
                      onClick={() => setEditProblem(item.id)}
                    >
                      Edit
                    </Button>
                  ) : (
                    ''
                  )}
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
