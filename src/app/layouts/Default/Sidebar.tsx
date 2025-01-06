import {
  DiffOutlined,
  FallOutlined,
  HomeOutlined,
  LaptopOutlined,
  PlusCircleOutlined,
  RiseOutlined,
  TableOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';

const { Sider } = Layout;

export default function DefaultLayoutSidebar() {
  const history = useHistory();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Home',
      onClick: () => history.push('/'),
    },
    {
      key: 'usuarios',
      icon: <UserOutlined />,
      label: 'Usuários',

      children: [
        {
          label: 'Consulta',
          key: '/usuarios',
          icon: <TableOutlined />,
          onClick: () => history.push('/usuarios'),
        },
        {
          label: 'Cadastro',
          key: '/usuarios/cadastro',
          icon: <PlusCircleOutlined />,
          onClick: () => history.push('/usuarios/cadastro'),
        },
      ],
    },
    {
      key: 'pagamentos',
      icon: <LaptopOutlined />,
      label: 'Pagamentos',

      children: [
        {
          label: 'Consulta',
          key: '/pagamentos',
          icon: <TableOutlined />,
          onClick: () => history.push('/pagamentos'),
        },
        {
          label: 'Cadastro',
          key: '/pagamentos/cadastro',
          icon: <PlusCircleOutlined />,
          onClick: () => history.push('/pagamentos/cadastro'),
        },
      ],
    },
    {
      key: 'fluxo-de-caixa',
      icon: <DiffOutlined />,
      label: 'Fluxo de Caixa',

      children: [
        {
          label: 'Despesa',
          key: '/fluxo-de-caixa/despesas',
          icon: <FallOutlined />,
          onClick: () => history.push('/fluxo-de-caixa/despesas'),
        },
        {
          label: 'Receita',
          key: '/fluxo-de-caixa/receitas',
          icon: <RiseOutlined />,
          onClick: () => history.push('/fluxo-de-caixa/receitas'),
        },
      ],
    },
  ];


  return (
    <Sider
      width={200}
      className='site-layout-background'
      breakpoint='lg'
      collapsedWidth='0'
    >
      <Menu
        items={menuItems}
        mode='inline'
        defaultSelectedKeys={[location.pathname]}
        defaultOpenKeys={[location.pathname.split('/')[1]]}
        style={{ height: '100%', borderRight: 0 }}
       />
    </Sider>
  );
}
