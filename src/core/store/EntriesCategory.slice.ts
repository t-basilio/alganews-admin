import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CashFlow, CashFlowService } from 't-basilio-sdk';
import getThunkStatus from '../utils/getThunkStatus';

interface EntriesCategoryState {
  fetching: boolean;
  expenses: CashFlow.CategorySummary[];
  revenues: CashFlow.CategorySummary[];
}

const initialState: EntriesCategoryState = {
  fetching: false,
  expenses: [],
  revenues: [],
};

export const getCategories = createAsyncThunk(
  'cash-flow/categories/getCategories',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const categories = await CashFlowService.getAllCategories({
        sort: ['id', 'desc'],
      });
      /**
       * using local filter because API doesn't has segregate category service by type
       * @todo: update this code when API is going to changed.
       */
      const expensesCategories = categories.filter((c) => c.type === 'EXPENSE');
      const revenuesCategories = categories.filter((c) => c.type === 'REVENUE');

      await dispatch(storeExpenses(expensesCategories));
      await dispatch(storeRevenues(revenuesCategories));
    } catch (err: any) {
      return rejectWithValue({ ...err });
    }
  }
);

export const createCategory = createAsyncThunk(
  'cash-flow/categories/createCategory',
  async (category: CashFlow.CategoryInput, { dispatch }) => {
    await CashFlowService.insertNewCategory(category);
    await dispatch(getCategories());
  }
);

export const deleteCategory = createAsyncThunk(
  'cash-flow/categories/deleteCategory',
  async (categoryId: number, { dispatch }) => {
    await CashFlowService.removeExistingCategory(categoryId);
    await dispatch(getCategories());
  }
);

const entriesCategorySlice = createSlice({
  initialState,
  name: 'cash-flow/categories',
  reducers: {
    storeExpenses(state, action: PayloadAction<CashFlow.CategorySummary[]>) {
      state.expenses = action.payload;
    },
    storeRevenues(state, action: PayloadAction<CashFlow.CategorySummary[]>) {
      state.revenues = action.payload;
    },
    storeFetching(state, action: PayloadAction<boolean>) {
      state.fetching = action.payload;
    },
  },
  extraReducers(builder) {
    const { success, error, loading } = getThunkStatus([
      getCategories,
      createCategory,
      deleteCategory,
    ]);

    builder
      .addMatcher(success, (state) => {
        state.fetching = false;
      })
      .addMatcher(error, (state) => {
        state.fetching = false;
      })
      .addMatcher(loading, (state) => {
        state.fetching = true;
      });
  },
});

export const { storeFetching, storeExpenses, storeRevenues } =
  entriesCategorySlice.actions;

const entriesCategoryReducer = entriesCategorySlice.reducer;
export default entriesCategoryReducer;
