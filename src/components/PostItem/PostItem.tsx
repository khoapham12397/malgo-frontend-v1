import { BiMessage } from "react-icons/bi";
import { getAvatarLink } from "../../utils/utils";
import parse from "html-react-parser";

type PostItemProps = {
    postData: PostData;
  }
  
export const PostItem = ({postData}: PostItemProps) => {
    return (<div className='post-item'>
      <div className='p-title'>
        <BiMessage size={45} color = {"white"}/>
        <br/>
        <br/>
        <h4  style ={{color:"white"}}>{postData.title}</h4>
      </div>
      <div>
      <br/>
      <div className='d-flex'>
            <img
              src={getAvatarLink(postData.authorId)}
              className='avatar-icon'
            />
            <div style={{ paddingLeft: '10px' }}>
              <div style={{ fontWeight: 'bold',color:"grey" }}>
                  {postData.authorId.split('@')[0]}
              </div>
              <div>{new Date(postData.createdAt).toUTCString()}</div>
            </div>
      </div>
      {parse(postData.content)}
    <div>
      <br/>
      <img width={400} height="auto" src ='https://media.discordapp.net/attachments/1119239110176018513/1119239110821949612/image.png?width=707&height=603'/>
  
    </div>
      </div>
    </div>)
  }
  