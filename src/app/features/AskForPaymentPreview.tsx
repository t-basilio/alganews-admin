import { Card, Row, Typography } from 'antd';
import taxIcon from '../../assets/tax.svg';
import confusingIcon from '../../assets/confusing.svg';
import CustomError from 't-basilio-sdk/dist/CustomError';

interface AskForPaymentPreviewProps {
  error?: CustomError;
}

export default function AskFormPaymentPreview(props: AskForPaymentPreviewProps) {
  return (
    <Card bordered={false}>
      <Row justify='center' style={{ textAlign: 'center' }}>
        <img
          key={props.error ? 'errorImg' : 'img'}
          src={props.error ? confusingIcon : taxIcon}
          alt='tax'
          width={240}
        />
        <Typography.Title level={3} style={{ maxWidth: 360 }}>
          {props.error ? props.error.message : 'Selecione um editor e um período'}
        </Typography.Title>
        <Typography.Text>
          Para podermos gerar uma prévia do pagamento, por favor, preencha os campos
          "Editor" e "Período"
        </Typography.Text>
      </Row>
    </Card>
  );
}
