import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Table } from "react-bootstrap";
import {  useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../state";
import { getAvatarLink } from "../../utils/utils";
import parse from 'html-react-parser';
import { getFixedUsername } from "../../utils/getUser";
import './threadSummaryList.css';
import { FcComments, FcLike } from "react-icons/fc";

export const ThreadSummaryList = ()=>{
    const threadList = useSelector((state: RootState)=>state.threadList.threadList);    
    
    return(
        <div>
            <Table className="tbl-thread">
            <thead></thead>
            <tbody>
            {threadList.map((threadData:Thread)=>
            <tr style={{backgroundColor:'white',paddingTop:'10px'}} key = {threadData.id}>
                <td >
                    <img className="avatar-icon" src= {getAvatarLink(threadData.author.username)}/>
                </td>
                <td >
                <div >
                    <Link to={'/thread/' + threadData.id} className='thread-title'>
                        {threadData.title}
                    </Link>
                    <div style={{color:'gray'}}>Posted by: {getFixedUsername(threadData.author.username)} at {new Date(threadData.createdAt).toUTCString()}</div>
                </div>
                <div className="summary-content">
                <MathJaxContext>
                    <MathJax>{parse(threadData.content)}</MathJax>
                </MathJaxContext>
                </div>
                </td>
                <td>
                    <div className="d-flex-center">
                        <FcComments size={22}className='like-number'/>
                        <span className='like-number'>{threadData.totalComments}</span>
                    </div>
                </td>
                <td >
                <div className="d-flex-center">
                    <FcLike
                        size={22}
                        className='like-number'
                    />
                    <span className="like-number">
                        {threadData.likes}
                    </span>
                </div>
                </td>
            </tr> )}
            </tbody>
            
        </Table>
        </div>
        
    );
}