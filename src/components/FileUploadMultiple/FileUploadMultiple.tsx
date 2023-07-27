import { ChangeEvent, useState } from 'react';
import { BsFillXCircleFill } from 'react-icons/bs';

type Props = {
  files: Array<any>;
  oldFiles: Array<any>;

  setFiles: (lst: Array<any>) => void;
  setOldFiles: (lst: Array<any>) => void;
};

function FileUploadMultiple({ files, oldFiles, setFiles, setOldFiles }: Props) {
  //const [fileList, setFileList] = useState<FileList | null>(null);

  const totalFiles: any[] = [];
  oldFiles.forEach(item => totalFiles.push({ file: item, type: 0 }));
  files.forEach(item => totalFiles.push({ file: item, type: 1 }));

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    //console.log(URL.createObjectURL(e.target.files[0]));
    //setFileList(e.target.files);
    const lst = e.target.files ? [...e.target.files] : [];

    setFiles([...files, ...lst]);
  };

  const removeImg = (item: any) => {
    //console.log('remove ' + item.file);
    const lst = [];
    if (item.type == 0) {
      for (let i = 0; i < oldFiles.length; i++) {
        if (oldFiles[i] != item.file) lst.push(oldFiles[i]);
      }
      //console.log(lst);
      setOldFiles(lst);
      return;
    }
    for (let i = 0; i < files.length; i++) {
      if (files[i] != item.file) lst.push(files[i]);
    }
    setFiles(lst);
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <input type='file' onChange={handleFileChange} multiple />
      <div>
        {totalFiles.map((item, i) => (
          <div className='img-upload' key={i}>
            <img
              src={item.type == 1 ? URL.createObjectURL(item.file) : item.file}
              width='100%'
            />
            <div className='remove-btn' onClick={() => removeImg(item)}>
              <BsFillXCircleFill size={30} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ clear: 'left' }} />
    </div>
  );
}

export default FileUploadMultiple;
