import { FunctionComponent, useState } from 'react';
import { Table } from 'react-bootstrap';
import './Rank.css';
import { rankData } from './RankData';
import { Container } from 'react-bootstrap';
import { PaginationControl } from 'react-bootstrap-pagination-control';

const Rank: FunctionComponent = () => {
  const [page, setPage] = useState<number>(1);

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  return (
    <Container className='rank-container'>
      <Table striped bordered hover responsive size='sm'>
        <thead className='rank-table-title'>
          <tr>
            <th style={{ width: '20%' }}>Rank</th>
            <th style={{ width: '50%' }}>User</th>
            <th style={{ width: '15%' }}>Score</th>
            <th style={{ width: '15%' }}>Problem Count</th>
          </tr>
        </thead>
        <tbody>
          {rankData.slice((page - 1) * 20, (page - 1) * 20 + 20).map(item => (
            <tr key={item.id} className='rank-table-item'>
              <td>{item.id}</td>
              <td>{item.username}</td>
              <td>{item.score}</td>
              <td>{item.problemCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <PaginationControl
        page={page}
        total={rankData.length}
        limit={20}
        changePage={handleChangePage}
        ellipsis={1}
      />
    </Container>
  );
};

export default Rank;
