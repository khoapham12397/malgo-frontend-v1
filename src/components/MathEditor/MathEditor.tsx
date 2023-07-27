import { useEffect, useRef, useState } from 'react';
import parse from 'html-react-parser';
import { formatMathExpr, processText } from '../../utils/utils';
import FileUploadMultiple from '../FileUploadMultiple/FileUploadMultiple';
import { BsFillImageFill } from 'react-icons/bs';
import { Button } from 'react-bootstrap';
import './MathEditor.css';
import { MathJax } from 'better-react-mathjax';
import { toast } from 'react-hot-toast';
import {
  createMathNote,
  editMathNote
} from '../../state/actions/mathProblemListAction';
import { getUsernameFromStorage } from '../../utils/getUser';

type Props = {
  mathProblem: MathProbItem;
  type: string;
  showType: string;
  mathNote: MathNote | null;
  setMathNoteAndSolution: (note: MathNote, mySolution: MathSolution) => void;
};

export const MathEditor = ({
  mathProblem,
  type,
  showType,
  mathNote,
  setMathNoteAndSolution
}: Props) => {
  const noteArea = useRef<HTMLTextAreaElement>(null);
  const [noteRaw, setNoteRaw] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const myUsername = getUsernameFromStorage();

  const [files, setFiles] = useState<Array<any>>([]);

  const [oldFiles, setOldFiles] = useState<Array<any>>([]);

  const handleChangeFiles = (files: Array<any>) => {
    setFiles(files);
  };

  const handleChangeOldFiles = (oldFiles: Array<any>) => {
    setOldFiles(oldFiles);
  };

  useEffect(() => {
    if (mathNote) {
      setOldFiles(mathNote.imageLink);
      setNoteRaw(mathNote.content);

      setFiles([]);
      if (mathNote.imageLink) {
        setShowFileUpload(true);
      }
    }
  }, [mathNote]);

  useEffect(() => {
    if (noteArea && showType != '') noteArea.current?.focus();
  }, [showType]);

  const handleSave = (addToSolution: boolean) => {
    if (!myUsername) {
      toast.error('You must login before');
      return;
    }

    if (!noteArea.current || noteArea.current.value.length === 0) {
      return;
    }

    const data = new FormData();

    files.forEach((file, i) => {
      data.append('uploadedImages', file, file.name);
    });
    //console.log(oldFiles);

    const param = !mathNote
      ? ({
          username: myUsername ? myUsername : undefined,
          content: noteArea.current.value,
          numImg: files.length,
          problemId: mathProblem.id,
          addToSolution: addToSolution
        } as CreateMathNoteParam)
      : ({
          addToSolution: addToSolution,
          content: noteArea.current.value,
          oldImages: oldFiles,
          problemId: mathProblem.id,
          username: myUsername ? myUsername : undefined
        } as EditMathNoteParam);

    data.set('data', JSON.stringify(param));

    if (!mathNote) {
      createMathNote(data).then(result => {
        if (result.successed) {
          toast.success('successed');
          setMathNoteAndSolution(result.data.note, result.data.solution);
        }
      });
    } else
      editMathNote(data).then(result => {
        if (result.successed) {
          toast.success('successed');
          setMathNoteAndSolution(result.data.note, result.data.solution);
        } else toast.error(result.message);
      });
  };

  return (
    <div className='math-editor'>
      <textarea
        ref={noteArea}
        className='form-control'
        rows={8}
        placeholder={'write note here'}
        defaultValue={noteRaw}
      />
      <div className={showPreview ? 'note-preview:active' : 'note-preview'}>
        <MathJax>{parse(formatMathExpr(processText(noteRaw)))}</MathJax>
      </div>
      {showFileUpload ? (
        <FileUploadMultiple
          files={files}
          oldFiles={oldFiles}
          setFiles={handleChangeFiles}
          setOldFiles={handleChangeOldFiles}
        />
      ) : (
        ''
      )}
      <div className='space-between' style={{ marginTop: '10px' }}>
        <div>
          <Button
            className='btn btn-info btn-control'
            onClick={e => setShowFileUpload(true)}
          >
            <BsFillImageFill /> Image
          </Button>
          <Button className='btn btn-success btn-control'>Add tag</Button>
          <Button
            className='btn btn-secondary btn-control'
            style={{ marginRight: '10px' }}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide Preview' : 'Preview'}
          </Button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'right' }}>
          <Button
            className='btn btn-success btn-control'
            onClick={() => handleSave(true)}
          >
            Add to Solution
          </Button>
          <Button
            className='btn btn-success '
            onClick={() => handleSave(false)}
          >
            Save Note
          </Button>
        </div>
      </div>
    </div>
  );
};
