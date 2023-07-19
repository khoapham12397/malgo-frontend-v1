import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { SearchThreadBox } from "../../components/SearchThreadBox/SearchThreadBox";
import Spinner from "../../components/Spinner/Spinner";
import { ThreadSideBar } from "../../components/ThreadSideBar/ThreadSideBar";
import { ThreadSummaryTable } from "../../components/ThreadSummaryTable/ThreadSummaryTable";
import api from "../../config/axios2";
import "./ThreadSearch.css";

export const ThreadSearch = ()=>{
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q');
    const [threads , setThreads ] = useState<Array<ThreadDataSummary>|null>(null);

    useEffect(()=>{
        api.post('/discussion/search', {
            content: q,
        })
        .then(result=>{
          if(result.status ===200 && result.data.successed){
            console.log(result.data);
            setThreads(result.data.data.threads);
          }  
        })
        .catch(error=>{

        });
    },[q]);
    

    if(threads) return (
    <Container>
        <div className="d-flex" style={{justifyContent:'center'}}>
            <SearchThreadBox/>
        </div>
        <br/>
        <div className="d-flex" >
            <div style={{width:'75%'}}>
                <ThreadSummaryTable threads={threads}/>
            </div>
            <div style={{width:'25%', paddingLeft:'20px'}}>
                <ThreadSideBar/>
            </div>
        </div>
    </Container>)
    return <Spinner/>
}