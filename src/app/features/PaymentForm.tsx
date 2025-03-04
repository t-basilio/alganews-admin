import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  notification,
  Row,
  Select,
  Skeleton,
  Space,
  Tabs,
  TabsProps,
  Tooltip,
} from 'antd';
import { Payment } from 't-basilio-sdk';
import useUsers from '../../core/hooks/useUsers';
import moment from 'moment';
import { useForm } from 'antd/es/form/Form';
import { DeleteOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import CurrencyInput from '../components/CurrencyInput';
import { useCallback, useEffect, useState } from 'react';
import Descriptions from 'antd/lib/descriptions';
import { FieldData } from 'rc-field-form/lib/interface';
import debounce from 'lodash.debounce';
import usePayment from '../../core/hooks/usePayment';
import formatToBrl from '../../core/utils/formatToBrl';
import AskForPaymentPreview from './AskForPaymentPreview';
import CustomError from 't-basilio-sdk/dist/CustomError';
import { BusinessError } from 't-basilio-sdk/dist/errors';
import { useHistory } from 'react-router-dom';

export default function PaymentForm() {
  const [form] = useForm<Payment.Input>();
  const { editors, fetchUsers, fetching } = useUsers();
  const history = useHistory();

  const {
    fetchingPaymentPreview,
    fetchPaymentPreview,
    paymentPreview,
    clearPaymentPreview,
    schedulePayment,
    schedulingPayment,
  } = usePayment();

  const [scheduledTo, setScheduledTo] = useState('');
  const [paymentPreviewError, setPaymentPreviewError] = useState<CustomError>();

  useEffect(() => {
    fetchUsers().catch(err => {
      if (err?.data?.status === 403) {
        return;
      }
      throw err;
    });
  }, [fetchUsers]);

  const updateScheduledDate = useCallback(() => {
    const { scheduledTo } = form.getFieldsValue();
    setScheduledTo(scheduledTo);
  }, [form]);

  const clearPaymentPreviewError = useCallback(() => {
    setPaymentPreviewError(undefined);
  }, []);

  const getPaymentPreview = useCallback(async () => {
    const { accountingPeriod, payee, bonuses } = form.getFieldsValue();
    if (payee && accountingPeriod) {
     if (payee.id && accountingPeriod.endsOn && accountingPeriod.startsOn) {
       try {
         await fetchPaymentPreview({
           payee,
           accountingPeriod,
           bonuses: bonuses || [],
         });
         clearPaymentPreviewError();
       } catch (error) {
         clearPaymentPreview();
         if (error instanceof BusinessError) {
           setPaymentPreviewError(error);
         }
         throw error;
       }
     } else {
       clearPaymentPreviewError();
       clearPaymentPreview();
     } 
    }
  }, [form, fetchPaymentPreview, clearPaymentPreview, clearPaymentPreviewError]);

  const [activeTab, setActiveTab] = useState<'payment' | 'bankAccount'>('payment');

  const handleFormChange = useCallback(
    ([field]: FieldData[]) => {
      if (Array.isArray(field?.name)) {
        if (
          field.name.includes('payee') ||
          field.name.includes('_accountingPeriod') //||
          //field.name.includes('bonuses') se inserir vai acionar esse bloco
        ) {
          getPaymentPreview();
        }
      }

      if (field.name.includes('scheduledTo')) {
        updateScheduledDate();
      }
    },
    [getPaymentPreview, updateScheduledDate]
  );

  const debouncedhandleFormChange = debounce(handleFormChange, 1500);

  const handleFormSubmit = useCallback(
    async (form: Payment.Input) => {
      const paymentDto: Payment.Input = {
        accountingPeriod: form.accountingPeriod,
        payee: form.payee,
        bonuses: form.bonuses || [],
        scheduledTo: moment(form.scheduledTo.toString()).format('YYYY-MM-DD'),
      };

      await schedulePayment(paymentDto);
      
      notification.success({
        message: 'Pagamento agendado com sucesso',
      });
      
      history.push('/pagamentos')
    },
    [schedulePayment, history]
  );

  const tabItems: TabsProps['items'] = [
    {
      key: 'payment',
      label: 'Demonstrativo',

      children: (
        <Descriptions labelStyle={{ width: 160 }} bordered size={'small'} column={1}>
          <Descriptions.Item label={'Editor'}>
            {paymentPreview?.payee.name}
          </Descriptions.Item>
          <Descriptions.Item label={'Periodo'}>
            <Space>
              {moment(paymentPreview?.accountingPeriod.startsOn).format('DD/MM/YYYY')}
              <span>à</span>
              {moment(paymentPreview?.accountingPeriod.endsOn).format('DD/MM/YYYY')}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label={'Agendamento'}>
            {scheduledTo && moment(scheduledTo.toString()).format('DDD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label={'Palavras'}>
            {paymentPreview?.earnings.words}
          </Descriptions.Item>
          <Descriptions.Item label={'Ganhos'}>
            {formatToBrl(paymentPreview?.grandTotalAmount)}
          </Descriptions.Item>
          {paymentPreview?.bonuses.map((bonus, index) => (
            <Descriptions.Item
              key={index}
              label={
                <Space>
                  {`Bônus ${index + 1}`}
                  <Tooltip title={bonus.title}>
                    <InfoCircleOutlined style={{ color: '#09f' }} />
                  </Tooltip>
                </Space>
              }
            >
              {formatToBrl(bonus.amount)}
            </Descriptions.Item>
          ))}
          <Descriptions.Item label={'Ganhos por post'}>
            {formatToBrl(paymentPreview?.earnings.totalAmount)}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'bankAccount',
      label: 'Dados bancários',
      forceRender: true,

      children: (
        <Descriptions labelStyle={{ width: 160 }} bordered size={'small'} column={1}>
          <Descriptions.Item label={'Códio do banco'}>
            {paymentPreview?.bankAccount.bankCode}
          </Descriptions.Item>
          <Descriptions.Item label={'Número da conta'}>
            {paymentPreview?.bankAccount.number}
          </Descriptions.Item>
          <Descriptions.Item label={'Dígito da conta'}>
            {paymentPreview?.bankAccount.digit}
          </Descriptions.Item>
          <Descriptions.Item label={'Agência'}>
            {paymentPreview?.bankAccount.agency}
          </Descriptions.Item>
          <Descriptions.Item label={'Tipo de conta'}>
            {paymentPreview?.bankAccount.type === 'CHECKING'
              ? 'Conta corrente'
              : 'Conta poupança'}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
  ];

  return (
    <Form<Payment.Input>
      form={form}
      layout={'vertical'}
      onFieldsChange={debouncedhandleFormChange}
      onFinish={handleFormSubmit}
    >
      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Form.Item
            label={'Editor'}
            name={['payee', 'id']}
            rules={[
              {
                required: true,
                message: 'O campo é obrigatório',
              },
            ]}
          >
            <Select
              showSearch
              loading={fetching}
              placeholder={fetching ? 'Carregando editores...' : 'Selecione um editor'}
              options={editors.map((editor) => ({
                value: editor.id,
                label: editor.name,
              }))}
              filterOption={(input, option) => {
                return (
                  (option?.label ?? '')
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0 ||
                  (option?.label ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={8}>
          <Form.Item hidden name={['accountingPeriod', 'startsOn']}>
            <Input hidden></Input>
          </Form.Item>
          <Form.Item hidden name={['accountingPeriod', 'endsOn']}>
            <Input hidden></Input>
          </Form.Item>
          <Form.Item
            label={'Período'}
            name={['_accountingPeriod']}
            rules={[
              {
                required: true,
                message: 'O campo é obrigatório',
              },
            ]}
          >
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              format={'DD/MM/YYYY'}
              onChange={(date) => {
                if (date !== null) {
                  const [starsOn, endsOn] = date;
                  form.setFieldsValue({
                    accountingPeriod: {
                      startsOn: starsOn?.format('YYYY-MM-DD'),
                      endsOn: endsOn?.format('YYYY-MM-DD'),
                    },
                  });
                } else {
                  form.setFieldsValue({
                    accountingPeriod: {
                      startsOn: undefined,
                      endsOn: undefined,
                    },
                  });
                }
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={8}>
          <Form.Item
            label={'Agendamento'}
            name={'scheduledTo'}
            rules={[
              {
                required: true,
                message: 'O campo é obrigatório',
              },
            ]}
          >
            <DatePicker
              disabledDate={(date) => {
                return (
                  date.isBefore(moment().toLocaleString()) ||
                  date.isAfter(moment().add(7, 'days').toLocaleString())
                );
              }}
              style={{ width: '100%' }}
              format={'DD/MM/YYYY'}
            />
          </Form.Item>
        </Col>
        <Divider />
        <Col xs={24} lg={12}>
          {fetchingPaymentPreview ? (
            <>
              <Skeleton />
              <Skeleton title={false} />
            </>
          ) : !paymentPreview ? (
            <AskForPaymentPreview error={paymentPreviewError} />
          ) : (
            <Tabs
              items={tabItems}
              defaultActiveKey='payment'
              activeKey={activeTab}
              onChange={(tab) => setActiveTab(tab as 'payment' | 'bankAccount')}
            />
          )}
        </Col>
        <Col xs={24} lg={12}>
          <Form.List name={'bonuses'}>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map((field, index) => {
                    return (
                      <Row gutter={24} key={index}>
                        <Col xs={24} lg={14}>
                          <Form.Item
                            //{...field}
                            name={[field.name, 'title']}
                            label={'Descrição'}
                            rules={[
                              {
                                required: true,
                                message: 'O campo é obrigatório',
                              },
                            ]}
                          >
                            <Input placeholder='E.g.: 1 milhão de views' />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={6}>
                          <Form.Item
                            initialValue={0}
                            //{...field}
                            name={[field.name, 'amount']}
                            label={'Valor'}
                            rules={[
                              {
                                required: true,
                                message: 'O campo é obrigatório',
                              }
                            ]}
                          >
                            <CurrencyInput
                              onChange={(e, amount) => {
                                const { bonuses } = form.getFieldsValue();
                                form.setFieldsValue({
                                  bonuses: bonuses?.map((bonus, index) => {
                                    return index === field.name
                                      ? { title: bonus.title, amount: amount }
                                      : bonus;
                                  }),
                                });
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={4}>
                          <Form.Item
                            //{...field}
                            label={'Remover'}
                          >
                            <Button
                              onClick={() => remove(field.name)}
                              icon={<DeleteOutlined />}
                              danger
                              size='small'
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    );
                  })}
                  <Button type='dashed' onClick={add} block icon={<PlusOutlined />}>
                    Adicionar bônus
                  </Button>
                </>
              );
            }}
          </Form.List>
        </Col>
      </Row>
      <Row justify={'end'}>
        <Button type={'primary'} htmlType='submit' loading={schedulingPayment}>
          Cadastrar agendamento
        </Button>
      </Row>
    </Form>
  );
}
