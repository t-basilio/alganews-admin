import { useEffect, useState } from 'react';
import useUsers from '../../core/hooks/useUsers';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Input,
  Row,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import { User } from 't-basilio-sdk';
import { format } from 'date-fns/format';
import {
  EyeOutlined,
  EditOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import { Link } from 'react-router-dom';
import Forbidden from '../components/Forbidden';

export default function UserList() {
  const { users, fetchUsers, toggleUserStatus, fetching } = useUsers();
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    fetchUsers().catch((err) => {
      if (err?.data?.status === 403) {
        setForbidden(true);
        return;
      }
      throw err;
    });
  }, [fetchUsers]);

  const getColumnSearchProps = (
    dataIndex: keyof User.Summary,
    displayName?: string
  ): ColumnProps<User.Summary> => ({
    filterDropdown: ({ selectedKeys, setSelectedKeys, confirm, clearFilters }) => (
      <Card>
        <Input
          style={{ marginBottom: 8, display: 'block' }}
          value={selectedKeys[0]}
          placeholder={`Buscar ${displayName || dataIndex}`}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
        />
        <Space>
          <Button
            type='primary'
            size='small'
            style={{ width: 90 }}
            onClick={() => confirm()}
            icon={<SearchOutlined />}
          >
            Buscar
          </Button>
          <Button size='small' style={{ width: 90 }} onClick={clearFilters}>
            Limpar
          </Button>
        </Space>
      </Card>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#09f' : undefined }} />
    ),
    //@ts-ignore
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase())
        : '',
  });

  if (forbidden) return <Forbidden />;

  return (
    <>
      <Row justify={'end'}>
        <Button loading={fetching} onClick={fetchUsers} icon={<ReloadOutlined />}>
          Atualizar
        </Button>
      </Row>
      <Table<User.Summary>
        loading={fetching}
        dataSource={users}
        pagination={false}
        rowKey={'id'}
        columns={[
          {
            title: 'Usuários',
            responsive: ['xs'],
            render(user: User.Summary) {
              return (
                <Descriptions column={1} size='small'>
                  <Descriptions.Item label={'Nome'}>{user.name}</Descriptions.Item>
                  <Descriptions.Item label={'Email'}>{user.email}</Descriptions.Item>
                  <Descriptions.Item label={'Criação'}>
                    {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Perfil'}>
                    <Tag color={user.role === 'MANAGER' ? 'red' : 'blue'}>
                      {user.role === 'EDITOR'
                        ? 'Editor'
                        : user.role === 'MANAGER'
                        ? 'Gerente'
                        : 'Assistente'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={'Ações'}>
                    <Tooltip title={'Visualizar usuário'}>
                      <Link to={`/usuarios/${user.id}`}>
                        <Button size='small' icon={<EyeOutlined />} />
                      </Link>
                    </Tooltip>
                    <Tooltip title={'Editar usuário'}>
                      <Link to={`/usuarios/edicao/${user.id}`}>
                        <Button size='small' icon={<EditOutlined />} />
                      </Link>
                    </Tooltip>
                  </Descriptions.Item>
                </Descriptions>
              );
            },
          },

          {
            dataIndex: 'avatarUrls',
            title: '',
            width: 48,
            fixed: 'left',
            responsive: ['sm'],
            render(avatarUrls: User.Summary['avatarUrls']) {
              return <Avatar size={'small'} src={avatarUrls.small} />;
            },
          },
          {
            dataIndex: 'name',
            title: 'Nome',
            width: 160,
            ellipsis: true,
            responsive: ['sm'],
            ...getColumnSearchProps('name', 'Nome'),
          },
          {
            dataIndex: 'email',
            title: 'Email',
            ellipsis: true,
            width: 240,
            responsive: ['sm'],
            ...getColumnSearchProps('email', 'Email'),
          },
          {
            dataIndex: 'role',
            title: 'Perfil',
            align: 'center',
            width: 100,
            responsive: ['sm'],
            sorter(a, b) {
              return a.role.localeCompare(b.role);
            },
            render(role) {
              return (
                <Tag color={role === 'MANAGER' ? 'red' : 'blue'}>
                  {role === 'EDITOR'
                    ? 'Editor'
                    : role === 'MANAGER'
                    ? 'Gerente'
                    : 'Assistente'}
                </Tag>
              );
            },
          },
          {
            dataIndex: 'createdAt',
            title: 'Criação',
            align: 'center',
            width: 120,
            responsive: ['sm'],
            sorter(a, b) {
              return new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1;
            },
            render(createdAt: string) {
              return format(new Date(createdAt), 'dd/MM/yyyy');
            },
          },
          {
            dataIndex: 'active',
            title: 'Ativo',
            align: 'center',
            width: 100,
            responsive: ['sm'],
            render(active: boolean, user) {
              return (
                <Switch
                  disabled={
                    (active && !user.canBeDeactivated) ||
                    (!active && !user.canBeActivated)
                  }
                  onChange={() => {
                    toggleUserStatus(user);
                  }}
                  checked={active}
                />
              );
            },
          },
          {
            dataIndex: 'id',
            title: 'Ações',
            align: 'center',
            width: 100,
            responsive: ['sm'],
            render(id: number) {
              return (
                <>
                  <Tooltip title={'Visualizar usuário'} placement={'left'}>
                    <Link to={`/usuarios/${id}`}>
                      <Button size='small' icon={<EyeOutlined />} />
                    </Link>
                  </Tooltip>
                  <Tooltip title={'Editar usuário'} placement={'right'}>
                    <Link to={`/usuarios/edicao/${id}`}>
                      <Button size='small' icon={<EditOutlined />} />
                    </Link>
                  </Tooltip>
                </>
              );
            },
          },
        ]}
      />
    </>
  );
}
