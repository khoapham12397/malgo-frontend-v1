import { createSlice } from '@reduxjs/toolkit';

type MathProblemListState = {
  filter: MathProblemFilter;

  problems: Array<MathProbSummary>;
  problemTags: Array<MathProblemTag>;
  problemCategories: Array<MathProblemCategory>;
};

const initialState: MathProblemListState = {
  filter: {
    page: 0,
    category: '',
    tags: [],
    q: null,
    startDif: 0,
    endDif: 0,
    totalPage: 0,
    total: 0,
    itemPerPage: 0
  },
  problems: [],
  problemTags: [],
  problemCategories: []
};

const MathProblemListSlice = createSlice({
  name: 'mathProblemList',
  initialState: initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload.filter;
    },
    setProblems: (state, action) => {
      
      state.problems = action.payload.problems;
      state.filter = action.payload.filter;
    },
    setCategoriesAndTags: (state, action) => {
      //console.log(action.payload.categories);

      state.problemCategories = [
        { id: '0', name: 'All' },
        ...action.payload.categories
      ];
      state.problemTags = [{ id: '0', name: 'All' }, ...action.payload.tags];
    },
    setAll: (state, action) => {
      state.problemCategories = [
        { id: '0', name: 'All' },
        ...action.payload.categories
      ];
      state.problemTags = [{ id: '0', name: 'All' }, ...action.payload.tags];
      state.filter = action.payload.filter;
      //console.log(action.payload.filter);
      state.problems = action.payload.problems;
    }
  }
});

export const { setFilter, setProblems, setCategoriesAndTags, setAll } =
  MathProblemListSlice.actions;

export default MathProblemListSlice.reducer;
