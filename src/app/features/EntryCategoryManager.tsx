import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Popconfirm,
  Row,
  Table,
} from 'antd';
import { CashFlow } from 't-basilio-sdk';
import useEntriesCategories from '../../core/hooks/useEntriesCategories';
import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import Forbidden from '../components/Forbidden';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

export default function EntryCategoryManager(props: { type: 'EXPENSE' | 'REVENUE' }) {
  const { xs } = useBreakpoint();
  const { expenses, fetchCategories, revenues, deleteCategory, fetching } =
    useEntriesCategories();

  const [showCreationModal, setShowCreationModal] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const openCreationModal = useCallback(() => setShowCreationModal(true), []);
  const closeCreationModal = useCallback(() => setShowCreationModal(false), []);

  useEffect(() => {
    fetchCategories().catch((err) => {
      if (err?.data?.status === 403) {
        setForbidden(true);
        return;
      }
      throw err;
    });
  }, [fetchCategories]);

  if (forbidden) return <Forbidden />;

  return (
    <>
      <Modal
        open={showCreationModal}
        onCancel={closeCreationModal}
        title={'Adicionar categoria'}
        footer={null}
        destroyOnClose
      >
        <CategoryForm
          type={props.type}
          onSuccess={() => {
            closeCreationModal();
            notification.success({
              message: 'Categoria cadastrada com sucesso',
            });
          }}
        />
      </Modal>

      <Row justify={'space-between'} style={{ marginBottom: 16 }}>
        <Button icon={<ReloadOutlined />} onClick={fetchCategories}>
          {xs ? 'Atualizar' : 'Atualizar categorias'}
        </Button>
        <Button
          icon={<PlusCircleOutlined />}
          type={'primary'}
          onClick={openCreationModal}
        >
          {xs ? 'Adcionar' : 'Adcionar categoria'}
        </Button>
      </Row>
      <Table<CashFlow.CategorySummary>
        size={'small'}
        rowKey={'id'}
        loading={fetching}
        dataSource={props.type === 'EXPENSE' ? expenses : revenues}
        columns={[
          {
            dataIndex: 'name',
            title: 'Descrição',
          },
          {
            dataIndex: 'totalEntries',
            title: 'Vínculos',
            align: 'right',
          },
          {
            dataIndex: 'id',
            title: 'Ações',
            align: 'right',
            render(id: number, record) {
              return (
                <Popconfirm
                  title={'Remover categoria'}
                  onConfirm={async () => {
                    await deleteCategory(id);
                    notification.success({
                      message: 'Categoria removida com sucesso',
                    });
                  }}
                >
                  <Button
                    danger
                    type={'default'}
                    size={'small'}
                    icon={<DeleteOutlined />}
                    disabled={!record.canBeDeleted}
                  />
                </Popconfirm>
              );
            },
          },
        ]}
      />
    </>
  );
}

function CategoryForm(props: { onSuccess: () => any; type: 'EXPENSE' | 'REVENUE' }) {
  const { onSuccess } = props;

  const { createCategory } = useEntriesCategories();

  const handleFormSubmit = useCallback(
    async (form: CashFlow.CategoryInput) => {
      const newCategoryDTO: CashFlow.CategoryInput = {
        ...form,
        type: props.type,
      };

      await createCategory(newCategoryDTO);
      onSuccess();
    },
    [createCategory, onSuccess, props.type]
  );

  return (
    <Form<CashFlow.CategoryInput> layout='vertical' onFinish={handleFormSubmit}>
      <Row justify={'end'}>
        <Col xs={24}>
          <Form.Item
            label={'Categoria'}
            name={'name'}
            rules={[{ required: true, message: 'O nome da categoria é obrigatório' }]}
          >
            <Input placeholder={'E.g.: Infra'} />
          </Form.Item>
        </Col>
        <Button icon={<CheckCircleOutlined />} type={'primary'} htmlType='submit'>
          Cadastrar categoria
        </Button>
      </Row>
    </Form>
  );
}
