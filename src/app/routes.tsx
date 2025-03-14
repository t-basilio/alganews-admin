import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import React, { Suspense, useEffect, useMemo } from 'react';
import CustomError from 't-basilio-sdk/dist/CustomError';
import { message, notification } from 'antd';
import AuthService from '../auth/Authorization.service';
import { jwtDecode } from 'jwt-decode';
import { Authentication } from '../auth/Auth';
import useAuth from '../core/hooks/useAuth';
import GlobalLoading from './components/GlobalLoading';

const HomeView = React.lazy(() => import('./view/Home.view'));
const UserCreateView = React.lazy(() => import('./view/UserCreate.view'));
const UserEditView = React.lazy(() => import('./view/UserEdit.view'));
const UserListView = React.lazy(() => import('./view/UserList.view'));
const PaymentListView = React.lazy(() => import('./view/PaymentList.view'));
const PaymentCreateView = React.lazy(() => import('./view/PaymentCreate.view'));
const CashFlowRevenuesView = React.lazy(() => import('./view/CashFlowRevenues.view'));
const CashFlowExpensesView = React.lazy(() => import('./view/CashFlowExpenses.view'));
const UserDetailsView = React.lazy(() => import('./view/UserDetails.view'));
const PaymentDetailsView = React.lazy(() => import('./view/PaymentDetails.view'));

const APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Routes() {
  const history = useHistory();
  const location = useLocation();

  const { fetchUser, user } = useAuth();

  useEffect(() => {
    window.onunhandledrejection = ({ reason }) => {
      if (reason instanceof CustomError) {
        if (reason.data?.objects) {
          reason.data.objects.forEach((error) => {
            message.error(error.userMessage);
          });
        } else {
          notification.error({
            message: reason.message,
            description:
              reason.data?.detail === 'Network Error'
                ? 'Erro de rede'
                : reason.data?.detail,
          });
        }
      } else {
        reason?.data?.objects.forEach((object: { userMessage: string }) => {
          message.error(object.userMessage);
        });

        notification.error({ message: reason?.message || 'Houve um erro' });
      }
    };
    return () => {
      window.onunhandledrejection = null;
    };
  }, []);

  useEffect(() => {
    async function identify() {
      const isInAuthorizationRoute = window.location.pathname === '/authorize';
      const code = new URLSearchParams(window.location.search).get('code');

      const codeVerifier = AuthService.getCodeVerifier();
      const accessToken = AuthService.getAccessToken();

      if (!accessToken && !isInAuthorizationRoute) {
        AuthService.imperativelySendToLoginScreen();
      }

      if (isInAuthorizationRoute) {
        if (!code) {
          notification.error({ message: 'Código não informado' });
          AuthService.imperativelySendToLoginScreen();
          return;
        }

        if (!codeVerifier) {
          AuthService.imperativelySendToLogout();
          return;
        }
        // looking for first access token
        const { access_token, refresh_token } = await AuthService.getFirstAccessToken({
          code,
          codeVerifier,
          redirectUri: `${APP_BASE_URL}/authorize`,
        });

        AuthService.setAccessToken(access_token);
        AuthService.setRefreshToken(refresh_token);

        const decodedToken: Authentication.AccessTokenDecodedBody =
          jwtDecode(access_token);
        fetchUser(decodedToken['alganews:user_id']);

        history.push('/');
      }

      if (accessToken) {
        const decodedToken: Authentication.AccessTokenDecodedBody =
          jwtDecode(accessToken);
        fetchUser(decodedToken['alganews:user_id']);
      }
    }

    identify();
  }, [history, fetchUser]);

  const isAuthorizationRoute = useMemo(
    () => location.pathname === '/authorize',
    [location.pathname]
  );

  if (isAuthorizationRoute || !user) return <GlobalLoading />;

  return (
    <Suspense fallback={<GlobalLoading />}>
      <Switch>
        <Route path={'/'} exact component={HomeView} />
        <Route path={'/usuarios'} exact component={UserListView} />
        <Route path={'/usuarios/cadastro'} exact component={UserCreateView} />
        <Route path={'/usuarios/edicao/:id'} exact component={UserEditView} />
        <Route path={'/usuarios/:id'} exact component={UserDetailsView} />
        <Route path={'/pagamentos'} exact component={PaymentListView} />
        <Route path={'/pagamentos/cadastro'} exact component={PaymentCreateView} />
        <Route path={'/pagamentos/:id'} exact component={PaymentDetailsView} />
        <Route path={'/fluxo-de-caixa/despesas'} exact component={CashFlowExpensesView} />
        <Route path={'/fluxo-de-caixa/receitas'} exact component={CashFlowRevenuesView} />
      </Switch>
    </Suspense>
  );
}
