import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Button, Container, Form } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import api from '../../config/axios2';
import './ContestList.css';

export const ContestList = () => {
  const [upComming, setUpComming] = useState<any>(null);
  const [past, setPast] = useState<any>(null);
  const [live, setLive] = useState<any>(null);

  useEffect(() => {
    const url = '/contest';
    //console.log("load contest");
    api
      .get(url)
      .then(result => {
        //console.log(result);
        setUpComming(result.data.data.upcomming);
        setPast(result.data.data.past);
        setLive(result.data.data.live);
      })
      .catch(error => {
        toast.error(error);
      });
  }, []);

  if (upComming && past)
    return (
      <Container>
        <div className='list-type'>
          <span className='contest-type chosen-type'>Present Contests</span>
          <span className='contest-type'>Pass Contests</span>
        </div>

        <div className='main-container'>
          <div style={{ width: '28%' }}>
            <div className='header-item'>Search in Archive</div>

            <div className='left-sidebar'>
              <div className='box'>
                <div className='header'>Rated Range</div>
                <ul className='category-lst'>
                  <li className='item'>
                    Beginer <span className='rated-range'>(0-999)</span>
                  </li>
                  <li className='item'>
                    Intermediate{' '}
                    <span className='rated-range'>(1000-1499)</span>
                  </li>
                  <li className='item'>
                    Advance <span className='rated-range'>(1500-1999)</span>
                  </li>
                  <li className='item'>
                    Master <span className='rated-range'>(2000-2499)</span>
                  </li>
                  <li className='item'>
                    Grandmaster <span className='rated-range'>(2500-2999)</span>
                  </li>
                  <li className='item'>
                    Legendary <span className='rated-range'>(3000-3499)</span>
                  </li>
                </ul>
              </div>
              <div className='box'>
                <div className='header'>Category</div>
                <ul className='category-lst'>
                  <li className='item'>All</li>
                  <li className='item'>Regular Contest</li>
                  <li className='item'>Free Contest</li>
                  <li className='item'>VNOI CUP</li>
                  <li className='item'>Weekly Contest</li>
                  <li className='item'>Bedao Contest</li>
                  <li className='item'>DytechLab Contest</li>
                  <li className='item'>VOI Mocktest</li>
                </ul>
              </div>
              <div className='box'>
                <div className='header'>Search</div>
                <Form>
                  <Form.Control placeholder='Keyword' />
                  <Button className='btn'>Search</Button>
                </Form>
              </div>
            </div>
          </div>

          <div className='contest-area'>
            <div className='header'>Live Contest</div>
            <div className='contests'>
              <Table className='tbl-contest'>
                <thead>
                  <tr>
                    <th>Start Time</th>
                    <th>Contest</th>
                    <th>Duration</th>
                    <th>Rated</th>
                  </tr>
                </thead>
                <tbody>
                  {live.contests.map((item: any) => (
                    <tr key={item.id}>
                      <td className='link'>
                        {new Date(item.startTime).toLocaleString()}
                      </td>
                      <td className='link'>
                        <Link to={'/singlecontest/' + item.id} className='link'>
                          {' '}
                          Ⓐ ◉ {item.title}{' '}
                        </Link>
                      </td>
                      <td>01:40</td>
                      <td>-1999</td>
                    </tr>
                  ))}
                  <tr>
                    <td className='link'>
                      {new Date(Date.now()).toLocaleString()}
                    </td>
                    <td className='link'>
                      {' '}
                      Ⓐ ◉ freee Programming Contest 2023（AtCoder Beginner
                      Contest 310）{' '}
                    </td>
                    <td>01:40</td>
                    <td>-1999</td>
                  </tr>
                  <tr>
                    <td className='link'>
                      {new Date(Date.now()).toLocaleString()}
                    </td>
                    <td className='link'>
                      {' '}
                      Ⓐ ◉ freee Programming Contest 2023（AtCoder Beginner
                      Contest 310）{' '}
                    </td>
                    <td>01:40</td>
                    <td>-1999</td>
                  </tr>
                  <tr>
                    <td className='link'>
                      {new Date(Date.now()).toLocaleString()}
                    </td>
                    <td className='link'>
                      {' '}
                      Ⓐ ◉ freee Programming Contest 2023（AtCoder Beginner
                      Contest 310）{' '}
                    </td>
                    <td>01:40</td>
                    <td>-1999</td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <div className='header'>Upconming Contest</div>
            <div className='contests'>
              <Table className='tbl-contest'>
                <thead>
                  <tr>
                    <th>Start Time</th>
                    <th>Contest</th>
                    <th>Duration</th>
                    <th>Rated</th>
                  </tr>
                </thead>
                <tbody>
                  {upComming.contests.map((item: any) => (
                    <tr key={item.id}>
                      <td className='link'>
                        {new Date(item.startTime).toLocaleString()}
                      </td>
                      <td className='link'>
                        <Link to={'singlecontest/' + item.id}>
                          {' '}
                          Ⓐ ◉ {item.title}{' '}
                        </Link>
                      </td>
                      <td>01:40</td>
                      <td>-1999</td>
                    </tr>
                  ))}
                  <tr>
                    <td className='link'>
                      {new Date(Date.now()).toLocaleString()}
                    </td>
                    <td className='link'>
                      {' '}
                      Ⓐ ◉ freee Programming Contest 2023（AtCoder Beginner
                      Contest 310）{' '}
                    </td>
                    <td>01:40</td>
                    <td>-1999</td>
                  </tr>
                  <tr>
                    <td className='link'>
                      {new Date(Date.now()).toLocaleString()}
                    </td>
                    <td className='link'>
                      {' '}
                      Ⓐ ◉ freee Programming Contest 2023（AtCoder Beginner
                      Contest 310）{' '}
                    </td>
                    <td>01:40</td>
                    <td>-1999</td>
                  </tr>
                  <tr>
                    <td className='link'>
                      {new Date(Date.now()).toLocaleString()}
                    </td>
                    <td className='link'>
                      {' '}
                      Ⓐ ◉ freee Programming Contest 2023（AtCoder Beginner
                      Contest 310）{' '}
                    </td>
                    <td>01:40</td>
                    <td>-1999</td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <div className='header'>Recent Contest</div>
            <div className='contests'>
              <Table className='tbl-contest'>
                <thead>
                  <tr>
                    <th>Start Time</th>
                    <th>Contest</th>
                    <th>Duration</th>
                    <th>Rated</th>
                  </tr>
                </thead>
                <tbody>
                  {past.contests.map((item: any) => (
                    <tr key={item.id}>
                      <td className='link'>
                        {new Date(item.startTime).toLocaleString()}
                      </td>
                      <td className='link'>
                        <Link to={'/singlecontest/' + item.id}>
                          {' '}
                          Ⓐ ◉ {item.title}{' '}
                        </Link>
                      </td>
                      <td>01:40</td>
                      <td>-1999</td>
                    </tr>
                  ))}
                  <tr>
                    <td className='link'>
                      {new Date(Date.now()).toLocaleString()}
                    </td>
                    <td className='link'>
                      {' '}
                      Ⓐ ◉ freee Programming Contest 2023（AtCoder Beginner
                      Contest 310）{' '}
                    </td>
                    <td>01:40</td>
                    <td>-1999</td>
                  </tr>
                  <tr>
                    <td className='link'>
                      {new Date(Date.now()).toLocaleString()}
                    </td>
                    <td className='link'>
                      {' '}
                      Ⓐ ◉ freee Programming Contest 2023（AtCoder Beginner
                      Contest 310）{' '}
                    </td>
                    <td>01:40</td>
                    <td>-1999</td>
                  </tr>
                  <tr>
                    <td className='link'>
                      {new Date(Date.now()).toLocaleString()}
                    </td>
                    <td className='link'>
                      {' '}
                      Ⓐ ◉ freee Programming Contest 2023（AtCoder Beginner
                      Contest 310）{' '}
                    </td>
                    <td>01:40</td>
                    <td>-1999</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </Container>
    );
  else return <Spinner />;
};
