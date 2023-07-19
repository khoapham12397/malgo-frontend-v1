import { toast } from "react-hot-toast";
import { BiShare } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state";
import { MESSAGE_TYPE, postShareResource, submitMessage } from "../../state/actions/chatAction";
import { toggleFriendsModal } from "../../state/reducers/chatReducer";
import { getUsernameFromStorage } from "../../utils/getUser"
import { CHAT_MESSAGE_TYPE } from "../../utils/utils";
import { FriendListModal } from "../FriendListModal/FriendListModal";

type Props = {

    resource: {
        id : string;
        type: string;
        link: string;
        title: string;
        summary: string;
    };

}
export const ShareButton = ({resource} : Props)=>{
    const myUsername = getUsernameFromStorage();
    const dispatch = useDispatch<any>();

    const shareResource = useSelector((state: RootState)=> state.chat.shareResource);

    const handleShowFriendListModal = ()=>{
        dispatch(toggleFriendsModal({}));
    }
// `thread/${shareResource.id}`

    const handleShare = (username: string, sessionId: string | null)=>{
        console.log("share")
        if(myUsername && resource) {
          
          //postShareResource(params);
          const message = JSON.stringify({
            type: CHAT_MESSAGE_TYPE.SHARE_MESSAGE, 
            share:{
                id: resource.id, 
                type: resource.type, 
                link: resource.link,
                title: resource.title,
                summary: resource.summary,
            }
          });
          
          const param : SubmitMessageParam = {
            groupId: null,
            message: message,
            postId: null,
            recieverId: username,
            referenceMessage: null,
            sessionId: sessionId,
            type: MESSAGE_TYPE.MESSAGE_P2P,
            username: myUsername,
          }
          //console.log(param);
          submitMessage(param);
          toast.success('share successed');
        }
    }
    
    return (
        <div>
            <FriendListModal 
                handleChooseItem={handleShare}
                exlusiveList = {[]}
            />
            <BiShare onClick={handleShowFriendListModal} size={22}/>

        </div>
    )
}