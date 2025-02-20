import { Descriptions, Skeleton, Typography } from 'antd';
import { Payment } from 't-basilio-sdk';

interface PaymentBonusesProps {
  bonuses?: Payment.Detailed['bonuses'];
  loading?: boolean;
}

export default function PaymentBonuses(props: PaymentBonusesProps) {
  
  if (props.loading) return <Skeleton />;

  return (
    <>
      <Typography.Title level={2}>Bônus</Typography.Title>
      <Descriptions column={1} bordered size='small'>
        {props.bonuses?.map((bonus, index) => (
          <Descriptions.Item key={index} label={bonus.title}>
            {bonus.amount.toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL',
              maximumFractionDigits: 2,
            })}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </>
  );
}
