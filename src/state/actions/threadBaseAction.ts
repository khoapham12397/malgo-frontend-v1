import { Dispatch } from '@reduxjs/toolkit';
import { setCategoriesAndTags } from '../reducers/threadBaseReducer';

const host = (import.meta.env.VITE_API_URL as string)+'discussion';

export const fetchCategoriesAndTags = () => {
  return function (dispatch: Dispatch<any>) {
    fetch(host + '/thread_categories_tags')
      .then(res => res.json())
      .then(result => {
        if (result.successed) {
          dispatch(setCategoriesAndTags(result.data));
        }
      });
  };
};
