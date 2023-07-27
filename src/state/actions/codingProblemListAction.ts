import { Dispatch } from '@reduxjs/toolkit';
import {
  setAll,
  setCategoriesAndTags,
  setProblems
} from '../reducers/CProblemListReducer';
import store from '..';
import { toast } from 'react-hot-toast';
const host = (import.meta.env.VITE_API_URL as string) + 'codingproblem';

export const fetchCProblems = (params: GetProblemsParam) => {
  let url = host + '/search';
  // no la post method
  return function (dispatch: Dispatch) {
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(result => {
        if (result.successed) {
          const filter: CodingProblemFilter = {
            category: params.category,
            startDif: params.startDif,
            endDif: params.endDif,
            tags: params.tagList,
            page: params.page,
            q: params.q,
            totalPage: result.data.totalPage,
            total: result.data.total
          };
          //console.log(result);
          dispatch(
            setProblems({
              filter: filter,
              problems: result.data.problems
            })
          );
        }
      });
  };
};

export const fetchCpCategoriesAndTags = () => {
  return function (dispatch: Dispatch) {
    fetch(host + '/categories_tags')
      .then(res => res.json())
      .then(result => {
        if (result.successed) {
          if (store.getState().codingProblemList.problemCategories.length > 0)
            return;
          dispatch(setCategoriesAndTags(result.data));
        }
      });
  };
};
export const fetchInit = async (dispatch: Dispatch<any>) => {
  // adding param vao dung: // dong ia n:
  //const res = await fetch(host + '/categories_tags');
  // const result = await res.json();
  //if (result.successed) {
    const params: GetProblemsParam = {
      category: null,
      endDif: null,
      startDif: null,
      page: 1,
      q: null,
      tagList: [],
      init: true,
    };
    const rs = await fetch(host + '/search', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    });
    const result1 = await rs.json();
    if (result1.successed) {
      const filter: CodingProblemFilter = {
        category: params.category,
        startDif: params.startDif,
        endDif: params.endDif,
        tags: params.tagList,
        page: params.page,
        q: params.q,
        totalPage: result1.data.totalPage,
        total: result1.data.total
      };
      dispatch(
        setAll({
          categories: result1.data.categoriesAndTags.categories,
          tags: result1.data.categoriesAndTags.tags,
          filter: filter,
          problems: result1.data.problems
        })
      );
    } else {
      //dispatch(setCategoriesAndTags(result.data));
      toast.error('Some error occured');
    }
  //}
};
