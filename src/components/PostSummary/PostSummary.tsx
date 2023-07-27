import { BiCommentDetail } from 'react-icons/bi';
import parse from 'html-react-parser';

type PostSummaryProps = {
  postData: PostData;
  style: string;
};

export const PostSummary = ({ postData, style }: PostSummaryProps) => {
  return (
    <div className={style}>
      <div>
        {postData.authorId.split('@')[0]} posted at{' '}
        {new Date(postData.createdAt).toLocaleString()}
      </div>
      <p style={{ color: 'white', marginBottom: '10px' }}>{postData.title}</p>
      <div className='txt-content'>{parse(postData.content)}</div>
      <p>
        <BiCommentDetail /> 0{' '}
      </p>
    </div>
  );
};
