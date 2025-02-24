import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Payment, PayrollService } from 't-basilio-sdk';
import { RootState } from '.';
import { Key } from 'antd/lib/table/interface';
import getThunkStatus from '../utils/getThunkStatus';

interface PaymentState {
  paginated: Payment.Paginated;
  fetching: boolean;
  query: Payment.Query;
  selected: Key[];
}

const initialState: PaymentState = {
  fetching: false,
  selected: [],
  query: {
    sort: ['scheduledTo', 'desc'],
    page: 0,
    size: 7,
  },
  paginated: {
    page: 0,
    size: 7,
    totalPages: 1,
    totalElements: 0,
    content: [],
  },
};

export const getAllPayments = createAsyncThunk(
  'payment/getAllPayments',
  async (_, { getState, dispatch }) => {
    const {
      payment: { query },
    } = getState() as RootState;
    const paymentPaginated = await PayrollService.getAllPayments(query);
    await dispatch(storeList(paymentPaginated));
  }
);

export const approvePaymentsInBatch = createAsyncThunk(
  'payment/approvePaymentsInBatch',
  async (paymentsId: number[], { dispatch }) => {
    await PayrollService.approvePaymentsBatch(paymentsId);
      await dispatch(getAllPayments());
      await dispatch(storeSelectedKeys([]))
  }
);

export const deleteExistingPayment = createAsyncThunk(
  'payment/deleteExistingPayment',
  async (paymentId: number, { dispatch }) => {
    await PayrollService.removeExistingPayment(paymentId);
    await dispatch(getAllPayments());
  }
);

export const setQuery = createAsyncThunk(
  'payment/setQuery',
  async (query: Payment.Query, { dispatch }) => {
    await dispatch(storeQuery(query));
    await dispatch(getAllPayments());
  }
);

const PaymentSlice = createSlice({
  initialState,
  name: 'payment',
  reducers: {
    storeList(state, action: PayloadAction<Payment.Paginated>) {
      state.paginated = action.payload;
    },
    storeQuery(state, action: PayloadAction<Payment.Query>) {
      state.query = {
        ...state.query,
        ...action.payload,
      };
    },
    storeSelectedKeys(state, action: PayloadAction<Key[]>) {
      state.selected = action.payload;
    },
  },
  extraReducers(builder) {
    const { success, error, loading } = getThunkStatus([
      getAllPayments,
      approvePaymentsInBatch,
      deleteExistingPayment
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

export const { storeList, storeQuery, storeSelectedKeys } = PaymentSlice.actions;

const PaymentReducer = PaymentSlice.reducer;
export default PaymentReducer;
