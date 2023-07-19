import { useRef } from "react";
import { Form } from "react-bootstrap"
import { FaSearch } from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import "./SearchThreadBox.css";
export const SearchThreadBox = ()=>{
    const navigate = useNavigate();

    const inpRef = useRef<HTMLInputElement>(null);

    const handleSearchThread = ()=>{
        if(!inpRef.current) return;
        const q = inpRef.current.value; 
        navigate(`/search/thread?q=${q}`);
    }
    
    return (
        <div style={{marginTop:"10px"}}>
                <div className="d-flex">
                
                <Form.Control type="text" className="search-thread-form"
                    placeholder="search" ref = {inpRef}
                />

                <div className="search-icon" onClick={handleSearchThread}><FaSearch/></div>
                </div>
                
        
        </div>
        
    )
}