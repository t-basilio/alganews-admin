import { configureStore, isRejected, Middleware } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import UserReducer from "./User.reducer";
import { notification } from "antd";

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
        user: UserReducer
    },
    middleware: function (getDefaultMiddlewares) {
        return getDefaultMiddlewares().concat(observerActions)
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch;