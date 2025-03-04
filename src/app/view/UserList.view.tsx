import { Col, Row } from 'antd';
import UserList from '../features/UserList';
import usePageTitle from '../../core/hooks/usePageTitle';
import useBreadcrumb from '../../core/hooks/useBreadcrumb';
export default function UserListView() {
  usePageTitle('Consulta de usuários');
  useBreadcrumb('Usuários/Consulta');
  return (
    <Row>
      <Col xs={24}>
        <UserList />
      </Col>
    </Row>
  );
}
