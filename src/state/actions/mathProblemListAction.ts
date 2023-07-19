import { Dispatch } from '@reduxjs/toolkit';
import {
  setAll,
  setCategoriesAndTags,
  setProblems
} from '../reducers/MathProblemListReducer';
import store from '..';
import { toast } from 'react-hot-toast';
import api from '../../config/axios2';

const baseUrl = (import.meta.env.VITE_API_URL as string) + 'mathproblem';

export const fetchMathProblems = (params: GetProblemsParam) => {
  let url = baseUrl + '/search';
  console.log(url);
  return function (dispatch: Dispatch) {
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(result => {
        if (result.successed) {
          const filter: MathProblemFilter = {
            category: params.category,
            startDif: params.startDif,
            endDif: params.endDif,
            tags: params.tagList,
            page: params.page,
            q: params.q,
            totalPage: result.data.totalPage,
            total: result.data.total,
            itemPerPage: result.data.itemPerPage
          };
          console.log(result);
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

export const fetchMathCategoriesAndTags = () => {
  return function (dispatch: Dispatch) {
    fetch(baseUrl + '/categories_tags')
      .then(res => res.json())
      .then(result => {
        if (result.successed) {
          if (store.getState().mathProblemList.problemCategories.length > 0)
            return;
          dispatch(setCategoriesAndTags(result.data));
        }
      });
  };
};
export const fetchInit = async (dispatch: Dispatch<any>, page: number) => {
  const res = await fetch(baseUrl + '/categories_tags');
  const result = await res.json();
  if (result.successed) {
    const params: GetProblemsParam = {
      category: null,
      endDif: null,
      startDif: null,
      page: page,
      q: null,
      tagList: []
    };
    const rs = await fetch(baseUrl + '/search', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    });
    const result1 = await rs.json();
    if (result1.successed) {
      const filter: MathProblemFilter = {
        category: params.category,
        startDif: params.startDif,
        endDif: params.endDif,
        tags: params.tagList,
        page: params.page,
        q: params.q,
        totalPage: result1.data.totalPage,
        total: result1.data.total,
        itemPerPage: result1.data.itemPerPage
      };
      dispatch(
        setAll({
          categories: result.data.categories,
          tags: result.data.tags,
          filter: filter,
          problems: result1.data.problems
        })
      );
    } else {
      dispatch(setCategoriesAndTags(result.data));
    }
  }
};

export const postMathProblem = (params: CreateMathProblemParam) => {
  if (params.username == undefined) {
    toast.error("You're not logged in!");
    return;
  }

  fetch(baseUrl + '/create', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(result => {
      if (result.successed) {
        toast.success('create problem successed');
      } else toast.error('some error occured');
    })
    .catch(err => {
      alert('error!!!');
    });
};

export const editMathProblem = (params: EditMathProbParam) => {
  fetch(baseUrl + '/problem', {
    method: 'PUT',
    body: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(result => {
      if (result.successed) {
        toast.success('Edit Problem Successed');
        console.log(result.data.mathProblem);
      } else toast.error(result.message);
    });
};

export const createMathNote = async (params : any) =>{
  const res = await api.post(baseUrl + '/note', params)
  return res.data;
}

export const editMathNote = async (params: any)=>{
  const res = await api.put(baseUrl + '/note', params);
  return res.data;
}

export const getMathProblem = async (problemId: string, username: string |undefined) =>{
  let url = baseUrl + `/problem/${problemId}`;
  if(username !== undefined) url += `?username=${username}`;
  const res = await api.get(url);
  return res.data;
}

export const getMathSolutions = async (problemId: string)=>{
  const res = await api.get(baseUrl + `/solutions?problemId=${problemId}`);
  return res.data;
}

export const getMathProblemSets = async ()=>{
  const res = await api.get(baseUrl + `/set`);
  return res.data;
}

export const getMathSet = async (setId: string)=>{
  const res = await api.get(baseUrl + `/set/${setId}`);
  return res.data;
} 

export const createMathSet = async (params: any) =>{
  const res = await api.post(baseUrl + '/set', params);
  return res.data;
}
