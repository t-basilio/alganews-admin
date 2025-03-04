import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { useCallback } from 'react';
import * as AuthActions from '../store/Auth.slice';

export default function useAuth() {
  const dispatch = useAppDispatch();
  const user = useSelector((s: RootState) => s.auth.user);
  const fetching = useSelector((s: RootState) => s.auth.fetching);

  const fetchUser = useCallback(
    (userId: number) => {
      return dispatch(AuthActions.fetchUser(userId)).unwrap();
    },
    [dispatch]
  );

  return {
    user,
    fetching,
    fetchUser,
  };
}
