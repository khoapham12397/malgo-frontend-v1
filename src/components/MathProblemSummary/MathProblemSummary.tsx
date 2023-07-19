import { FiEye } from 'react-icons/fi';
import DropDownMenu from '../ThreadSummary/ThreeDotMenu';
import { BiCommentDetail, BiLike } from 'react-icons/bi';
import React, { useContext, useRef, useState } from 'react';
import parse from 'html-react-parser';
import { processText, formatMathExpr } from '../../utils/utils';
import { Link } from 'react-router-dom';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';

interface Props {
  summary: MathProbSummary;
}

export const MathProblemSummary = ({ summary }: Props) => {
  // id, author(username) + avatar username: + summary , created date , title
  const categories = useSelector(
    (state: RootState) => state.mathProblemList.problemCategories
  );

  return (
    <div className='thread-item'>
      <div className='space-between'>
        <div>
          <div className='title'>
            <Link to={'/mathproblem/' + summary.id} className='title-link'>
              {summary.title}
            </Link>
          </div>
          <div style={{ color: '#AAAAAA' }}>
            Created at: {new Date(Date.now()).toDateString()}
          </div>
        </div>

        <div>
          <DropDownMenu />
        </div>
      </div>

      <div id='summary-content'>
        <MathJaxContext>
          <MathJax>
            {summary.description ? parse(summary.description) : ''}
          </MathJax>
        </MathJaxContext>
      </div>
      <Table style={{ marginTop: '10px' }}>
        <tbody
          style={{ borderTop: '1px solid #DDD', borderBottom: 'transparent' }}
        >
          <tr>
            <td>Category: {summary.category.name}</td>
            <td>Difficulty: {summary.difficulty}</td>
            <td>Author: admin</td>
          </tr>
        </tbody>
      </Table>

      <div></div>
    </div>
  );
};
