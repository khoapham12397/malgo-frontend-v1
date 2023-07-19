import { createSlice } from '@reduxjs/toolkit';

type CodingProblemInfo = {
  id: string;
  title: string;
  category: {
    id: string;
    name: string;
  };
  codeforcesTag: Array<string>;
  difficulty: number;
  practicePoint: number;
  acceptedNumber: number;
  submissionNumber: number;
};

type CodingProblemTag = {
  id: string;
  name: string;
};
type CodingProblemCategory = {
  id: string;
  name: string;
};

type CodingProblemListState = {
  filter: CodingProblemFilter;

  problems: Array<CodingProblemInfo>;
  problemTags: Array<CodingProblemTag>;
  problemCategories: Array<CodingProblemCategory>;
};

const initialState: CodingProblemListState = {
  filter: {
    page: 0,
    category: '',
    tags: [],
    q: null,
    startDif: 0,
    endDif: 0,
    totalPage: 0,
    total: 0
  },
  problems: [],
  problemTags: [],
  problemCategories: []
};

const CodingProblemListSlice = createSlice({
  name: 'codingProblemList',
  initialState: initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload.filter;
    },
    setProblems: (state, action) => {
      console.log('set problems:');
      console.log(action.payload.problems);
      console.log('set filter: ');
      console.log(action.payload.filter);
      state.problems = action.payload.problems;
      state.filter = action.payload.filter;
    },
    setCategoriesAndTags: (state, action) => {
      console.log(action.payload.categories);

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
      state.problems = action.payload.problems;
    }
  }
});

export const { setFilter, setProblems, setCategoriesAndTags, setAll } =
  CodingProblemListSlice.actions;

export default CodingProblemListSlice.reducer;
