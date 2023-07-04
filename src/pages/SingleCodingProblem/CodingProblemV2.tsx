import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import parse from 'html-react-parser';

import { Button, Form } from 'react-bootstrap';
import '../SingleCodingProblem/style.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import { formatMathExpr } from '../../utils/utils';
import { Editor, loader } from '@monaco-editor/react';
     

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { languages } from './Constants/LanguageOptions';
import './CodingProblem.css';

export const CodingProblemV2 = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [tags, setTags] = useState<Array<string>>([]);
  const editorRef = useRef<any>(null);
  const [theme, setTheme] = useState('');
  const [language, setLanguage] = useState<number>(8);
  const [mode, setMode] = useState('description');

  const problemTags = useSelector(
    (state: RootState) => state.codingProblemList.problemTags
  );

  loader.init().then(monaco => {
    import('monaco-themes/themes/Oceanic Next.json').then((data: any) => {
      monaco.editor.defineTheme('darkTheme', data);
      if (theme == '') setTheme('darkTheme');
    });

    import('monaco-themes/themes/GitHub Light.json').then((data: any) => {
      monaco.editor.defineTheme('lightTheme', data);
    });
  });

  const handleChangeMode = (mode: string) => {
    setMode(mode);
  };

  useEffect(() => {
    const url = import.meta.env.VITE_API_URL+ 'codingproblem/problem/' + problemId;
    fetch(url)
      .then(res => res.json())
      .then(result => {
        const problem: CodingProblem = result.data;
        setProblem(problem);
        let lst: Array<string> = [];
        problem.tags.forEach(item => {
          for (let i = 0; i < problemTags.length; i++) {
            if (problemTags[i].id == item.tagId) {
              lst.push(problemTags[i].name);
              break;
            }
          }
        });
        setTags(lst);
      });
    //document.body.style.overflowY = 'hidden';
    fetch('https://drive.google.com/file/d/1Q6-yr3mGWRYY6jkzsXRJZTnKY3zXxO6y/view?usp=sharing')
    .then(res=>{
      console.log(res)
    });

  }, []);// cai dong nay cung chua co day du dng:
  

  
  const handleChangeLanguage = (e: any) => {
    console.log(languages[e.currentTarget.value]);
    setLanguage(parseInt(e.currentTarget.value));
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };
  
  const handleChangeTheme = () => {
    if (theme == 'darkTheme') setTheme('lightTheme');
    else setTheme('darkTheme');
  };
  
  const handleSubmit = () => {
    const sourceCode = editorRef.current.getValue();
    const languageId = languages[language].id;
    /**** 
     * TODO : call API here
    
    */
  };
  // gia su the nay di dung:
  
  const linkHTML ='https://drive.google.com/file/d/1Q6-yr3mGWRYY6jkzsXRJZTnKY3zXxO6y/view?usp=sharing'

  return (
    <div style={{ overflowY: 'hidden',height: '100%',width:'100%', position:'fixed',backgroundColor:'white' }}>
      <div className='d-flex'>
        <div className='left-side'>
          <div style={{ display: 'flex', width: '100%' }}>
            <div
              onClick={() => handleChangeMode('description')}
              className={mode == 'description' ? 'tab-ctl-active' : 'tab-ctl'}
            >
              Description
            </div>
            <div
              onClick={() => handleChangeMode('solution')}
              className={mode == 'solution' ? 'tab-ctl-active' : 'tab-ctl'}
            >
              Solution
            </div>
            <div
              onClick={() => handleChangeMode('submission')}
              className={mode == 'submission' ? 'tab-ctl-active' : 'tab-ctl'}
            >
              Submission
            </div>
          </div>

          {mode == 'description' ? (
            <div id='description' style={{ padding: '10px' }}>
              <h2>{problem != null ? problem.title : ''}</h2>
              
            
              
              <MathJaxContext>
                <MathJax>
                  {problem == null
                    ? ''
                    : parse(formatMathExpr(problem.description))}
                </MathJax>
                <MathJax></MathJax>
              </MathJaxContext>
            </div>
          ) : (
            ''
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
                defaultValue={8}
                onChange={handleChangeLanguage}
              >
                {languages.map((item, index) => (
                  <option key={index} value={index}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </Form>
            <Button
              className='btn btn-secondary btn-control'
              onClick={handleChangeTheme}
            >
              {theme == 'darkTheme' ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>

          <div style={{ marginTop: '10px' }}>
            <Editor
              
              height={'81vh'}
              defaultValue='#include&lt;bits/stdc++.h&gt;'
              language={languages[language].value}
              onMount={handleEditorDidMount}
              theme={theme}
              options={{
                scrollBeyondLastLine: false,
                fontSize: 20
              }}
            />
          </div>
          <div className='btn-area'>
            <Button className='btn btn-secondary btn-control'>Run</Button>
            <Button
              onClick={handleSubmit}
              className='btn btn-success btn-control'
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
