import { useAuth0 } from '@auth0/auth0-react';
import { Editor, loader } from '@monaco-editor/react';
import axios from 'axios';
import { useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import ModalProblemResult from '../../components/ModalProblemResult/ModalProblemResult';
import Spinner from '../../components/Spinner/Spinner';
import useCodingContestProblem from '../../hooks/useCodingContestProblem';
import useCodingContestSubmissions from '../../hooks/useCodingContestSubmissions';
import useCodingLanguage from '../../hooks/useCodingLanguage';
import '../SingleCodingProblem/style.css';
import './CodingProblem.css';
import { languages } from './Constants/LanguageOptions';
import Description from './Description';
import Submission from './Submission';

const ContestProblem = () => {
  const { id: contestId, problemId } = useParams();
  const editorRef = useRef<any>(null);
  const [theme, setTheme] = useState('');
  const [languageId, setLanguageId] = useState<number>(
    languages.find(item => item.name === 'C++ (GCC 8.3.0)')?.id as number
  );
  const [mode, setMode] = useState('description');
  const { codingLanguageQuery } = useCodingLanguage();
  const { isAuthenticated } = useAuth0();
  const [showModalResult, setShowModalResult] = useState<boolean>(false);
  const [problemResult, setProblemResult] = useState(null);
  const { codingContestProblemQuery } = useCodingContestProblem(
    contestId,
    problemId
  );
  const { codingContestSubmissionsQuery } = useCodingContestSubmissions(
    contestId,
    problemId
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  loader.init().then(monaco => {
    import('monaco-themes/themes/Oceanic Next.json').then((data: any) => {
      monaco.editor.defineTheme('darkTheme', data);
      if (theme === '') setTheme('darkTheme');
    });

    import('monaco-themes/themes/GitHub Light.json').then((data: any) => {
      monaco.editor.defineTheme('lightTheme', data);
    });
  });

  const handleChangeMode = (mode: string) => {
    setMode(mode);
  };

  const handleChangeLanguage = (e: any) => {
    // console.log(languages[e.currentTarget.value]);
    setLanguageId(parseInt(e.currentTarget.value));
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  const handleChangeTheme = () => {
    if (theme === 'darkTheme') setTheme('lightTheme');
    else setTheme('darkTheme');
  };

  const handleCloseModalResult = () => {
    setShowModalResult(false);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to submit');
      return;
    }
    if (editorRef.current.getValue() === '') {
      toast.error('Please write your code');
      return;
    }
    setIsSubmitting(true);
    const source_code = editorRef.current.getValue();
    const username = localStorage.getItem('username');
    const url =
      (import.meta.env.VITE_API_URL_2 as string) +
      `contest/${contestId}/problem/${problemId}/user/${username}/submission`;
    const response = await axios.post(url, {
      source_code,
      language_id: languageId
    });
    // console.log(response.data);
    setProblemResult(response.data);
    setShowModalResult(true);
    setIsSubmitting(false);
    codingContestSubmissionsQuery.refetch();
    setTimeout(() => {
      codingContestSubmissionsQuery.refetch();
    }, 5000);
  };

  if (
    codingLanguageQuery.isLoading ||
    codingContestProblemQuery.isLoading ||
    codingContestSubmissionsQuery.isLoading
  )
    return <Spinner />;

  if (codingLanguageQuery.isError)
    return <pre>{JSON.stringify(codingLanguageQuery.error)}</pre>;

  if (codingContestSubmissionsQuery.isError)
    return <pre>{JSON.stringify(codingContestSubmissionsQuery.error)}</pre>;

  if (codingContestProblemQuery.isError)
    return <pre>{JSON.stringify(codingContestProblemQuery.error)}</pre>;

  return (
    <div style={{ height: '100%' }}>
      <ModalProblemResult
        problemName={codingContestProblemQuery.data?.name}
        showModalResult={showModalResult}
        problemResult={problemResult}
        handleCloseModalResult={handleCloseModalResult}
      />
      <div className='d-flex'>
        <div className='left-side'>
          <div style={{ display: 'flex', width: '100%' }}>
            <div
              onClick={() => handleChangeMode('description')}
              className={
                mode === 'description'
                  ? 'contest-tab-ctl-active'
                  : 'contest-tab-ctl'
              }
            >
              Description
            </div>
            <div
              onClick={() => handleChangeMode('submission')}
              className={
                mode === 'submission'
                  ? 'contest-tab-ctl-active'
                  : 'contest-tab-ctl'
              }
            >
              Submission
            </div>
          </div>

          {mode === 'description' ? (
            <Description problem={codingContestProblemQuery.data} />
          ) : (
            <Submission submissions={codingContestSubmissionsQuery.data} />
          )}
        </div>

        <div className='right-side'>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '10px'
            }}
          >
            <Form>
              <Form.Select
                className='lan-form'
                defaultValue={languageId}
                onChange={handleChangeLanguage}
              >
                {codingLanguageQuery.data?.map((item: CodingLanguage) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </Form>
            <Button
              className='btn btn-secondary btn-control'
              onClick={handleChangeTheme}
            >
              {theme === 'darkTheme' ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>

          <div style={{ marginTop: '10px' }}>
            <Editor
              height={'75vh'}
              defaultValue='// Write your code here'
              language={languages.find(item => item.id === languageId)?.value}
              onMount={handleEditorDidMount}
              theme={theme}
              options={{
                scrollBeyondLastLine: false,
                fontSize: 18
              }}
            />
          </div>
          <div className='btn-area'>
            <Button className='btn btn-secondary btn-control'>Run</Button>
            <Button
              onClick={handleSubmit}
              className='btn btn-success btn-control'
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestProblem;
