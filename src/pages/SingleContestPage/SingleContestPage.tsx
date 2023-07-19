import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { ContestIntro } from "../../components/ContestIntro/ContestIntro";
import { ContestStanding } from "../../components/ContestStanding/ContestStanding";
import { ContestSumission } from "../../components/ContestSubmissions/ContestSubmissions";
import { ContestTasks } from "../../components/ContestTasks/ContestTasks";
import Spinner from "../../components/Spinner/Spinner";
import api from "../../config/axios2";
import "./SingleContestPage.css";

const CONTEST_PAGE_MODE={ 
    INTRO : 'intro',
    TASKS : 'tasks',
    SUBMISSIONS: 'submissions',
    STANDING: 'standing',
}

export const SingleContestPage = () => {
    const [mode, setMode] = useState('intro');
    const [contestData, setContestData] = useState<any>(null);

    const {contestId}  = useParams();
    

    const handleChangeMode = (mode:string)=>{
        setMode(mode);
    }

    useEffect(()=>{
        if(!contestId) return; 
        const url =`/contest/${contestId}/detail`
        api.get(url)
        .then(result=>{
            if(result.status===200) {
                setContestData(result.data.data.contest);
            }
        })
        .catch(error=>{
            toast.error(error);
        });
    },[contestId]);
    if(contestData)
        return (<Container>
        
        <div className="list-type">
            <span className={"contest-type "+ (mode=='intro'?'chosen-type':'')}
                onClick={()=>handleChangeMode(CONTEST_PAGE_MODE.INTRO)}
            >Home</span> 
            <span className={"contest-type" + (mode=='tasks'?' chosen-type':'')} onClick={()=>handleChangeMode(CONTEST_PAGE_MODE.TASKS)}>Tasks</span>
            <span className={"contest-type" + (mode=='submissions'?' chosen-type':'')} onClick={()=>handleChangeMode(CONTEST_PAGE_MODE.SUBMISSIONS)}>Submissions</span>
            <span className={"contest-type" + (mode=='standing'?' chosen-type':'')} onClick={()=>handleChangeMode(CONTEST_PAGE_MODE.STANDING)}>Standing</span>

        </div>

        {mode===CONTEST_PAGE_MODE.INTRO?
        <ContestIntro contestData={contestData}/>:
        mode===CONTEST_PAGE_MODE.TASKS?
        <ContestTasks problems={contestData.codingProblems} startTime = {contestData.startTime}/>:
        mode===CONTEST_PAGE_MODE.SUBMISSIONS?
        <ContestSumission contestId={contestData.id}/>:
        mode===CONTEST_PAGE_MODE.STANDING?
        <ContestStanding contestId={contestData.id} problems = {contestData.codingProblems.map((item:any)=>item.id)}/>
        :''}
    
    </Container>)
    else return (<Spinner/>);
}