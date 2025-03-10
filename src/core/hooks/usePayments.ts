import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import * as PaymentActions from '../store/Payment.slice';
import { Payment } from 't-basilio-sdk';
import { Key } from 'antd/lib/table/interface';

export default function usePayments() {
  const dispatch = useAppDispatch();

  const fetching = useSelector((s: RootState) => s.payment.fetching);
  const payments = useSelector((s: RootState) => s.payment.paginated);
  const query = useSelector((s: RootState) => s.payment.query);
  const selected = useSelector((s: RootState) => s.payment.selected)

  const approvePaymentsInBatch = useCallback(
    (ids: number[]) => dispatch(PaymentActions.approvePaymentsInBatch(ids)),
    [dispatch]
  );

  const deleteExistingPayment = useCallback(
    (id: number) => dispatch(PaymentActions.deleteExistingPayment(id)),
    [dispatch]
  );

  const fetchPayments = useCallback(
    () => dispatch(PaymentActions.getAllPayments()).unwrap(),
    [dispatch]
  );
 
  const setQuery = useCallback(
   (query: Payment.Query) => dispatch(PaymentActions.setQuery(query)),
   [dispatch]
  );
  
   const setSelected = useCallback(
     (keys: Key[]) => dispatch(PaymentActions.storeSelectedKeys(keys)),
     [dispatch]
   );
 
  return {
    payments,
    fetching,
    query,
    selected,
    fetchPayments,
    approvePaymentsInBatch,
    deleteExistingPayment,
    setQuery,
    setSelected,
  };
}
