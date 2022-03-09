import { createSlice } from '../../modules/store';

const initialState = {
  statistics: {},
  isLoading: false
};

const { actions, selectors, reducer } = createSlice({
  prefix: 'statistics',
  initialState,

  selectors: {
    selectStatistics: state => state.statistics,
    selectIsLoading: state => state.isLoading,
  },

  reducers: {
    loadStatistics: {
      base: (state) => {
        state.isLoading = true;
      },
      success: (state, { payload }) => {
        state.statistics = payload;
        state.isLoading = false;
      },
      failed: (state) => {
        state.isLoading = false;
      }
    }
  },
});

export { reducer as statistics, actions as statisticsActions, selectors as statisticsSelectors };
