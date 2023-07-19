import { useRef, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { BiPlus, BiPlusCircle } from "react-icons/bi"
import { useDispatch } from "react-redux"
import { createGroup } from "../../state/actions/chatAction"
import { getUsernameFromStorage } from "../../utils/getUser"

export const CreateGroupModal = ()=>{
    const dispatch = useDispatch<any>();
    const [show, setShow] = useState(false);
    const myUsername = getUsernameFromStorage();

    const nameRef = useRef<HTMLInputElement>(null);
    const handleCreateGroup = ()=>{
        if(myUsername && nameRef.current && nameRef.current.value.length > 0) {
            dispatch(createGroup(myUsername, nameRef.current?.value));
            setShow(false);
        }
    }
    
    const handleShow= ()=>{
        setShow(true);
    }
    
    const handleClose = () =>{
        setShow(false);
    }
    
    return (<div >
        <BiPlus size={24} onClick={handleShow}/>
        <Modal show = {show} onHide={handleClose}>
            <Modal.Header closeButton>
                <div><BiPlusCircle/> Create New Group</div>
            </Modal.Header>
            <Modal.Body>
                <Form.Control ref={nameRef} type="text" placeholder="Group Name">

                </Form.Control>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn btn-danger" onClick={handleClose}>Cancel</Button>
                <Button onClick = {handleCreateGroup}>Create</Button>
            </Modal.Footer>
        </Modal>
    </div>)
}