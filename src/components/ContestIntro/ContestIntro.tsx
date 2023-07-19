import { Table } from "react-bootstrap";
import "./ContestIntro.css";


type Props = {
    contestData: any;
}

export const ContestIntro = ({contestData}: Props) =>{
   
    
    const scores = contestData.codingProblems.map((item:any)=>({
        id: item.id,
        score: item.totalPoint,
    }));

    return (<div>
        <div className='intro-container'>
            <div className="contest-title">
                {contestData.title}
                
            </div>
            <div className="contest-info">
                <h4 className='bold'>Contest Information</h4>
                <ul>
                    <li>Start: {(new Date(contestData.startTime)).toLocaleString()}</li>
                    <li>Duration: 120 minutes</li>
                    <li>Author: Admin</li>
                    <li>Rated-Range: 0-1999</li>
                </ul>
            </div>
            <div >
                <Table className="table-striped table-bordered">
                    <thead>
                        <tr>
                            <th className="td-item">Task</th>
                            <th className="td-item">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((item:any)=>
                        <tr>
                            <td className="td-item">{item.id}</td>
                            <td className="td-item">{item.score}</td>
                        </tr>)}                        
                    </tbody>
                </Table>
            </div>
            <div className="contest-rule">
            <h4 className="bold">Contest Rules</h4>
            <div>
            {contestData.description}
            </div>
            
            </div>
            <div style={{height:'150px'}}/>
        </div>
    </div>);
}