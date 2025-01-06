import { Route, Switch } from 'react-router-dom';
import HomeView from './view/Home.view';
import UserCreateView from './view/UserCreate.view';
import UserListView from './view/UserList.view';
import PaymentListView from './view/PaymentList.view';
import PaymentCreateView from './view/PaymentCreate.view';
import CashFlowRevenuesView from './view/CashFlowRevenues.view';
import CashFlowExpensesView from './view/CashFlowExpenses.view';
import { useEffect } from 'react';
import CustomError from 't-basilio-sdk/dist/CustomError';
import { message, notification } from 'antd';
import UserEditView from './view/UserEdit.view';
import UserDetailsView from './view/UserDetails.view';

export default function Routes() {
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
        notification.error({ message: 'Houve um erro' });
      }
    };
    return () => {
      window.onunhandledrejection = null;
    };
  }, []);

  return (
    <Switch>
      <Route path={'/'} exact component={HomeView} />
      <Route path={'/usuarios'} exact component={UserListView} />
      <Route path={'/usuarios/cadastro'} exact component={UserCreateView} />
      <Route path={'/usuarios/edicao/:id'} exact component={UserEditView} />
      <Route path={'/usuarios/:id'} exact component={UserDetailsView} />
      <Route path={'/pagamentos'} exact component={PaymentListView} />
      <Route path={'/pagamentos/cadastro'} exact component={PaymentCreateView} />
      <Route path={'/fluxo-de-caixa/despesas'} exact component={CashFlowExpensesView} />
      <Route path={'/fluxo-de-caixa/receitas'} exact component={CashFlowRevenuesView} />
    </Switch>
  );
}
