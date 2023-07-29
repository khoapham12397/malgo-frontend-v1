import { MathJax } from 'better-react-mathjax';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { formatMathExpr, processChatMessage } from '../utils/utils';

export const CheckMathJax = () => {
  const [content,setContent]  = useState('');
  useEffect(() => {
    fetch('vd.html')
    .then(res=>res.text())
    .then(result=> setContent(result));
  }, []);

  return <Container>
    
    <MathJax>
      {parse(formatMathExpr(content))}
    </MathJax>
  
  </Container>;
};
