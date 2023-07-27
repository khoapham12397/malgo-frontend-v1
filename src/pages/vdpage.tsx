import { useState } from 'react';
import api from '../config/axios2';
import { useInterval } from 'usehooks-ts';
import { Table } from 'react-bootstrap';

export const VDPage = () => {
  const [submissionList, setSubmissionList] = useState<Array<any>>([]);
  const [cnt, setCnt] = useState(0);
  const [isCalling, setIsCalling] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [inter, setInter] = useState<any>(null);
  const x = 0;

  const task = () => {
    const url = '/submission/submit';
    api
      .post(url, {
        username: 'khoa.pham12397@ami1cXdWCn497Qto3rZWT9',
        problemId: '1792A',
        sourceCode:
          'Zm9yIHMgaW5bKm9wZW4oMCldWzI6OjJdOnByaW50KGxlbihhOj1zLnNwbGl0KCkpLWEuY291bnQoJzEnKS8vMik=',
        language: 71
      })
      .then(result => {
        if (result.status === 201) {
          setSubmissionList([
            {
              id: result.data.data.submissionId,
              status: 'in queue',
              result: 'PENDING'
            },
            ...submissionList
          ]);
        }
        if (!isCalling) setIsCalling(true);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const pollingStatus = async () => {
    let first = true;
    let strQuery = '';
    console.log('running polling function');
    submissionList.forEach(item => {
      if (item.result == 'PENDING' || item.result === 'JUDGING') {
        if (!first) {
          strQuery += ',' + item.id;
        } else {
          first = false;
          strQuery += item.id;
        }
      }
    });
    if (strQuery.length > 0) {
      const url = '/submission/status?submissionId=' + strQuery;
      const result = await api.get(url);
      const lst = JSON.parse(JSON.stringify(submissionList));

      if (result.status === 200) {
        for (let j = 0; j < result.data.data.statuses.length; j++) {
          const item = result.data.data.statuses[j];
          console.log(item);

          for (let i = 0; i < lst.length; i++) {
            console.log(lst[i].id);
            console.log(item.id);
            if (lst[i].id == item.id) {
              lst[i] = item;
              break;
            }
          }
        }
        setSubmissionList(lst);
      }
    } else {
      console.log('Turn off polling ');
      setIsCalling(false);
    }
  };

  const handleSubmit = async () => {
    //setInter(setInterval(()=>task(), 200));
    //task1();
    task();
    setIsCalling(true);
    //setInter(setTimeout(task, 200));
  };
  const task1 = () => {
    const url = 'http://localhost:2358/submissions?base64_encoded=true';

    const data = {
      language_id: 54,
      source_code:
        'I2luY2x1ZGU8Yml0cy9zdGRjKysuaD4KdXNpbmcgbmFtZXNwYWNlIHN0ZDsKaW50IG1haW4oKXsKICAgIGludCBuLHg7CiAgICBjaW4gPj4gbjsKICAgIGZvcihpbnQgaT0wO2k8bjtpKyspIHsKICAgICAgICBjaW4+Png7CiAgICAgICAgY291dDw8IHgrMTw8ZW5kbDsKICAgIH0KICAgIAogICAgcmV0dXJuIDA7Cn0=',
      stdin: '',
      expected_output: 'NAo3CjEKMQoxNgoxMwo='
    };

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(result => {
        const x = [...submissionList];

        setSubmissionList([...x, result.token]);
      })
      .catch(error => {});
  };

  const task2 = async () => {
    const url = '/submission/contest/submit';
    const data = {
      username: 'khoa',
      problemId: '1792A',
      sourceCode:
        'Zm9yIHMgaW5bKm9wZW4oMCldWzI6OjJdOnByaW50KGxlbihhOj1zLnNwbGl0KCkpLWEuY291bnQoJzEnKS8vMik=',
      language: 71
    };
    const result = await api.post(url, data);
    console.log(result.data);
  };

  useInterval(
    async () => {
      task();
    },
    isSubmitting ? 200 : null
  );
  useInterval(
    async () => {
      pollingStatus();
    },
    isCalling ? 200 : null
  );
  return (
    <>
      <button onClick={() => setIsSubmitting(true)}>send req</button>
      <button onClick={() => setIsSubmitting(false)}>Stop</button>
      <div>{submissionList.length}</div>
      <div>{cnt}</div>
      <Table>
        <tbody>
          {submissionList.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
