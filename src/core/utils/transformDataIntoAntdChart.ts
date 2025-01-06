import { format } from 'date-fns';
import { Metric } from 't-basilio-sdk';

export default function transformDataIntoAntdChart(
  datas: Metric.MonthlyRevenuesExpenses
): Chart.ChartData {
  const labels: string[] = [];
  const data1: number[] = [];
  const data2: number[] = [];

  datas.forEach((data) => {
    const date = new Date(data.yearMonth)
    labels.push(format(date, 'MM/yyyy'));
    data1.push(data.totalRevenues);
    data2.push(data.totalExpenses)
  });

  return {
    labels,
    datasets: [
      {
        label: 'Receitas',
        data: data1,
        fill: true,
        backgroundColor: '#09f',
        borderColor: 'transparent',
        borderWidth: 0.5,
      },
      {
        label: 'Despesas',
        data: data2,
        fill: true,
        backgroundColor: '#274060',
        borderColor: '#274060',
        borderWidth: 0.5,
      },
    ],
  };
}
