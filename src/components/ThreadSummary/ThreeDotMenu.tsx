import Dropdown from 'react-bootstrap/Dropdown';
import { BsThreeDotsVertical } from 'react-icons/bs';

function DropDownMenu() {
  return (
    <Dropdown>
      <Dropdown.Toggle
        variant='primary'
        style={{ backgroundColor: 'white', border: 'none', padding: '0px' }}
      >
        <BsThreeDotsVertical
          style={{ color: 'black', marginRight: '-20px' }}
          size={20}
        />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href='#/action-1'>Action</Dropdown.Item>
        <Dropdown.Item href='#/action-2'>Another action</Dropdown.Item>
        <Dropdown.Item href='#/action-3'>Something else</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropDownMenu;
