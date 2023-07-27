import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { MathJax } from 'better-react-mathjax';
import { formatMathExpr } from '../../utils/utils';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
const host = import.meta.env.VITE_FRONT_URL;

export const SingleLesson = () => {
  const { file } = useParams();
  const link = `/lessons/${file}.txt`;
  const [content, setContent] = useState<string>('');
  useEffect(() => {
    fetch(host + link)
      .then(res => res.text())
      .then(result => {
        let x = formatMathExpr(result);
        x = x.replace(
          /<table>/g,
          '<table class="table table-striped table-bordered">'
        );
        setContent(x);
      });
  }, []);

  return (
    <Container>
      <MathJax>{parse(content)}</MathJax>
    </Container>
  );
};
