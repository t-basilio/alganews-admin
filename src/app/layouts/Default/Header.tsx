import { Layout, Row, Avatar } from 'antd';
import logo from '../../../assets/Logo.svg';
const { Header } = Layout;

export default function DefaultLayoutHeader() {
  return (
    <Header className='header no-print'>
      <Row
        justify='space-between'
        style={{ height: '100%', maxWidth: '1190px', margin: '0 auto' }}
        align='middle'
      >
        <img src={logo} alt='AlgaNews Admin'></img>
        <Avatar />
      </Row>
    </Header>
  );
}
