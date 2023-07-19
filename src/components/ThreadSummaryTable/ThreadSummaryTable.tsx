import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getFixedUsername } from "../../utils/getUser";
import { getAvatarLink } from "../../utils/utils";
import "./ThreadSummaryTable.css";
import parse from "html-react-parser";
import { FcComments, FcLike } from "react-icons/fc";

type Props = {
    threads: Array<ThreadDataSummary>
}


export const ThreadSummaryTable = ({threads}: Props)=> {
    
    return (
    <Table className="tbl-thread">
    <thead></thead>
    <tbody>
    {threads.map((threadData:ThreadDataSummary)=>
    <tr style={{backgroundColor:'white',paddingTop:'10px'}} key = {threadData.id}>
        <td >
            <img className="avatar-icon" src= {getAvatarLink(threadData.authorId)}/>
        </td>
        <td >
        <div >
            <Link to={'/thread/' + threadData.id} className='thread-title'>
                {threadData.title}
            </Link>
            <div style={{color:'gray'}}>Posted by: {getFixedUsername(threadData.authorId)} at {new Date(threadData.id).toUTCString()}</div>
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
    
</Table>)
}