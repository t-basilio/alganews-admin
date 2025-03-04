import { Col, Divider, Row, Space, Typography } from 'antd';
import CompanyMetrics from '../features/CompanyMetrics';
import LatestPosts from '../features/LatestPosts';
import usePageTitle from '../../core/hooks/usePageTitle';
import useAuth from '../../core/hooks/useAuth';
import useBreadcrumb from '../../core/hooks/useBreadcrumb';

const { Title, Paragraph } = Typography;

function HomeView() {
  const { user } = useAuth();
  usePageTitle('Home');
  useBreadcrumb("Home")

  return (
    <Space direction='vertical' size={'small'} style={{ maxWidth: '100%' }}>
      <Row>
        <Col span={24}>
          <Title level={2}>Olá, { user?.name }</Title>
          <Paragraph>Este é o resumo da empresa nos ultimos doze meses</Paragraph>
        </Col>
        <Col span={24}>
          <CompanyMetrics />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <Title level={3}>Últimos posts</Title>
        </Col>
        <Col>
          <LatestPosts />
        </Col>
      </Row>
    </Space>
  );
}

export default HomeView;
