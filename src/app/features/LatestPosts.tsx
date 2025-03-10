import { useEffect } from 'react';
import useLatestPosts from '../../core/hooks/useLastestPosts';
import { Card, Avatar, Col, Row, Tooltip, Space, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

export default function LatestPosts() {
  const { fetchPosts, posts } = useLatestPosts();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <Row gutter={16}>
      {posts?.map((post) => {
        return (
          <Col key={post.id} xs={24} md={8}>
            <Card
              cover={
                <img
                  alt={post.title}
                  src={post.imageUrls.small}
                  style={{ height: 168, objectFit: 'cover' }}
                />
              }
              actions={[
                <Tooltip title={'Ver post no blog'}>
                  <a
                    target='_blank'
                    rel={'noopener noreferrer'}
                    href={`http://localhost:3002/posts/${post.id}/${post.slug}`}
                  >
                    <Space>
                      <EyeOutlined />
                      <Typography.Text>Ver post no blog</Typography.Text>
                    </Space>
                  </a>
                </Tooltip>,
              ]}
            >
              <Card.Meta
                title={post.title}
                avatar={<Avatar src={post.editor.avatarUrls.small} />}
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
