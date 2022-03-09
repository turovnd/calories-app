import { createSlice } from '../../modules/store';

const initialState = {
  rows: [],
  total: 0,
  isLoading: false
};

const { actions, selectors, reducer } = createSlice({
  prefix: 'users',
  initialState,

  selectors: {
    selectRows: state => state.rows,
    selectTotal: state => state.total,
    selectIsLoading: state => state.isLoading,
  },

  reducers: {
    loadData: {
      base: (state) => {
        state.isLoading = true;
      },
      success: (state, { payload: { rows, total } }) => {
        state.rows = rows;
        state.total = total;
        state.isLoading = false;
      },
      failed: (state) => {
        state.isLoading = false;
      },
    },
    editUser: {
      base: (state) => {
        state.isLoading = true;
      },
      success: (state, { payload: { id, data } }) => {
        const index = state.rows.findIndex(r => r._id === id);
        if (index > -1) {
          state.rows.splice(index, 1, data);
        }
        state.isLoading = false;
      },
      failed: (state) => {
        state.isLoading = false;
      },
    },
    deleteUser: {
      base: (state) => {
        state.isLoading = true;
      },
      success: (state, { payload: { id } }) => {
        const index = state.rows.findIndex(r => r._id === id);
        if (index > -1) {
          state.rows.splice(index, 1);
          state.total -= 1;
        }
        state.isLoading = false;
      },
      failed: (state) => {
        state.isLoading = false;
      },
    },
  },
});

export { reducer as users, actions as usersActions, selectors as usersSelectors };
