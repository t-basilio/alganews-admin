import { Layout, ConfigProvider } from 'antd';
import Breadcrumb from './Breadcrumb';
import DefaultLayoutHeader from './Header';
import DefaultLayoutSidebar from './Sidebar';
import DefaultLayoutContent from './Content';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout(props: DefaultLayoutProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgLayout: '#f3f8fa',
          colorPrimary: '#09f',
          colorTextBase: '#274060',
          colorText: '#274060',
          colorTextHeading: '##274060',
          colorBgContainer: '#f3f8fa',
          colorBgBase: 'f3f8fa',
          controlItemBgActive: '#f3f8fa',
          colorBorderBg: '#f3f8fa',
          colorBorder: 'rgba(39, 64, 96, 0.15)',
          colorSplit: 'rgba(39, 64, 96, 0.10)',
        },
      }}
    >
      <Layout>
        <DefaultLayoutHeader />
        <Layout id={'PageLayout'}>
          <DefaultLayoutSidebar />
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb />
            <DefaultLayoutContent>{props.children}</DefaultLayoutContent>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
