import { Breadcrumb as AntdBreadcrumb } from 'antd';
import useBreadcrumb from '../../../core/hooks/useBreadcrumb';

export default function Breadcrumb() {
  const { breadcrumb } = useBreadcrumb();

  return (
    <AntdBreadcrumb
      className='no-print'
      style={{ padding: 16 }}
      items={breadcrumb.map((bc, index) => ({ title: bc, key: index }))}
    />
  );
}
