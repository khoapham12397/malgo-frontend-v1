import { useEffect, useRef, useState } from 'react';
import MathProblemForm from './MathProblemForm';
import { MathProbTable } from './MathProbTable';
type Props = {
  problemId: string | null;
  setProblemId: (id: string | null) => void;
  isCreate: boolean;
};
export const MathProblemEdit = ({
  problemId,
  setProblemId,
  isCreate
}: Props) => {
  // choose:{type} , 'edit' , '': finis dg: => cu vay la duioc ding:

  const [prevProblems, setPrevProblems] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [nextProblems, setNextProblems] = useState<
    Array<{ id: string; title: string }>
  >([]);

  const [chooseMode, setChooseMode] = useState(false);
  const [mode, setMode] = useState('edit');

  const probsTable = useRef<HTMLDivElement>(null);
  const editForm = useRef<HTMLDivElement>(null);

  const handleChangeMode = (mode: string) => setMode(mode);

  useEffect(() => {
    const prefixMode = mode.split(':')[0];

    if (prefixMode == 'choose' && probsTable.current != null) {
      probsTable.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      setChooseMode(true);
    } else if (prefixMode == 'edit' && editForm.current != null) {
      editForm.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    } else {
      setProblemId(null);
    }
  }, [mode]);

  useEffect(() => {
    if (!chooseMode) setMode('edit');
  }, [chooseMode]);

  let chosenProblems: Array<any> = [];
  let setChosenProblems = (probs: Array<any>) => {};
  const arrMode = mode.split(':');

  if (arrMode[0] == 'choose') {
    switch (arrMode[1]) {
      case 'prev':
        chosenProblems = prevProblems;
        setChosenProblems = setPrevProblems;
        break;
      case 'next':
        chosenProblems = nextProblems;
        setChosenProblems = setNextProblems;
        break;
        defautl: break;
    }
  }

  return (
    <>
      <div ref={probsTable}>
        <MathProbTable
          chosenProblems={chosenProblems}
          setChosenProblems={setChosenProblems}
          chooseMode={chooseMode}
          togleChooseMode={setChooseMode}
          setEditProblem={() => {}}
          type='choose'
        />
      </div>

      <div className='math-form' ref={editForm}>
        <MathProblemForm
          problemId={problemId}
          mode={mode}
          handleChangeMode={handleChangeMode}
          nextProblems={nextProblems}
          prevProblems={prevProblems}
          setNextProblems={setNextProblems}
          setPrevProblems={setPrevProblems}
        />
      </div>
    </>
  );
};
