import { useEffect, useState } from 'react';
import useUser from '../../core/hooks/useUser';
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Popconfirm,
  Progress,
  Row,
  Skeleton,
  Space,
  Table,
  Typography,
  Switch,
} from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { Link, Redirect, useParams } from 'react-router-dom';
import confirm from 'antd/lib/modal/confirm';
import { Post } from 't-basilio-sdk';
import useUserPosts from '../../core/hooks/usePosts';
import moment from 'moment';
import NotFoundError from '../components/NotFoundError';
import usePageTitle from '../../core/hooks/usePageTitle';
import formatPhone from '../../core/utils/formatPhone';

export default function UserDetailsView() {
  usePageTitle('Detalhes do usuário');

  const params = useParams<{ id: string }>();
  const [page, setPage] = useState(0);
  const { lg } = useBreakpoint();

  const { user, fetchUser, notFound, toggleUserStatus } = useUser();
  const { posts, fetchUserPosts, togglePostStatus, loadingFetch, loadingToggle } =
    useUserPosts();

  useEffect(() => {
    if (!isNaN(Number(params.id))) {
      fetchUser(Number(params.id));
    }
  }, [fetchUser, params.id]);

  useEffect(() => {
    if (user?.role === 'EDITOR') {
      fetchUserPosts(user.id, page);
    }
  }, [user, fetchUserPosts, page]);

  if (isNaN(Number(params.id))) {
    return <Redirect to={'/usuarios'} />;
  }

  if (notFound) {
    return (
      <Card>
        <NotFoundError
          title={'Usuário não encontrado'}
          actionDestination={'/usuarios'}
          actionTitle={'Voltar para lista de usuários'}
        />
      </Card>
    );
  }

  if (!user) return <Skeleton />;
  return (
    <Row gutter={24}>
      <Col xs={24} lg={4}>
        <Row justify={'center'}>
          <Avatar size={120} src={user.avatarUrls.small} />
        </Row>
      </Col>
      <Col xs={24} lg={20}>
        <Space
          direction='vertical'
          style={{ width: '100%' }}
          align={lg ? 'start' : 'center'}
        >
          <Typography.Title level={2}>{user.name}</Typography.Title>
          <Typography.Paragraph
            style={{ textAlign: lg ? 'left' : 'center' }}
            ellipsis={{
              rows: 2,
            }}
          >
            {user.bio}
          </Typography.Paragraph>
          <Space>
            <Link to={`/usuarios/edicao/${user.id}`}>
              <Button type='primary'>Editar perfil</Button>
            </Link>
            <Popconfirm
              title={user.active ? `Desabilitar ${user.name}` : `Habilitar ${user.name}`}
              onConfirm={() => {
                confirm({
                  title: `Tem certeza que deseja ${
                    user.active ? `Desabilitar ${user.name}?` : `Habilitar ${user.name}?`
                  }`,

                  content: user.active
                    ? 'Desabilitar um usuário fará com que ele seja automaticamente desligado da plataforma, podendo causar prejuízos em seus ganhos.'
                    : 'Habilitar um usuário fará com que ele ganhe acesso a plataforma novamente, possibilitando criação e publicação de posts.',

                  onOk() {
                    toggleUserStatus(user).then(() => {
                      fetchUser(Number(params.id));
                    });
                  },
                });
              }}
            >
              <Button type='primary'>{user.active ? 'Desabilitar' : 'Habilitar'}</Button>
            </Popconfirm>
          </Space>
        </Space>
      </Col>
      <Divider />
      {!!user.skills?.length && (
        <Col xs={24} lg={12}>
          <Space direction='vertical' style={{ width: '100%' }}>
            {user.skills?.map((skill) => (
              <div key={skill.name}>
                <Typography.Text>{skill.name}</Typography.Text>
                <Progress percent={skill.percentage} success={{ percent: 0 }} />
              </div>
            ))}
          </Space>
        </Col>
      )}
      <Col xs={24} lg={12}>
        <Descriptions column={1} bordered size='small'>
          <Descriptions.Item label='País'>{user.location.country}</Descriptions.Item>
          <Descriptions.Item label='Estado'>{user.location.state}</Descriptions.Item>
          <Descriptions.Item label='Cidade'>{user.location.city}</Descriptions.Item>
          <Descriptions.Item label='Telefone'>
            {formatPhone(user.phone)}
          </Descriptions.Item>
        </Descriptions>
      </Col>

      {user.role === 'EDITOR' && (
        <>
          <Divider />
          <Col xs={24}>
            <Table<Post.Summary>
              dataSource={posts?.content}
              rowKey={'id'}
              loading={loadingFetch}
              pagination={{
                onChange: (page) => setPage(page - 1),
                total: posts?.totalElements,
                pageSize: 10,
              }}
              columns={[
                {
                  title: 'Posts',
                  responsive: ['xs'],
                  render(post) {
                    return (
                      <Descriptions column={1}>
                        <Descriptions.Item label={'Titulo'}>
                          {post.title}
                        </Descriptions.Item>
                        <Descriptions.Item label={'Criação'}>
                          {moment(post.createdAt).format('DD/MM/YYYY')}
                        </Descriptions.Item>
                        <Descriptions.Item label={'Atualização'}>
                          {moment(post.updatedAt).format('DD/MM/YYYY')}
                        </Descriptions.Item>
                        <Descriptions.Item label={'Publicado'}>
                          <Switch
                            onChange={() => {
                              togglePostStatus(post).then(() => {
                                fetchUserPosts(user.id);
                              });
                            }}
                            loading={loadingToggle}
                            checked={post.published}
                          />
                        </Descriptions.Item>
                      </Descriptions>
                    );
                  },
                },
                {
                  dataIndex: 'title',
                  title: 'Titulo',
                  ellipsis: true,
                  width: 300,
                  responsive: ['sm'],
                },
                {
                  dataIndex: 'createdAt',
                  title: 'Criação',
                  align: 'center',
                  width: 180,
                  responsive: ['sm'],
                  render(createdAt: string) {
                    return moment(createdAt).format('DD/MM/YYYY');
                  },
                },
                {
                  dataIndex: 'updatedAt',
                  title: 'Ultima atualização',
                  align: 'center',
                  width: 200,
                  responsive: ['sm'],
                  render(updateAt: string) {
                    return moment(updateAt).format('DD/MM/YYYY [às] hh:mm');
                  },
                },
                {
                  dataIndex: 'published',
                  title: 'Publicado',
                  align: 'center',
                  width: 120,
                  responsive: ['sm'],
                  render(published: boolean, post) {
                    return (
                      <Switch
                        onChange={() => {
                          togglePostStatus(post).then(() => {
                            fetchUserPosts(user.id);
                          });
                        }}
                        loading={loadingToggle}
                        checked={published}
                      />
                    );
                  },
                },
              ]}
            />
          </Col>
        </>
      )}
    </Row>
  );
}
