import { Button, Card, Divider, notification, Space, Tag } from 'antd';
import { CheckCircleOutlined, PrinterOutlined } from '@ant-design/icons';
import usePayment from '../../core/hooks/usePayment';
import { useEffect } from 'react';
import PaymentHeader from '../features/PaymentHeader';
import moment from 'moment';
import PaymentBonuses from '../features/PaymentBonuses';
import PaymentPosts from '../features/PaymentPosts';
import { useHistory, useParams } from 'react-router-dom';
import NotFoundError from '../components/NotFoundError';
import usePageTitle from '../../core/hooks/usePageTitle';
import DoubleConfirm from '../components/DoubleConfirm';
import useBreadcrumb from '../../core/hooks/useBreadcrumb';

export default function PaymentDetailsView() {
  usePageTitle('Detalhes do pagamento');
  useBreadcrumb('Pagamento/Detalhes');

  const {
    payment,
    fetchPosts,
    fetchPayment,
    posts,
    fetchingPayment,
    approvePayment,
    fetchingPosts,
    paymentNotFound,
    approvingPayment,
  } = usePayment();

  const params = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    if (isNaN(Number(params.id))) {
      history.push('/pagamentos');
    } else {
      fetchPosts(Number(params.id));
      fetchPayment(Number(params.id));
    }
  }, [fetchPosts, fetchPayment, params.id, history]);

  if (paymentNotFound) {
    return (
      <Card>
        <NotFoundError
          title={'Pagamento não encontrado'}
          actionDestination={'/pagamentos'}
          actionTitle={'Voltar para lista de pagamentos'}
        />
      </Card>
    );
  }
  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button
          className='no-print'
          disabled={!payment}
          type={'primary'}
          icon={<PrinterOutlined />}
          onClick={window.print.bind(window)}
        >
          Imprimir
        </Button>
        {payment?.approvedAt ? (
          <Tag className='no-print' style={{ padding: '6px 12px' }}>
            Pagamento aprovado em {moment(payment.approvedAt).format('DD/MM/YYYY')}
          </Tag>
        ) : (
          <DoubleConfirm
            popConfirmTitle='Deseja aprovar esse agendamento'
            modalCancelLabel='Cancelar'
            modalTitle='Ação irreversível'
            modalContent='Aprovar um agendamento de pagamento gera uma despesa 
          que não pode ser removida do fluxo de caixa. Essa ação não poderá ser desfeita.'
            onConfim={async () => {
              if (payment) {
                await approvePayment(payment.id);
                fetchPayment(payment.id);
                notification.success({
                  message: 'Pagamento aprovado com sucesso',
                });
              }
            }}
          >
            <Button
              className='no-print'
              loading={approvingPayment}
              disabled={!payment || !payment.canBeApproved}
              type={'primary'}
              danger
              icon={<CheckCircleOutlined />}
            >
              Aprovar agendamento
            </Button>
          </DoubleConfirm>
        )}
      </Space>
      <Card>
        <PaymentHeader
          loading={fetchingPayment}
          editorId={payment?.payee.id}
          editorName={payment?.payee.name}
          periodStart={moment(payment?.accountingPeriod.startsOn).format('DD/MM/YYYY')}
          periodEnd={moment(payment?.accountingPeriod.endsOn).format('DD/MM/YYYY')}
          postsEarnings={payment?.earnings.totalAmount}
          totalEarnings={payment?.grandTotalAmount}
        />
        <Divider />
        <PaymentBonuses loading={fetchingPayment} bonuses={payment?.bonuses} />
        <Divider />
        <PaymentPosts loading={fetchingPosts} posts={posts} />
      </Card>
    </>
  );
}
