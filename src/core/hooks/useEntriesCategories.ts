import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { useCallback } from 'react';
import * as CategoryActions from '../store/EntriesCategory.slice';
import { CashFlow } from 't-basilio-sdk';

export default function useEntriesCategories() {
  const dispatch = useAppDispatch();
  const expenses = useSelector((s: RootState) => s.cashFlow.category.expenses);
  const revenues = useSelector((s: RootState) => s.cashFlow.category.revenues);
  const fetching = useSelector((s: RootState) => s.cashFlow.category.fetching);

  const fetchCategories = useCallback(
    () => dispatch(CategoryActions.getCategories()).unwrap(),
    [dispatch]
  );

  const createCategory = useCallback(
    (category: CashFlow.CategoryInput) =>
      dispatch(CategoryActions.createCategory(category)).unwrap(),
    [dispatch]
  );

  const deleteCategory = useCallback(
    (categoryId: number) =>
      dispatch(CategoryActions.deleteCategory(categoryId)).unwrap(),
    [dispatch]
  );

  return {
    expenses,
    revenues,
    fetching,
    fetchCategories,
    createCategory,
    deleteCategory,
  };
}
