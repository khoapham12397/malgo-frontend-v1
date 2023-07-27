import { useRef } from 'react';
import { GAME_MODE } from '../GameContainer/GameContainerV2';
import './QuizPanel.css';
import { screenWidth, screenHeight } from '../GameContainer/GameContainerV2';
export {};

type QuizDataType1 = {
  description: string;
  result: number;
};
type QuizDataType2 = {
  description: string;
  options: Array<string>;
  result: number;
};

type Props = {
  quizType: string;
  quizKey: string;
  quizData: any;

  handleChangeMode: (
    mode: number,
    quizKey: string,
    result: number | null
  ) => void;
};
type OptionProps = {
  options: Array<string>;
  handleChoose: (ind: number) => void;
};

const OptionPanel = ({ options, handleChoose }: OptionProps) => {
  const chars = ['A', 'B', 'C', 'D'];
  return (
    <div style={{ display: '-ms-flexbox' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className='option-item' key={0} onClick={() => handleChoose(0)}>
          {chars[0] + '. ' + options[0]}
        </div>
        <div className='option-item' key={1} onClick={() => handleChoose(1)}>
          {chars[1] + '. ' + options[1]}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className='option-item' key={2} onClick={() => handleChoose(2)}>
          {chars[2] + '. ' + options[2]}
        </div>
        <div className='option-item' key={3} onClick={() => handleChoose(3)}>
          {chars[3] + '. ' + options[3]}
        </div>
      </div>
    </div>
  );
};

export const QuizPanel = ({
  quizType,
  quizKey,
  quizData,
  handleChangeMode
}: Props) => {
  const handleChoose = (ind: number | null) => {
    handleChangeMode(GAME_MODE.ACTION, quizKey, ind);
  };
  const inp = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (inp.current) {
      handleChangeMode(GAME_MODE.ACTION, quizKey, Number(inp.current.value));
    }
  };

  return (
    <div className='panel'>
      <div
        className='close-quiz'
        onClick={() => handleChangeMode(GAME_MODE.ACTION, quizKey, null)}
      >
        X
      </div>

      <div style={{ position: 'absolute' }}>
        <img src='panel.png' width={screenWidth} height={screenHeight} />
      </div>
      <div style={{ position: 'absolute', padding: '20px' }}>
        <div className='quiz-description'>{quizData.description}</div>
        {quizType == 'option' ? (
          <OptionPanel options={quizData.options} handleChoose={handleChoose} />
        ) : (
          <div style={{ margin: '10px' }}>
            <input type='text' ref={inp} />
            <button className='btn-submit' onClick={handleSubmit}>
              Ok
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
