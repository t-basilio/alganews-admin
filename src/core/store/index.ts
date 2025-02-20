import { configureStore, isRejected, Middleware } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import UserReducer from "./User.reducer";
import { notification } from "antd";
import PaymentReducer from "./Payment.slice";

const observerActions: Middleware = () => (next) => (action) => {
    if (isRejected(action)) {
         notification.error({
           message: action.error.message,
         });
    }

    next(action)
}

export const store = configureStore({
    reducer: {
        user: UserReducer,
        payment: PaymentReducer
    },
    middleware: function (getDefaultMiddlewares) {
        return getDefaultMiddlewares().concat(observerActions)
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch;