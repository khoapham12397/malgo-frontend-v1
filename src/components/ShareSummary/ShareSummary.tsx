import { Link } from 'react-router-dom';
import './ShareSummary.css';

export type ShareData = {
  id: string;
  title: string;
  summary: string;
  link: string;
  type: string;
};
type Props = {
  shareData: ShareData;
};

export const ShareSummary = ({ shareData }: Props) => {
  return (
    <div className='share-summary-container'>
      <Link to={shareData.link} style={{ color: '#ddd' }}>
        <div className='header-summary link'>{shareData.title}</div>
        <div className='share-summary'>
          <div className='share-summary-content'>{shareData.summary}</div>
        </div>
      </Link>
    </div>
  );
};
