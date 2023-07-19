import { useState } from "react";
import { getUsernameFromStorage } from "../../utils/getUser";
import { SubmissionTable } from "../SubmissionTable/SubmissionTable";
import "./ContestSubmissions.css";

type Props = {
    contestId: string | undefined;
}
export const ContestSumission = ({contestId}: Props)=>{
    
    const [filter, setFilter] = useState<SubmissionFilter>({
        contestId: contestId,
        problemId: undefined,
        username: undefined,
    });
    const [onlyMe, setOnlyMe] = useState(false);

    const hanldeChooseAllSubmission = ()=>{
        setFilter({
            ...filter, username: undefined,
        });
        setOnlyMe(false);
    }

    const handleChooseMySubmission = () =>{
        let username :any = getUsernameFromStorage();
        username = username?username:undefined;
        setFilter({
            ...filter, username: username
        });
        setOnlyMe(true);
    }

    return (<div>
        <div className='sub-type-list'>
            <div className={"sub-type" + (onlyMe?'':' chosen-sub')} onClick={hanldeChooseAllSubmission}>All Submissions</div>
            <div className={"sub-type" + (onlyMe?' chosen-sub':'')} onClick={handleChooseMySubmission}>My Submissions</div>
        </div>
        <SubmissionTable submissionFilter={filter}  />       
    </div>);
}