import { FunctionComponent, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ContestFilter from '../../components/ContestFilter/ContestFilter';
import ContestTable from '../../components/ContestTable/ContestTable';
import Spinner from '../../components/Spinner/Spinner';
import { ContestTableHeader } from '../../config/enums';
import useContests from '../../hooks/useContests';
import './Contest.css';

const Contest: FunctionComponent = () => {
  const [term, setTerm] = useState<string>('');
  const [minRange, setMinRange] = useState<number>(0);
  const [maxRange, setMaxRange] = useState<number>(3000);
  const { contestsQuery } = useContests();

  const handleSubmit = (term: string, minRange: number, maxRange: number) => {
    setTerm(term);
    setMinRange(minRange);
    setMaxRange(maxRange);
  };

  const reloadContests = () => {
    contestsQuery.refetch();
  };

  if (contestsQuery.isLoading) return <Spinner />;

  if (contestsQuery.isError)
    return <pre>{JSON.stringify(contestsQuery.error)}</pre>;

  return (
    <Container className='contest-container'>
      <Row className='contest-left-side'>
        <Col sm='8'>
          <ContestTable
            contests={contestsQuery.data.current?.filter(
              (contest: AlgorithmContest) =>
                contest.name.toLowerCase().includes(term.toLowerCase()) &&
                (contest.rating_floor
                  ? contest.rating_floor >= minRange
                  : true) &&
                (contest.rating_ceil ? contest.rating_ceil <= maxRange : true)
            )}
            header={ContestTableHeader.currentContest}
          />
          <ContestTable
            contests={contestsQuery.data.future?.filter(
              (contest: AlgorithmContest) =>
                contest.name.toLowerCase().includes(term.toLowerCase()) &&
                (contest.rating_floor
                  ? contest.rating_floor >= minRange
                  : true) &&
                (contest.rating_ceil ? contest.rating_ceil <= maxRange : true)
            )}
            header={ContestTableHeader.upcomingContest}
            reloadContests={reloadContests}
          />
          <ContestTable
            contests={contestsQuery.data.past?.filter(
              (contest: AlgorithmContest) =>
                contest.name.toLowerCase().includes(term.toLowerCase()) &&
                (contest.rating_floor
                  ? contest.rating_floor >= minRange
                  : true) &&
                (contest.rating_ceil ? contest.rating_ceil <= maxRange : true)
            )}
            header={ContestTableHeader.pastContest}
          />
        </Col>
        <Col sm='4'>
          <ContestFilter onSubmit={handleSubmit} />
        </Col>
      </Row>
    </Container>
  );
};

export default Contest;
