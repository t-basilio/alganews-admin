import {
  combineReducers,
  configureStore,
  isRejected,
  Middleware,
} from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import UserReducer from './User.reducer';
import { notification } from 'antd';
import PaymentReducer from './Payment.slice';
import expenseReducer from './Expense.slice';
import revenueReducer from './Revenue.slice';
import entriesCategoryReducer from './EntriesCategory.slice';

const observerActions: Middleware = () => (next) => (action) => {
  if (isRejected(action)) {
    const ignoredActions = [
      'cash-flow/categories/createCategory/rejected',
      'cash-flow/categories/deleteCategory/rejected',
      'cash-flow/expenses/createExpense/rejected',
      'cash-flow/revenues/createRevenue/rejected',
    ];

    const shouldNotify = !ignoredActions.includes(action.type);

    if (shouldNotify) {
      notification.error({
        message: action.error.message,
      });
    }
  }
  next(action);
};

export const store = configureStore({
  reducer: {
    user: UserReducer,
    payment: PaymentReducer,
    cashFlow: combineReducers({
      expense: expenseReducer,
      revenue: revenueReducer,
      category: entriesCategoryReducer,
    }),
  },
  middleware: function (getDefaultMiddlewares) {
    return getDefaultMiddlewares().concat(observerActions);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
