import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import * as UserActions from '../store/User.reducer';
import { User } from 't-basilio-sdk';

export default function useUsers() {
  const dispatch = useAppDispatch();

  const users = useSelector((state: RootState) => state.user.list);
  const fetching = useSelector((state: RootState) => state.user.fetching);

  const editors = useMemo(() => {
    return users.filter((user) => user.role === 'EDITOR')
  },[users]);

  const fetchUsers = useCallback(() => {
    return dispatch(UserActions.getAllUsers()).unwrap();
  }, [dispatch]);

  const toggleUserStatus = useCallback(
    async (user: User.Detailed | User.Summary) => {
      await dispatch(UserActions.toggleUserStatus(user));
      dispatch(UserActions.getAllUsers());
    },
    [dispatch]
  );

  return {
    users,
    fetchUsers,
    fetching,
    toggleUserStatus,
    editors
  };
}
