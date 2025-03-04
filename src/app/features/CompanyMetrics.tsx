import { useEffect, useState } from 'react';
import { MetricService } from 't-basilio-sdk';
import { Line } from 'react-chartjs-2';
import { Typography } from 'antd';

import transformDataIntoAntdChart from '../../core/utils/transformDataIntoAntdChart';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { ForbiddenError } from 't-basilio-sdk/dist/errors';
import Forbidden from '../components/Forbidden';

export default function CompanyMetrics() {
  const { Title } = Typography;

  const [data, setData] = useState<Chart.ChartData>();

  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    MetricService.getMonthlyRevenuesExpenses()
      .then(transformDataIntoAntdChart)
      .then(setData)
      .catch(err => {
        if (err instanceof ForbiddenError) {
          setForbidden(true);
          return;
        }
        throw err;
      })
  }, []);

  if (forbidden)
    return <Forbidden minHeight={256} />;

  const options: Chart.ChartOptions = {
    maintainAspectRatio: true,
    elements: {
      line: {
        tension: 0,
      },
      point: {
        pointStyle: 'rect',
        rotation: 45,
        hoverRadius: 5
      },
    },
    legend: {
      display: true,
      position: 'top',
      align: 'start',
      labels: {
        boxWidth: 12,
        fontSize: 16,
        usePointStyle: true,
      },
    },
    scales: {
      xAxes: [
        {
          display: true,
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          type: 'linear',
          display: false,
          position: 'left',
          id: 'cashFlow',
        },
      ],
    },
    tooltips: {
      titleAlign: 'left',
      bodyAlign: 'left',
      titleFontSize: 16,
      bodyFontSize: 14,
      enabled: true,
      caretSize: 10,
      yPadding: 20,
      xPadding: 60,
      custom: (tooltip) => {
        changeTitle(tooltip);
        changeBody(tooltip);
      },
    },
  };

  return (
    <div style={{ width: '100%'}}>
      {data ? (
        <Line type='line' height={200} width={600} data={data} options={options} />
      ) : (
        <Title level={1}>Sem Dados!</Title>
      )}
    </div>
  );

    function changeTitle(tooltip: Chart.ChartTooltipModel) {
      const title = tooltip.title ? tooltip.title.pop() : false;

      if (title)
        tooltip.title.push(
          format(new Date(title.replace('/', '/01/')), 'MMMM yyyy', {
            locale: ptBR,
          })
        );
    }

    function changeBody(tooltip: Chart.ChartTooltipModel) {
      const body = tooltip.body ? tooltip.body[0] : false;

      if (body) {
        const value = body.lines.pop()?.split(' ');

        if (value)
          body.lines.push(
            value[0] +
              ' ' +
              Number(value[1]).toLocaleString('pt-BR', {
                currency: 'BRL',
                style: 'currency',
                maximumFractionDigits: 2,
              })
          );
      }
    }

}
