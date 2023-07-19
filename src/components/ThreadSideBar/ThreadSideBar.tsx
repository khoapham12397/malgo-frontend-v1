import { BiLink, BiStar } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export const ThreadSideBar = ()=>{
    const navigate = useNavigate();

    return (<>
        <div className='header-category'>
            <BiStar size={25} />
                <div style={{ fontSize: '18px', paddingLeft: '15px' }}>
                  Topics
                </div>
              </div>
            <div className='box-side-bar'>
              
              <ul style={{ padding: '0px' }}>
                <li className='category-item' onClick={()=>navigate('/threads/Graph&nbsp;Theory')}>
                  
                  <span>Graph Theory</span>
                </li>
                <li className='category-item' onClick={()=>navigate('/threads/Combinatorics')}>
                 
                  Combinatorics
                </li>
                <li className='category-item'>
                  
                  Euclidean Geometry
                </li>
                <li className='category-item'  onClick={()=>navigate('/threads/NumberTheory')}>
                  
                  Number theory
                </li>
                <li className='category-item' onClick={()=>navigate('/threads/Algebra')}>
                 
                  Algebra
                </li>
                <li className='category-item' onClick={()=>navigate('/threads/Algorithm')}>
                  
                  Algorithm
                </li>
              </ul>
            </div>
            <div className='box-side-bar'>
              <div
                className='d-flex'
                style={{ borderBottom: '0.5px solid #ddd', padding: '10px' }}
              >
                <BiStar size={25} />
                <div style={{ fontSize: '18px', paddingLeft: '15px' }}>
                  Must Read Post
                </div>
              </div>

              <div
                className='d-flex'
                style={{ borderBottom: '0.5px solid #ddd', padding: '10px' }}
              >
                <BiLink size={25} />
                <div style={{ fontSize: '18px', paddingLeft: '15px' }}>
                  Must Read Post
                </div>
              </div>
              
            </div>
    </>);
}