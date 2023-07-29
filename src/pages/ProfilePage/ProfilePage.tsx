import { FunctionComponent } from 'react';
import Logout from '../../components/Logout/Logout';
import Spinner from '../../components/Spinner/Spinner';
import useUserProfile from '../../hooks/useUserProfile';
import './ProfilePage.css';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { IoSchoolOutline } from 'react-icons/io5';
import {
  AiFillTwitterCircle,
  AiFillGithub,
  AiOutlineGlobal,
  AiFillLinkedin
} from 'react-icons/ai';
import HeatMap, { HeatMapValue } from '@uiw/react-heat-map';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Container } from 'react-bootstrap';

function getOrdinal(n: number) {
  let ord = 'th';
  if (n % 10 === 1 && n % 100 !== 11) {
    ord = 'st';
  } else if (n % 10 === 2 && n % 100 !== 12) {
    ord = 'nd';
  } else if (n % 10 === 3 && n % 100 !== 13) {
    ord = 'rd';
  }
  return n + ord;
}

interface ProfileInfoProps {
  picture: string;
  name: string;
  email: string;
  rank: number;
  location?: string;
  university?: string;
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
}

interface GridInfoProps {
  value: number[];
}

interface ProfileLineChartProps {
  data: {
    labels: string[];
    datasets: any[];
  };
}

interface ProflieRatingProps {
  rank: number;
  rating: number;
  hr: number;
  rm: number;
  lc: Date;
  level: string;
  nextLevel: number;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

enum ChartOption {
  ALL,
  RATED
}

const heatmapValue: HeatMapValue[] = [
  { date: '2016/01/11', count: 2, content: '1' },
  ...[...Array(17)].map((_, idx) => ({
    date: `2016/01/${idx + 10}`,
    count: idx,
    content: '1'
  })),
  ...[...Array(17)].map((_, idx) => ({
    date: `2016/02/${idx + 10}`,
    count: idx,
    content: '1'
  })),
  { date: '2016/04/12', count: 2, content: '1' },
  { date: '2016/05/01', count: 5, content: '1' },
  { date: '2016/05/02', count: 5, content: '1' },
  { date: '2016/05/03', count: 1, content: '1' },
  { date: '2016/05/04', count: 11, content: '1' },
  { date: '2016/05/08', count: 32, content: '1' }
];

const UserInfo = (props: ProfileInfoProps) => {
  const {
    picture,
    name = 'User',
    email = 'the User',
    rank = -1,
    location,
    university,
    website,
    github,
    twitter,
    linkedin
  } = props;
  return (
    <div className='user-info'>
      <div className='profile-block'>
        <img className='avatar-profile' src={picture} alt='Avatar' />
        <div className='profile-text'>
          <div>
            <h1 className='name'>{name}</h1>
            <h2 className='email'>{email}</h2>
          </div>
          
        </div>
      </div>
      <div className='profile-contact-block'>
        {location ? (
          <div className='contact-row'>
            <HiOutlineLocationMarker size={16} />
            <p>{location}</p>
          </div>
        ) : null}
        {university ? (
          <div className='contact-row'>
            <IoSchoolOutline size={16} />
            <p>{university}</p>
          </div>
        ) : null}
        {website ? (
          <div className='contact-row'>
            <AiOutlineGlobal size={16} />
            <p>{website}</p>
          </div>
        ) : null}
        {github ? (
          <div className='contact-row'>
            <AiFillGithub size={16} />
            <p>{github}</p>
          </div>
        ) : null}
        {twitter ? (
          <div className='contact-row'>
            <AiFillTwitterCircle size={16} />
            <p>{twitter}</p>
          </div>
        ) : null}
        {linkedin ? (
          <div className='contact-row'>
            <AiFillLinkedin size={16} />
            <p>{linkedin}</p>
          </div>
        ) : null}
      </div>
      <Logout />
    </div>
  );
};

const ProfileLineChart = (props: ProfileLineChartProps) => {
  const { data } = props;
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: false
      }
    },
  };

  return <Line options={options} data={data} />
};

