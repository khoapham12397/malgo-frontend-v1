import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './ContestTasks.css';
type Props = {
  startTime: Date;
  problems: Array<any>;
};
export const ContestTasks = ({ startTime, problems }: Props) => {
  const active = new Date(startTime).getTime() <= Date.now();
  //console.log(startTime);
  return (
    <div style={{ fontSize: '18px', marginTop: '20px' }}>
      <h3 className='task-header'>Tasks</h3>
      <Table className='table-striped table-bordered'>
        <thead>
          <tr>
            <th></th>
            <th>Task Name</th>
            <th>Time Limit</th>
            <th>Memory Limit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {problems.map(item => (
            <tr>
              <td>
                <Link
                  to={active ? `/algorithm/${item.id}` : ''}
                  className='link'
                >
                  {item.id}
                </Link>
              </td>
              <td>
                <Link
                  to={active ? `/algorithm/${item.id}` : ''}
                  className='link'
                >
                  {item.title}
                </Link>
              </td>
              <td>{item.timeLimit}</td>
              <td>{item.memoryLimit}</td>
              <td>
                <span className='link'>Submit</span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={{ height: '350px' }} />
    </div>
  );
};
