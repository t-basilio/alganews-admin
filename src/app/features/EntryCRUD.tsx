import {
  Button,
  Divider,
  Modal,
  notification,
  Row,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import { InfoCircleFilled, PlusCircleOutlined, TagOutlined } from '@ant-design/icons';
import EntriesList from '../features/EntriesList';
import useCashFlow from '../../core/hooks/useCashFlow';
import DoubleConfirm from '../components/DoubleConfirm';
import { useCallback, useState } from 'react';
import EntryCategoryManager from '../features/EntryCategoryManager';
import EntryForm from '../features/EntryForm';
import EntryDetails from '../features/EntryDetails';
import moment from 'moment';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
const { Title, Text } = Typography;

interface EntryCRUDProps {
  type: 'EXPENSE' | 'REVENUE';
}

export default function EntryCRUD({ type }: EntryCRUDProps) {
  
  const { selected, removeEntries, query } = useCashFlow(type);
  const { xs } = useBreakpoint();

  const [editingEntry, setEditingEntry] = useState<number | undefined>(undefined);
  const [detailedEntry, setDetailedEntry] = useState<number | undefined>(undefined);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const openCategoryModal = useCallback(() => {
    setShowCategoryModal(true);
  }, []);

  const closeCategoryModal = useCallback(() => {
    setShowCategoryModal(false);
  }, []);

  const openFormModal = useCallback(() => {
    setShowFormModal(true);
  }, []);

  const closeFormModal = useCallback(() => {
    setShowFormModal(false);
  }, []);

  const openDetailsModal = useCallback(() => {
    setShowDetailsModal(true);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setShowDetailsModal(false);
  }, []);

  return (
    <>
      <Modal
        closeIcon={null}
        open={showCategoryModal}
        onCancel={closeCategoryModal}
        title={'Gerenciar categorias'}
        footer={null}
        destroyOnClose
      >
        <EntryCategoryManager type={type} />
      </Modal>

      <Modal
        closeIcon={null}
        open={showFormModal}
        onCancel={() => {
          closeFormModal();
          setEditingEntry(undefined);
        }}
        footer={null}
        title={`${editingEntry ? 'Atualizar ' : 'Cadastrar'} ${
          type === 'EXPENSE' ? 'despesa' : 'receita'
        }`}
        destroyOnClose
      >
        <EntryForm
          type={type}
          editingEntry={editingEntry}
          onCancel={closeFormModal}
          onSuccess={() => {
            closeFormModal();
            notification.success({
              message: `Entrada ${
                editingEntry ? 'atualizada' : 'cadastrada'
              } com sucesso`,
            });
          }}
        />
      </Modal>

      <Modal
        closeIcon={null}
        open={showDetailsModal}
        onCancel={() => {
          closeDetailsModal();
        }}
        footer={null}
        title={`Detalhes da ${type === 'EXPENSE' ? 'despesa' : 'receita'}`}
        destroyOnClose
      >
        {detailedEntry && <EntryDetails entryId={detailedEntry} />}
      </Modal>

      <Row
        justify={'space-between'}
        style={{ marginBottom: 16, flexDirection: xs ? 'column-reverse' : 'row' }}
      >
        <Space style={{ ...(xs && { marginTop: 16 }) }}>
          <DoubleConfirm
            popConfirmTitle={`Remover ${
              selected.length > 1
                ? type === 'EXPENSE'
                  ? 'despesas selecionadas?'
                  : 'receitas selecionadas?'
                : type === 'EXPENSE'
                ? 'despesa selecionada?'
                : 'receita selecionada?'
            }`}
            modalCancelLabel={'Cancelar'}
            modalTitle={`Remover ${type === 'EXPENSE' ? 'despesas' : 'receitas'}`}
            modalContent={
              type === 'EXPENSE'
                ? 'Remover uma ou mais despesas pode gerar impacto negativo no gráfico de receitas e despesas da empresa. Esta éuma ação irreversível'
                : 'Remover uma ou mais receitas pode gerar impacto negativo no gráfico de receitas e despesas da empresa. Esta éuma ação irreversível'
            }
            onConfim={async () => {
              await removeEntries(selected as number[]);
            }}
          >
            <Button danger={xs} type={'primary'} disabled={!selected.length}>
              Remover
            </Button>
          </DoubleConfirm>
        </Space>
        <Space>
          <Button type={'primary'} icon={<TagOutlined />} onClick={openCategoryModal}>
            Categorias
          </Button>
          <Button type={'primary'} icon={<PlusCircleOutlined />} onClick={openFormModal}>
            Adicionar {type === 'EXPENSE' ? 'despesa' : 'receita'}
          </Button>
        </Space>
      </Row>
      <Space direction={'vertical'}>
        <Title level={3}>
          Recuperando {type === 'EXPENSE' ? 'despesas' : 'receitas'} do mês:{' '}
          {moment(query.yearMonth).format('MMMM [de] YYYY')}
        </Title>
        <Space>
          <Text>
            É possível filtrar {type === 'EXPENSE' ? 'despesas' : 'receitas'} por mês
          </Text>
          <Tooltip placement={'right'} title={'Use a coluna data para filtrar'}>
            <InfoCircleFilled />
          </Tooltip>
        </Space>
      </Space>

      <Divider />

      <EntriesList
        type={type}
        onEdit={(id) => {
          setEditingEntry(id);
          openFormModal();
        }}
        onDetail={(id) => {
          setDetailedEntry(id);
          openDetailsModal();
        }}
      />
    </>
  );
}
