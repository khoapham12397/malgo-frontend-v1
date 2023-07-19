import { DatePickerProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FunctionComponent, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import AdminContestProblems from '../AdminContestProblems/AdminContestProblems';
import AdminCreateContest from '../AdminCreateContest/AdminCreateContest';
import AdminCreateContestProblems from '../AdminCreateContestProblems/AdminCreateContestProblems';
import './AdminContests.css';

dayjs.extend(customParseFormat);

const AdminContests: FunctionComponent = () => {
  // Props that are passed to AdminCreateContest
  const [startDate, setStartDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const contestName = useRef<HTMLInputElement>(null);
  const contestDuration = useRef<HTMLInputElement>(null);
  const contestRatingFloor = useRef<HTMLInputElement>(null);
  const contestRatingCeil = useRef<HTMLInputElement>(null);

  // Props that are passed to AdminCreateContestProblems
  const problemName = useRef<HTMLInputElement>(null);
  const problemTimeLimit = useRef<HTMLInputElement>(null);
  const problemMemoryLimit = useRef<HTMLInputElement>(null);
  const problemDescription = useRef<HTMLTextAreaElement>(null);
  const problemPoints = useRef<HTMLInputElement>(null);
  const fileTestcases = useRef<HTMLInputElement>(null);
  const [problemTestcases, setProblemTestcases] = useState<string>('');
  const problemPointsLossPerMin = useRef<HTMLInputElement>(null);

  // Props that are passed to AdminContestProblems
  const [problems, setProblems] = useState([] as any[]);

  const handleChangeStartDate: DatePickerProps['onChange'] = (
    date: any,
    dateString: string
  ) => {
    setStartDate(dateString);
  };

  const handleChangeStartTime = (time: Dayjs | null, timeString: string) => {
    setStartTime(timeString);
  };

  const handleUploadTestcases = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = e => {
        const target = e.target;
        const result = target?.result;
        setProblemTestcases(result as string);
      };
    }
  };

  const handleClickAddProblem = () => {
    const name = problemName.current?.value;
    const time_limit = problemTimeLimit.current?.value;
    const memory_limit = problemMemoryLimit.current?.value;
    const description = problemDescription.current?.value;
    const points = problemPoints.current?.value;
    const points_loss_per_min = problemPointsLossPerMin.current?.value;
    const testcases = problemTestcases;

    if (!name) {
      toast.error('Problem name is required');
      return;
    }

    if (!time_limit) {
      toast.error('Time limit is required');
      return;
    }

    if (!memory_limit) {
      toast.error('Memory limit is required');
      return;
    }

    if (!description) {
      toast.error('Description is required');
      return;
    }

    if (!points) {
      toast.error('Points is required');
      return;
    }

    if (!fileTestcases.current?.value) {
      toast.error('Testcases is required');
      return;
    }

    if (!points_loss_per_min) {
      toast.error('Points loss per minute is required');
      return;
    }

    console.log(
      name,
      time_limit,
      memory_limit,
      description,
      points,
      testcases,
      points_loss_per_min
    );

    const newProblem = {
      name,
      time_limit: Number(time_limit),
      memory_limit: Number(memory_limit),
      description,
      points: Number(points),
      testcases,
      points_loss_per_min: Number(points_loss_per_min),
      display_order: problems.length + 1
    };

    setProblems([...problems, newProblem]);
  };

  const handleClickCreateContest = () => {
    const name = contestName.current?.value;
    const duration = contestDuration.current?.value;
    const ratingFloor = contestRatingFloor.current?.value;
    const ratingCeil = contestRatingCeil.current?.value;

    if (!name) {
      toast.error('Contest name is required');
      return;
    }

    if (!startDate) {
      toast.error('Start date is required');
      return;
    }

    if (!startTime) {
      toast.error('Start time is required');
      return;
    }

    if (!duration) {
      toast.error('Contest duration is required');
      return;
    }

    if (!ratingFloor) {
      toast.error('Rating floor is required');
      return;
    }

    if (!ratingCeil) {
      toast.error('Rating ceiling is required');
      return;
    }

    if (problems.length === 0) {
      toast.error('At least one problem is required');
      return;
    }

    // "start_time": "2023-07-05T15:56:10.006693+07:00",
    const start_time = dayjs(`${startDate} ${startTime}`).format(
      'YYYY-MM-DDTHH:mm:ss.SSSSSSZ'
    );

    console.log(start_time, name, duration, ratingFloor, ratingCeil);
  };

  return (
    <div className='admin-contests-container'>
      <AdminCreateContest
        contestName={contestName}
        contestDuration={contestDuration}
        contestRatingFloor={contestRatingFloor}
        contestRatingCeil={contestRatingCeil}
        handleChangeStartDate={handleChangeStartDate}
        handleChangeStartTime={handleChangeStartTime}
      />

      <AdminCreateContestProblems
        problemName={problemName}
        problemTimeLimit={problemTimeLimit}
        problemMemoryLimit={problemMemoryLimit}
        problemDescription={problemDescription}
        problemPoints={problemPoints}
        problemPointsLossPerMin={problemPointsLossPerMin}
        fileTestcases={fileTestcases}
        handleUploadTestcases={handleUploadTestcases}
        handleClickAddProblem={handleClickAddProblem}
      />

      <AdminContestProblems problems={problems} />

      <Button
        variant='primary'
        className='admin-create-contest-button'
        onClick={handleClickCreateContest}
      >
        Create Contest
      </Button>
    </div>
  );
};

export default AdminContests;
