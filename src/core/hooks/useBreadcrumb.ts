import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { useEffect } from 'react';
import { setBreadcrumb } from '../store/UI.slice';

export default function useBreadcrumb(newBreadcrumb?: string) {
  const dispatch = useAppDispatch();
  const breadcrumb = useSelector((s: RootState) => s.ui.breadcrumb);

  useEffect(() => {
    if (newBreadcrumb) {
      dispatch(setBreadcrumb(newBreadcrumb.split('/')));
    }
  }, [dispatch, newBreadcrumb]);

  return {
    breadcrumb,
  };
}