const ProfileRating = (props: ProflieRatingProps) => {
  const {
    rank = 1,
    rating = -1,
    hr = -1,
    rm = -1,
    lc = new Date(),
    level = '',
    nextLevel = 0
  } = props;
  const date = new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).format(lc);
  return (
    <div className='profile-rating'>
      <div className='properties'>
        <p className=''>Rank</p>
        <p>Rating</p>
        <p>Highest Rating</p>
        <p>Rated Matches</p>
        <p>Last Completed</p>
      </div>
      <div className='values'>
        <p>{getOrdinal(rank)}</p>
        <p className='red'>{rating}</p>
        <div className='highest-rating'>
          <p className='red'>{hr}</p>
          <p>-</p>
          <p className='level'>{level}</p>
          <p className='next-level'>{`(+${nextLevel} to promote)`}</p>
        </div>
        <p>{rm}</p>
        <p>{date}</p>
      </div>
    </div>
  );
};

const GridInfo = (props: GridInfoProps) => {
  const { value } = props;
  return (
    <div className='grid-info'>
      <div className='grid-item'>
        <p className='number'>{value[0]} problems</p>
        <p className='description'>solved for all time</p>
      </div>
      <div className='grid-item'>
        <p className='number'>{value[1]} problems</p>
        <p className='description'>solved for all time</p>
      </div>
      <div className='grid-item'>
        <p className='number'>{value[2]} problem</p>
        <p className='description'>solved for all time</p>
      </div>
      <div className='grid-item'>
        <p className='number'>{value[3]} days</p>
        <p className='description'>in a row max</p>
      </div>
      <div className='grid-item'>
        <p className='number'>{value[4]} days</p>
        <p className='description'>in a row for the last year</p>
      </div>
      <div className='grid-item'>
        <p className='number'>{value[5]} days</p>
        <p className='description'>in a row for the last month</p>
      </div>
    </div>
  );
};

const ProfileInfo = () => {
  const years = [2023, 2022, 2021, 2020];
  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July'
  ];
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => Math.floor(Math.random() * 2000)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  };
  return (
    <div className='profile-info'>
      <ProfileRating
        rank={3}
        rating={3658}
        hr={3700}
        level='9 Dan'
        nextLevel={111}
        rm={48}
        lc={new Date('2021/12/01')}
      />
      <div className='divide-line' />
      <div className='chart-block'>
        <div className='select'>
          <select name='chart-option' id='chart-option'>
            <option value={ChartOption.ALL}>All</option>
            <option value={ChartOption.RATED}>Only Rated</option>
          </select>
        </div>
        <ProfileLineChart data={chartData} />
      </div>
      <div className='divide-line' />
      <div className='heat-map-block'>
        <div className='select'>
          <p>What activity will be show to other users: </p>
          <select name='heat-map-option' id='heat-map-option'>
            <option value={ChartOption.ALL}>All</option>
            <option value={ChartOption.RATED}>Only Rated</option>
          </select>
          <select name='heat-map-year' id='heat-map-year'>
            <option value={-1}>All</option>
            {years.map((year, index) => (
              <option value={year} key={index}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <HeatMap
          value={heatmapValue}
          width={800}
          startDate={new Date('2016/01/01')}
          legendRender={props => (
            <rect {...props} y={(props.y as number) + 10} rx={2} />
          )}
          rectSize={20}
          rectProps={{
            rx: 2
          }}
        />
        <GridInfo value={[27, 1, 0, 5, 1, 0]} />
      </div>
      <div className='divide-line' />
    </div>
  );
};

const ProfilePage: FunctionComponent = () => {
  const { userProfileQuery } = useUserProfile();

  if (userProfileQuery.isLoading) return <Spinner />;

  if (userProfileQuery.isError)
    return <pre>{JSON.stringify(userProfileQuery.error)}</pre>;

  const profile = {
    location: 'Viet Nam',
    university: 'University of Technology - Ho Chi Minh City',
    website: 'https://theksbd.github.io/react-portfolio/',
    github: 'theksbd',
    twitter: 'hoangdo1909',
    linkedin: 'hoang-do-4b77b8228',
    name: userProfileQuery.data.name,
    email: userProfileQuery.data.email,
    rank: 441235,
    picture: userProfileQuery.data.picture
  };

  return (
    <div className='profile-page'>
      <UserInfo {...profile} />
      <ProfileInfo />
    </div>
  );
};

export default ProfilePage;
