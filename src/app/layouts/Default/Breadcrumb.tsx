import { Breadcrumb as AntdBreadcrumb } from 'antd';

export default function Breadcrumb() {
  return (
    <AntdBreadcrumb
      style={{ padding: 16 }}
      items={[
        { title: 'Home', key: 'home' },
        { title: 'List', key: 'list' },
        { title: 'App', key: 'app' },
      ]}
    />
  );
}
