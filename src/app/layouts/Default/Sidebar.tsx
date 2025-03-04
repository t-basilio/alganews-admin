import {
  DiffOutlined,
  FallOutlined,
  HomeOutlined,
  LaptopOutlined,
  MenuOutlined,
  PlusCircleOutlined,
  RiseOutlined,
  TableOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu, Layout, Drawer, DrawerProps, Button } from 'antd';
import { SiderProps } from 'antd/lib/layout';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import logo from '../../../assets/Logo.svg';

const { Sider } = Layout;

export default function DefaultLayoutSidebar() {
  const { lg } = useBreakpoint();

  const history = useHistory();
  const location = useLocation();

  const [show, setShow] = useState(false);

  const SideBarWrapper: React.FC = useMemo(() => (lg ? Sider : Drawer), [lg]);

  const siderProps = useMemo((): SiderProps => {
    return {
      width: 200,
      className: 'site-layout-background no-print',
    };
  }, []);

  const drawerProps = useMemo((): DrawerProps => {
    return {
      open: show,
      closable: true,
      title: (
        <>
          <img alt={'logo alga news'} src={logo} />
        </>
      ),
      styles: { header: { padding: '17px 17px' }, body: { padding: 0 } },
      onClose() {
        setShow(false);
      },
      placement: 'left',
      width: 230,
    };
  }, [show]);

  const sidebarProps = useMemo(() => {
    return lg ? siderProps : drawerProps;
  }, [lg, siderProps, drawerProps]);

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
    <>
      {!lg && (
        <Button
          icon={<MenuOutlined />}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: 64,
            zIndex: 99,
            border: 'none',
          }}
          onClick={() => setShow(true)}
        />
      )}
      <SideBarWrapper {...sidebarProps}>
        <Menu
          items={menuItems}
          mode='inline'
          defaultSelectedKeys={[location.pathname]}
          defaultOpenKeys={[location.pathname.split('/')[1]]}
          style={{ height: '100%', borderRight: 0 }}
        />
      </SideBarWrapper>
    </>
  );
}
