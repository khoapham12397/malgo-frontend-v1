import { Tag } from 'antd';
import { FunctionComponent } from 'react';
import './DifficultyTag.css';
import { Difficulty } from '../../config/enums';

interface Props {
  difficulty: string;
}

const DifficultyTag: FunctionComponent<Props> = ({ difficulty }) => {
  if (difficulty === Difficulty.easy)
    return (
      <div>
        <Tag color='#00B507' key={Difficulty.easy} className='difficulty-tag'>
          Easy
        </Tag>
      </div>
    );

  if (difficulty === Difficulty.medium)
    return (
      <div>
        <Tag color='#DFCA06' key={Difficulty.medium} className='difficulty-tag'>
          Medium
        </Tag>
      </div>
    );

  return (
    <div>
      <Tag color='#D23605' key={Difficulty.hard} className='difficulty-tag'>
        Hard
      </Tag>
    </div>
  );
};

export default DifficultyTag;
