import { hover } from '@testing-library/user-event/dist/hover';
import { useCallback, useState } from 'react';

type CurrencyInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  onChange: (event: React.ChangeEvent<HTMLInputElement>, reals: number) => any;
};

export default function CurrencyInput(props: CurrencyInputProps) {
  const convertValueToBrl = useCallback((value: number) => {
    return value.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }, []);

  const [inputValue, setInputValue] = useState(
    typeof props.value === 'number' ? convertValueToBrl(props.value) : props.value
  );

  return (
    <input
      className='ant-input css-dev-only-do-not-override-1x0dypw ant-input-outlined'
      value={inputValue}
      onChange={(e) => {
        const { value } = e.currentTarget;

        const cents = value.replace(/[^(0-9)]/gi, '');

        const reals = Number(cents) / 100;

        setInputValue(convertValueToBrl(reals));

        props.onChange && props.onChange(e, reals);
      }}
    />
  );
}
