import { createSlice } from '../../modules/store';

const initialState = {
  rows: [],
  total: 0,
  isLoading: false,
  report: {
    data: [],
    isLoading: false
  }
};

const { actions, selectors, reducer } = createSlice({
  prefix: 'journal',
  initialState,

  selectors: {
    selectRows: state => state.rows,
    selectTotal: state => state.total,
    selectIsLoading: state => state.isLoading,
    selectReport: state => state.report,
    selectCaloriesToday: (state) => {
      const today = new Date();
      return (state.report.data.find((item) => {
        const date = new Date(item.date);
        return (
          date.getFullYear() === today.getFullYear()
          && date.getMonth() === today.getMonth()
          && date.getDate() === today.getDate()
        );
      }) || { calories: 0 }).calories;
    }
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
    addData: {
      base: (state) => {
        state.isLoading = true;
      },
      success: (state, { payload: { data, rowsPerPage } }) => {
        state.rows.unshift(data);
        if (state.rows.length > rowsPerPage) {
          state.rows.pop();
        }
        state.total += 1;
        state.isLoading = false;
      },
      failed: (state) => {
        state.isLoading = false;
      },
    },
    editData: {
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
    deleteData: {
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
    loadMyReport: {
      base: (state) => {
        state.report.isLoading = true;
      },
      success: (state, { payload }) => {
        state.report.data = payload;
        state.report.isLoading = false;
      },
      failed: (state) => {
        state.report.isLoading = false;
      }
    }
  },
});

export { reducer as journal, actions as journalActions, selectors as journalSelectors };
