import { useEffect, useState } from "react"
import { Container, Table } from "react-bootstrap"
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useNavigate, useParams } from "react-router-dom";
import { useInterval } from "usehooks-ts";
import { SourceCodeModal } from "../../components/SourceCodeModal/SourceCodeModal";
import api from "../../config/axios2";
import { getFixedUsername } from "../../utils/getUser";
import "./SubmissionStatus.css";
import {calColor} from "../../utils/utils";
import { languages } from "../SingleCodingProblem/Constants/LanguageOptions";

export const SubmissionStatus = ()=>{
    const [submissions , setSubmissions] = useState<Array<SubmissionData>|null>(null);
    const [ctlPagination, setCtlPagination] = useState<any>(null);
    const [showSrcModal, setShowSrcModal] = useState(false);

    const [isPolling, setIsPolling] = useState(true);

    const [chosenSubmission, setChosenSubmission] = useState<SubmissionData|null>(null);

    const {page} = useParams();
    const navigate = useNavigate();
    const toggleSrcModal =  ()=>{
        setShowSrcModal(!showSrcModal);

    }

    useEffect(()=>{
    
            const url =`/submission/${page}`;
                    
            api.get(url)
            .then(result=>{
                if(result.status == 200 ){
                    setSubmissions(result.data.data.submissions);
                    
                    const ctl ={
                        total : result.data.data.total,
                        itemPerPage : result.data.data.itemPerPage,
                    };
                    console.log('set ctl pagination');
                    console.log(ctl);
                    setCtlPagination(ctl);
                    setIsPolling(true);
                    //console.log(ctlPagination.total);
                }
            })
            
        
    },[page]);

    useEffect(()=>{
        console.log('ctl changed');
        console.log(ctlPagination);
    },[ctlPagination]);

    const handleChangePage = (page: number)=>{
        console.log(`change to page: ${page}`)
        navigate(`/submission/${page}`);
    }
    const pollingStatus = async () =>{
        let first=true;
        let strQuery = '';
        console.log("running polling function");
        if(!submissions) return;

        submissions.forEach((item:any)=>{
            if(item.result == 'PENDING' || item.result==='JUDGING') {
                if(!first) {
                    strQuery += ',' + item.id;
                } 
                else {
                    first =false; 
                    strQuery += item.id;
                }
            }
        });
        if(strQuery.length > 0) {
            const url = '/submission/status?submissionId='+strQuery;
            const result = await api.get(url);
            const lst = JSON.parse(JSON.stringify(submissions));
            
            if(result.status === 200) {
                for(let j = 0;j< result.data.data.statuses.length;j++){
                    const item= result.data.data.statuses[j];
                    console.log(item);
                    
                    for(let i=0;i<lst.length;i++) {
                        console.log(lst[i].id);
                        console.log(item.id);
                        if(lst[i].id == item.id) {
                            
                            lst[i].status = item.status;
                            lst[i].result = item.result;
                            break;
                        }
                    }
                };
                setSubmissions(lst);

            }
        }
        else {
            console.log("Turn off polling ");
            setIsPolling(false);
        }
    }

    useInterval(async ()=>{
        await pollingStatus();
    },isPolling?1000:null);
    
    
    const handleChooseSubmission = (submission: SubmissionData)=>{
        setChosenSubmission(submission);
        setShowSrcModal(true);
    }
    return (
        <Container>
        <SourceCodeModal 
            showSrcModal = {showSrcModal} 
            toggleSrcModal = {toggleSrcModal}
            submission = {chosenSubmission}
        />
        <PaginationControl
            page={Number(page)}
            between={4}
            total={ctlPagination?ctlPagination.total:10}
            limit={ctlPagination?ctlPagination.itemPerPage:4}
            changePage={handleChangePage}
            ellipsis={1}
        />
        <Table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>When</th>
                    <th>Username</th>
                    <th>Problem</th>
                    <th>Language</th>
                    <th>Exec Time</th>
                    <th>Memory</th>
                    <th>Status</th>
                </tr>
            </thead>
            
            <tbody>
                {submissions?submissions.map((item : SubmissionData)=>
                <tr key={item.id}>
                    <td className="submission-id" onClick={()=>handleChooseSubmission(item)}>{item.id}</td>
                    <td>{(new Date(item.createTime)).toLocaleString()}</td>
                    <td className="gray">{getFixedUsername(item.username)}</td>
                    <td className="submission-id">{item.problemId}</td>
                    <td>{languages.filter(x=>x.id==Number(item.language))[0].name}</td>
                    <td>1 sec</td>
                    <td>1024 kb</td>
                    <td className= {calColor(item.result)}>{item.result}</td>
                </tr>):''}    
            </tbody>
        </Table>
        <div>
        <PaginationControl
            page={Number(page)}
            between={4}
            total={ctlPagination?ctlPagination.total:10}
            limit={ctlPagination?ctlPagination.itemPerPage:4}
            changePage={handleChangePage}
            ellipsis={1}
        />
        </div>
        
        
        </Container>
        
    )
}