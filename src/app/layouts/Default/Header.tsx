import { Row, Avatar, Dropdown, Tag } from 'antd';
import logo from '../../../assets/Logo.svg';
import useAuth from '../../../core/hooks/useAuth';
import { MenuProps } from 'antd/lib/menu';
import { Meta } from 'antd/es/list/Item';
import { UserOutlined, LoginOutlined } from '@ant-design/icons';
import { Header } from 'antd/es/layout/layout';
import { Link } from 'react-router-dom';
import confirm from 'antd/lib/modal/confirm';
import AuthService from '../../../auth/Authorization.service';

export default function DefaultLayoutHeader() {
  const { user } = useAuth();

  const items: MenuProps['items'] = [
    {
      key: '1',
      type: 'group',
      label: (
        <Meta
          title={user?.name}
          description={
            <Tag
              color={user?.role === 'MANAGER' ? 'red' : 'blue'}
              style={{ opacity: 0.6 }}
            >
              {user?.role === 'EDITOR'
                ? 'Editor'
                : user?.role === 'MANAGER'
                ? 'Gerente'
                : 'Assistente'}
            </Tag>
          }
        />
      ),
      children: [
        {
          type: 'divider',
        },
        {
          key: '1-1',
          icon: <UserOutlined />,
          label: <Link to={`/usuarios/${user?.id}`}>Meu perfil</Link>,
        },
        {
          key: '1-2',
          icon: <LoginOutlined />,
          label: 'Fazer logout',
          danger: true,
          onClick() {
            confirm({
              title: 'Fazer logout',
              content:
                'Deseja realmente fazer o logout? Será necessário inserir as credencias novamente',
              onOk() {
                AuthService.imperativelySendToLogout();
              },
              okButtonProps: { danger: true },
              okText: 'Logout',
              okCancel: true,
              cancelText: 'Permanecer',
              closable: true,
            });
          },
        },
      ],
    },
  ];

  return (
    <Header className='header no-print'>
      <Row
        justify='space-between'
        style={{ height: '100%', maxWidth: '1190px', margin: '0 auto' }}
        align='middle'
      >
        <img src={logo} alt='AlgaNews Admin'></img>
        <Dropdown
          menu={{ items }}
          placement={'bottomRight'}
          overlayStyle={{ width: 220 }}
        >
          <Avatar src={user?.avatarUrls.small} />
        </Dropdown>
      </Row>
    </Header>
  );
}
