import { createSlice } from '@reduxjs/toolkit';

type ThreadBaseState = {
  categories: Array<ThreadCategory>;
  tags: Array<ThreadTag>;
};

const initialState: ThreadBaseState = {
  categories: [],
  tags: []
};

const slice = createSlice({
  name: 'threadBaseSlice',
  initialState: initialState,
  reducers: {
    setCategoriesAndTags: (state, action) => {
      state.categories = action.payload.categories;
      state.tags = [{ id: 'none', title: 'none' }, ...action.payload.tags];
    }
  }
});
export const { setCategoriesAndTags } = slice.actions;
export default slice.reducer;
