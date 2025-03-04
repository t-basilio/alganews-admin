import {
  createAsyncThunk,
  createReducer,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import { User, UserService } from 't-basilio-sdk';

interface UserState {
  list: User.Summary[];
  fetching: boolean;
}

export const getAllUsers = createAsyncThunk(
  'user/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await UserService.getAllUsers({});
    } catch (err: any) {
      return rejectWithValue({ ...err });
    }
});

export const toggleUserStatus = createAsyncThunk(
  'user/toggleUserStatus',
  async (user: User.Summary | User.Detailed) =>
    user.active
      ? UserService.deactivateExistingUser(user.id)
      : UserService.activateExistingUser(user.id)
);

const initialState: UserState = {
  list: [],
  fetching: false,
};

export default createReducer(initialState, (builder) => {
  const success = isFulfilled(getAllUsers, toggleUserStatus);
  const error = isRejected(getAllUsers, toggleUserStatus);
  const loading = isPending(getAllUsers, toggleUserStatus);

  builder
    .addCase(getAllUsers.fulfilled, (state, action) => {
      state.list = action.payload;
    })
    .addMatcher(success, (state) => {
      state.fetching = false;
    })
    .addMatcher(error, (state, action) => {
      state.fetching = false;
    })
    .addMatcher(loading, (state) => {
      state.fetching = true;
    });
});
