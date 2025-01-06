import { Col, Row } from 'antd';
import UserList from '../features/UserList';
import usePageTitle from '../../core/hooks/usePageTitle';
export default function UserListView() {
  usePageTitle('Consulta de usuários')
  return (
    <Row>
      <Col xs={24}>
        <UserList />
      </Col>
    </Row>
  );
}
