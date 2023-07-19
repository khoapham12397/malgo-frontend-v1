import { Input } from 'antd';
import { FunctionComponent } from 'react';

const { Search } = Input;

interface Props {
  handleSearch: (value: string) => void;
}

const SearchBar: FunctionComponent<Props> = ({ handleSearch }) => {
  return (
    <div>
      <Search
        placeholder='Search problems titles'
        onSearch={handleSearch}
        style={{ width: 463 }}
      />
    </div>
  );
};

export default SearchBar;
