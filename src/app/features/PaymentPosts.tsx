import { Descriptions, Table } from 'antd';
import { Post } from 't-basilio-sdk';

interface PaymentPostsProps {
  posts: Post.WithEarnings[];
  loading?: boolean
}

export default function PaymentPosts(props: PaymentPostsProps) {
  return (
    <>
      <Table<Post.WithEarnings>
        loading={props.loading}
        dataSource={props.posts}
        rowKey={'id'}
        pagination={false}
        columns={[
          {
            responsive: ['xs'],
            title: 'Post',
            render(post: Post.WithEarnings) {
              return (
                <Descriptions column={1}>
                  <Descriptions.Item label={'Título'}>{post.title}</Descriptions.Item>
                  <Descriptions.Item label={'Preço por palavra'}>
                    {post.earnings.pricePerWord.toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 2,
                    })}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Palavras no post'}>
                    {post.earnings.words}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Ganho nesse post'}>
                    {post.earnings.pricePerWord.toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 2,
                    })}
                  </Descriptions.Item>
                </Descriptions>
              );
            },
          },
          {
            responsive: ['sm'],
            dataIndex: 'title',
            title: 'Post',
            ellipsis: true,
            width: 300,
          },
          {
            responsive: ['sm'],
            dataIndex: 'earnings.pricePerWord'.split('.'),
            title: 'Preço por palavra',
            align: 'right',
            width: 150,
            render(price: number) {
              return price.toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 2,
              });
            },
          },
          {
            responsive: ['sm'],
            dataIndex: 'earnings.words'.split('.'),
            title: 'Palavras no post',
            width: 150,
            align: 'right',
          },
          {
            responsive: ['sm'],
            dataIndex: 'earnings.totalAmount'.split('.'),
            title: 'Total ganho nesse post',
            width: 170,
            align: 'right',
            render(totalAmount: number) {
              return totalAmount.toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 2,
              });
            },
          },
        ]}
      />
    </>
  );
}
