import {
  Button,
  DatePicker,
  Descriptions,
  Divider,
  notification,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Payment } from 't-basilio-sdk';
import usePayments from '../../core/hooks/usePayments';
import { useEffect, useState } from 'react';
import { SorterResult } from 'antd/lib/table/interface';
import moment from 'moment';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import DoubleConfirm from '../components/DoubleConfirm';
import { Link } from 'react-router-dom';
import Forbidden from '../components/Forbidden';
import useBreadcrumb from '../../core/hooks/useBreadcrumb';

export default function PaymentListView() {
  useBreadcrumb('Pagamentos/Consulta');
  const { xs } = useBreakpoint();
  const [forbidden, setForbidden] = useState(false);
  
  const {
    payments,
    fetching,
    query,
    selected,
    fetchPayments,
    setQuery,
    approvePaymentsInBatch,
    deleteExistingPayment,
    setSelected,
  } = usePayments();

  useEffect(() => {
    fetchPayments().catch(err => {
      if (err?.data?.status === 403) {
        setForbidden(true);
        return;
      }
      throw err;
    });
  }, [fetchPayments]);

  if (forbidden)
    return <Forbidden />
  
  return (
    <>
      <Row justify={'space-between'} gutter={24}>
        <Space
          direction={xs ? 'vertical' : 'horizontal'}
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <DoubleConfirm
            popConfirmTitle={
              selected.length === 1
                ? 'Você deseja aprovar o agendamento selecionado?'
                : 'Você deseja aprovar os agendamentos selecionados?'
            }
            modalTitle={'Aprovar agendamento'}
            modalCancelLabel='Cancelar'
            modalContent={
              'Esta é uma ação irreversível. Ao aprovar um agendamento, ele não poderá se removido'
            }
            onConfim={async () => {
              await approvePaymentsInBatch(selected as number[]);
              notification.success({
                message: 'Os pagamentos selecionados foram aprovados',
              });
            }}
          >
            <Button
              type={'primary'}
              disabled={selected.length === 0}
              style={{ width: xs ? '100%' : 240 }}
            >
              Aprovar agendamentos
            </Button>
          </DoubleConfirm>

          <DatePicker.MonthPicker
            style={{ width: xs ? '100%' : 240 }}
            format={'MMMM - YYYY'}
            onChange={(date) => {
              setQuery({
                scheduledToYearMonth: date ? date.format('YYYY-MM') : undefined,
              });
            }}
          />
        </Space>
        <Divider />
      </Row>
      <Table<Payment.Summary>
        dataSource={payments?.content}
        rowKey={'id'}
        loading={fetching}
        onChange={(p, f, sorter) => {
          const { order } = sorter as SorterResult<Payment.Summary>;
          const direction = order?.replace('end', '');
          if (direction && direction !== query.sort![1])
            setQuery({
              sort: [query.sort![0], direction as 'asc' | 'desc'],
            });
        }}
        pagination={{
          current: query.page ? query.page + 1 : 1,
          onChange: (page) => setQuery({ page: page - 1 }),
          total: payments?.totalElements,
          pageSize: query.size,
        }}
        rowSelection={{
          selectedRowKeys: selected,
          onChange: setSelected,
          getCheckboxProps(payment) {
            return !payment.canBeApproved ? { disabled: true } : {};
          },
        }}
        columns={[
          {
            title: 'Agendamentos',
            responsive: ['xs'],
            render(_, payment) {
              return (
                <Descriptions>
                  <Descriptions.Item label={'Editor'}>
                    {payment.payee.name}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Agendamento'}>
                    {moment(payment.scheduledTo).format('DD/MM/YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Período'}>
                    {(() => {
                      const starts = moment(payment.accountingPeriod.startsOn).format(
                        'DD/MM/YYY'
                      );
                      const ends = moment(payment.accountingPeriod.endsOn).format(
                        'DD/MM/YYY'
                      );
                      return `${starts} - ${ends}`;
                    })()}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Status'}>
                    <Tag color={payment.approvedAt ? 'green' : 'warning'}>
                      {payment.approvedAt
                        ? `Aprovado em ${moment(payment.approvedAt).format('DD/MM/YYYY')}`
                        : 'Aguardando aprovação'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={'Ações'}>
                    <Tooltip title={'Detalhar'} placement={xs ? 'top' : 'left'}>
                      <Link to={`/pagamentos/${payment.id}`}>
                        <Button size={'small'} icon={<EyeOutlined />} />
                      </Link>
                    </Tooltip>

                    <DoubleConfirm
                      popConfirmTitle='Remover agendamento?'
                      modalCancelLabel='Cancelar'
                      modalTitle='Remover agendamento'
                      modalContent='Esta é uma ação irreversível. Ao remover um agendamento ele  não poderá ser recuperado'
                      onConfim={() => {
                        deleteExistingPayment(payment.id);
                      }}
                    >
                      <Tooltip
                        title={payment.canBeDeleted ? 'Remover' : 'Pagamento já aprovado'}
                        placement={xs ? 'bottom' : 'right'}
                      >
                        <Button
                          disabled={!payment.canBeDeleted}
                          icon={<DeleteOutlined />}
                          size={'small'}
                        />
                      </Tooltip>
                    </DoubleConfirm>
                  </Descriptions.Item>
                </Descriptions>
              );
            },
          },
          {
            dataIndex: 'payee',
            title: 'Editor',
            responsive: ['sm'],
            ellipsis: true,
            width: 180,
            render(payee: Payment.Summary['payee']) {
              return <Link to={`/usuarios/${payee.id}`}>{payee.name}</Link>;
            },
          },
          {
            dataIndex: 'scheduledTo',
            title: 'Agendamento',
            align: 'center',
            responsive: ['sm'],
            width: 140,
            sorter(a, b) {
              return 0;
            },
            render(date: string) {
              return moment(date).format('DD/MM/YYYY');
            },
          },
          {
            dataIndex: 'accountingPeriod',
            title: 'Periodo',
            align: 'center',
            responsive: ['sm'],
            width: 240,
            render(period: Payment.Summary['accountingPeriod']) {
              const starts = moment(period.startsOn).format('DD/MM/YYYY');
              const ends = moment(period.endsOn).format('DD/MM/YYYY');
              return `${starts} - ${ends}`;
            },
          },
          {
            dataIndex: 'approvedAt',
            title: 'Status',
            align: 'center',
            responsive: ['sm'],
            width: 180,
            render(approvalDate: Payment.Summary['approvedAt']) {
              const formtedApprovalDate = moment(approvalDate).format('DD/MM/YYYY');
              return (
                <Tag color={approvalDate ? 'green' : 'warning'}>
                  {approvalDate
                    ? `Aprovado em ${formtedApprovalDate}`
                    : 'Aguardando aprovação'}
                </Tag>
              );
            },
          },
          {
            dataIndex: 'id',
            title: 'Ações',
            responsive: ['sm'],
            width: 100,
            render(id: number, payment) {
              return (
                <>
                  <Tooltip title='Detalhar' placement='left'>
                    <Link to={`/pagamentos/${id}`}>
                      <Button size='small' icon={<EyeOutlined />}></Button>
                    </Link>
                  </Tooltip>

                  <DoubleConfirm
                    popConfirmTitle='Remover agendamento?'
                    modalCancelLabel='Cancelar'
                    modalTitle='Remover agendamento'
                    modalContent='Esta é uma ação irreversível. Ao remover um agendamento ele  não poderá ser recuperado'
                    onConfim={() => {
                      deleteExistingPayment(payment.id);
                    }}
                  >
                    <Tooltip
                      title={payment.canBeDeleted ? 'Remover' : 'agendamento já aprovado'}
                      placement='right'
                    >
                      <Button
                        size='small'
                        icon={<DeleteOutlined />}
                        disabled={!payment.canBeDeleted}
                      ></Button>
                    </Tooltip>
                  </DoubleConfirm>
                </>
              );
            },
          },
        ]}
      />
    </>
  );
}
