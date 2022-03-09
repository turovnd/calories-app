import { createSlice } from '../../modules/store';

const initialState = {
  profile: null
};

const { actions, selectors, reducer } = createSlice({
  prefix: 'auth',
  initialState,

  selectors: {
    selectProfile: state => state.profile,
  },

  reducers: {
    login: {},
    signup: {},
    logout: {
      base: state => {
        state.profile = initialState.profile;
      }
    },
    getProfile: {
      success: (state, { payload }) => {
        state.profile = payload;
      }
    },
    updateProfile: {
      success: (state, { payload }) => {
        state.profile = payload;
      }
    },
    addFriend: {
      success: (state, { payload }) => {
        state.profile.friends.push(payload);
      }
    },
    deleteFriend: {
      success: (state, { payload: { id } }) => {
        const index = state.profile.friends.findIndex(f => f._id === id);
        if (index > -1) {
          state.profile.friends.splice(index, 1);
        }
      }
    }
  },
});

export { reducer as auth, actions as authActions, selectors as authSelectors };
