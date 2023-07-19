import { Card, Space } from 'antd';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import './AlgorithmAttention.css';

const AlgorithmAttention: FunctionComponent = () => {
  return (
    <Space direction='vertical'>
      <Card
        title='PAY ATTENTION'
        style={{ width: 200, textAlign: 'center' }}
        headStyle={{
          backgroundColor: '#f8f9fa'
        }}
        bodyStyle={{ padding: '10px 0' }}
      >
        <p className='algorithm-attention-before-text'>Before contest</p>
        <p className='algorithm-attention-contest-left-time'>23:45:27</p>
        <p className='algorithm-attention-contest-name'>Round 144</p>
        <Link to='/contest' className='algorithm-attention-register-link'>
          Register now
        </Link>
      </Card>
    </Space>
  );
};

export default AlgorithmAttention;
