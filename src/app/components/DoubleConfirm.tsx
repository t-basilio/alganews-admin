import { Popconfirm } from 'antd';
import confirm from 'antd/lib/modal/confirm';

interface DoubleConfirmProps {
  children: React.ReactNode;
  popConfirmTitle: string;
  modalTitle: string;
  modalContent: string;
  modalCancelLabel?: string;
  onConfim?: () => void;
}

export default function DoubleConfirm(props: DoubleConfirmProps) {
  return (
    <Popconfirm
      title={props.popConfirmTitle}
      onConfirm={() => {
        confirm({
          title: props.modalTitle,
          onOk: props.onConfim,
          content: props.modalContent,
          cancelText: props.modalCancelLabel,
          okCancel: props.modalCancelLabel ? true : false,
        });
      }}
    >
      {props.children}
    </Popconfirm>
  );
}
