import { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { BiUser } from "react-icons/bi";
import { UserContext } from "../../contexts/UserContext";

type LoginPanelProps = {
    show : boolean;
    setShow: (show: boolean) => void;
  }
  
  
export const LoginPanel = () => {
  
    const lst = ["test1","test2","test3"];
    const [show,setShow] =useState(false);
    
    const { user, setUser } = useContext(UserContext);
  
    const handleLogin = (item: string ) =>{
      setUser({username: item , email : item+'@gmail.com'});
      setShow(false);
      toast.success(`you are logined as ${item}`);
    }
    
    return (
      <div className='control-item'>
        <BiUser size={24} onClick={()=>setShow(true)}/>
      <Modal show={show} onHide={() => setShow(false)} size = {'sm'}>
          <Modal.Header>
            Login Form
          </Modal.Header>
          <Modal.Body>
          <ul>
            {lst.map(item=> <li className='user-item' key = {item} onClick = {()=>handleLogin(item)}>
             <img src = 'https://avatar.oxro.io/avatar.svg?name=Khoa&length=1' className='avatar-msg'/> {item}
              </li>)}
          </ul>
          </Modal.Body>
          
      </Modal>
              
      </div>
    ) 
  }