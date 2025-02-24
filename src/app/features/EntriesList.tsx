import { Button, Card, DatePicker, Descriptions, Space, Table, Tag } from 'antd';
import { CashFlow } from 't-basilio-sdk';
import useCashFlow from '../../core/hooks/useCashFlow';
import { useEffect, useRef } from 'react';
import moment from 'moment';
import { DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import formatToBrl from '../../core/utils/formatToBrl';
import DoubleConfirm from '../components/DoubleConfirm';
import { useHistory, useLocation } from 'react-router-dom';

interface EntriesListProps {
  onEdit: (entryId: number) => any;
  onDetail: (entryId: number) => any;
  type: 'EXPENSE' | 'REVENUE';
}

export default function EntriesList(props: EntriesListProps) {
  const { type } = props;
  const location = useLocation();
  const history = useHistory();

  const {
    entries,
    fetching,
    fetchEntries,
    setQuery,
    selected,
    setSelected,
    removeEntry,
  } = useCashFlow(type);

  const didMount = useRef(false);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    if (didMount.current) {
      const params = new URLSearchParams(location.search);
      const yearMonth = params.get('yearMonth');
      if (yearMonth) setQuery({ yearMonth });
    } else {
      didMount.current = true;
    }
  }, [location.search, setQuery]);

  return (
    <Table<CashFlow.EntrySummary>
      dataSource={entries}
      loading={fetching}
      rowKey={'id'}
      rowSelection={{
        selectedRowKeys: selected,
        onChange: setSelected,
        getCheckboxProps(record) {
          return !record.canBeDeleted ? { disabled: true } : {};
        },
      }}
      columns={[
        {
          responsive: ['xs'],
          title: type === 'EXPENSE' ? 'Despesas' : 'Receitas',
          dataIndex: 'id',
          render(_, record) {
            return (
              <>
                <Descriptions column={1}>
                  <Descriptions.Item label={'Descrição'}>
                    {record.description}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Categoria'}>
                    {record.category.name}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Data'}>
                    {moment(record.transactedOn).format('DD/MM/YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Valor'}>
                    {formatToBrl(record.amount)}
                  </Descriptions.Item>
                </Descriptions>
                <Space>
                  <DoubleConfirm
                    popConfirmTitle={
                      type === 'EXPENSE' ? 'Remover despesa?' : 'Remover receita?'
                    }
                    modalTitle={
                      type === 'EXPENSE'
                        ? 'Deseja mesmo remover essa despesa?'
                        : 'Deseja mesmo remover essa receita?'
                    }
                    modalContent={
                      type === 'EXPENSE'
                        ? 'Remover essa despesa pode gerar um impacto negativo no gráfico de receitas e despesas. Esta ação é irreversível'
                        : 'Remover essa receita pode gerar um impacto negativo no gráfico de receitas e despesas. Esta ação é irreversível'
                    }
                    modalCancelLabel='Cancelar'
                    onConfim={async () => await removeEntry(record.id)}
                  >
                    <Button
                      type={'text'}
                      size={'small'}
                      icon={<DeleteOutlined />}
                      danger
                      disabled={!record.canBeDeleted}
                    />
                  </DoubleConfirm>
                  <Button
                    type={'text'}
                    size={'small'}
                    onClick={() => props.onEdit(record.id)}
                    icon={<EditOutlined />}
                  />
                  <Button
                    type={'text'}
                    size={'small'}
                    onClick={() => props.onDetail(record.id)}
                    icon={<EyeOutlined />}
                  />
                </Space>
              </>
            );
          },
        },
        {
          responsive: ['sm'],
          dataIndex: 'description',
          title: 'Descrição',
          width: 300,
          ellipsis: true,
        },
        {
          responsive: ['sm'],
          dataIndex: 'category',
          title: 'Categoria',
          align: 'center',
          render(category: CashFlow.EntrySummary['category']) {
            return <Tag>{category.name}</Tag>;
          },
        },
        {
          responsive: ['sm'],
          dataIndex: 'transactedOn',
          title: 'Data',
          align: 'center',
          filterDropdown() {
            return (
              <Card>
                <DatePicker.MonthPicker
                  format={'MMMM - YYYY'}
                  onChange={(date) =>
                    history.push({
                      search: `yearMonth=${
                        date?.format('YYYY-MM') || moment().format('YYYY-MM')
                      }`,
                    })
                  }
                />
              </Card>
            );
          },
          render(transactedOn: CashFlow.EntrySummary['transactedOn']) {
            return moment(transactedOn).format('DD/MM/YYYY');
          },
        },
        {
          responsive: ['sm'],
          dataIndex: 'amount',
          title: 'Valor',
          align: 'right',
          render: formatToBrl,
        },
        {
          responsive: ['sm'],
          dataIndex: 'id',
          title: 'Ações',
          align: 'center',
          render(id: number, record) {
            return (
              <Space>
                <DoubleConfirm
                  popConfirmTitle={
                    type === 'EXPENSE' ? 'Remover despesa?' : 'Remover receita?'
                  }
                  modalTitle={
                    type === 'EXPENSE'
                      ? 'Deseja mesmo remover essa despesa?'
                      : 'Deseja mesmo remover essa receita?'
                  }
                  modalContent={
                    type === 'EXPENSE'
                      ? 'Remover essa despesa pode gerar um impacto negativo no gráfico de receitas e despesas. Esta ação é irreversível'
                      : 'Remover essa receita pode gerar um impacto negativo no gráfico de receitas e despesas. Esta ação é irreversível'
                  }
                  modalCancelLabel='Cancelar'
                  onConfim={async () => await removeEntry(id)}
                >
                  <Button
                    type={'text'}
                    size={'small'}
                    icon={<DeleteOutlined />}
                    danger
                    disabled={!record.canBeDeleted}
                  />
                </DoubleConfirm>
                <Button
                  type={'text'}
                  size={'small'}
                  onClick={() => props.onEdit(id)}
                  icon={<EditOutlined />}
                />
                <Button
                  type={'text'}
                  size={'small'}
                  onClick={() => props.onDetail(id)}
                  icon={<EyeOutlined />}
                />
              </Space>
            );
          },
        },
      ]}
    />
  );
}
