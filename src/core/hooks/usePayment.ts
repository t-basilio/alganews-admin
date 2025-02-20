import { useCallback, useState } from 'react';
import { Payment, PayrollService, Post } from 't-basilio-sdk';
import { ResourceNotFoundError } from 't-basilio-sdk/dist/errors';

export default function usePayment() {
  const [posts, setPosts] = useState<Post.WithEarnings[]>([]);
  const [payment, setPayment] = useState<Payment.Detailed>();
  const [paymentPreview, setPaymentPreview] = useState<Payment.Preview>();

  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [fetchingPayment, setFetchingPayment] = useState(false);
  const [approvingPayment, setApprovingPayment] = useState(false);
  const [fetchingPaymentPreview, setFetchingPaymentPreview] = useState(false);
  const [schedulingPayment, setSchedulingPayment] = useState(false);

  const [paymentNotFound, setPaymentNotFound] = useState(false);
  const [postNotFound, setPostNotFound] = useState(false);

  const fetchPayment = useCallback(async (paymentId: number) => {
    try {
      setFetchingPayment(true);
      const payment = await PayrollService.getExistingPayment(paymentId);
      setPayment(payment);
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        setPaymentNotFound(true);
      } else {
        throw error;
      }
    } finally {
      setFetchingPayment(false);
    }
  }, []);

  const approvePayment = useCallback(async (paymentId: number) => {
    try {
      setApprovingPayment(true);
      await PayrollService.approvePayment(paymentId);
    } finally {
      setApprovingPayment(false);
    }
  }, []);

  const fetchPosts = useCallback(async (paymentId: number) => {
    try {
      setFetchingPosts(true);
      const posts = await PayrollService.getExistingPaymentPosts(paymentId);
      setPosts(posts);
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        setPostNotFound(true);
      } else {
        throw error;
      }
    } finally {
      setFetchingPosts(false);
    }
  }, []);

  const fetchPaymentPreview = useCallback(
    async (paymentPreview: Payment.PreviewInput) => {
      try {
        setFetchingPaymentPreview(true);
        const preview = await PayrollService.getPaymentPreview(paymentPreview);
        setPaymentPreview(preview);
      } finally {
        setFetchingPaymentPreview(false);
      }
    },
    []
  );

  const schedulePayment = useCallback(async (paymentInput: Payment.Input) => {
    try {
      setSchedulingPayment(true)
      await PayrollService.insertNewPayment(paymentInput)
    } finally {
      setSchedulingPayment(false);
    }
  }, [])

  const clearPaymentPreview = useCallback(() => {
    setPaymentPreview(undefined);
  }, []);

  return {
    posts,
    payment,
    fetchPosts,
    fetchPayment,
    fetchingPayment,
    fetchingPosts,
    paymentNotFound,
    postNotFound,
    approvePayment,
    approvingPayment,
    fetchPaymentPreview,
    fetchingPaymentPreview,
    paymentPreview,
    clearPaymentPreview,
    schedulePayment,
    schedulingPayment
  };
}
