'use client';

import Cookies from 'js-cookie';
import { useEffect, useRef, useState } from 'react';
import { decode } from 'jsonwebtoken';
import { DecodedToken } from '@/middleware';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip } from 'chart.js';
import { DailyDataChartService } from '@/services/dailyDataChartService';
import { errorMessage } from '@/models/toast';
import { DailyDataChart } from '@/models/dailyDataChart';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip);

export default function HomePage() {

  const [chartData, setChartData] = useState<DailyDataChart[]>([]);
  const [userName, setUserName] = useState<string>('');
  const chartRef = useRef<Chart | null>(null);

  const { fetchChartData } = DailyDataChartService();

  useEffect(() => {
    const token = Cookies.get('login-token');
    if (token) {
      const decodedToken = decode(token) as DecodedToken;
      setUserName(decodedToken.userName);
    }

    const fetchDailyDataChart = async () => {
      try {
        const chartDataResponse = await fetchChartData();
        setChartData(chartDataResponse.data);
      } catch (error: any) {
        errorMessage('Erro ao tentar buscar dados do gráfico.');
      }
    };

    fetchDailyDataChart();

  }, []);

  useEffect(() => {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    if (ctx) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const labels = chartData.map((data) => {
        const date = new Date(data.dataMillis);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
      });

      const salesDataQuantity = chartData.map((data) => data.saleQuantity);
      const repairDataQuantity = chartData.map((data) => data.repairQuantity);

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Quantidade de Vendas',
              data: salesDataQuantity,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgb(75, 192, 192)',
              borderWidth: 2,
            },
            {
              label: 'Quantidade de Serviços',
              data: repairDataQuantity,
              borderColor: 'rgb(255, 159, 64)',
              backgroundColor: 'rgb(255, 159, 64)',
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Vendas e Serviços por Dia',
              font: {
                size: 24,
              },
            },
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: 'black',
                font: {
                  size: 14,
                },
              },
            },
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function (tooltipItem) {
                  const label = tooltipItem.dataset.label || '';
                  const value = tooltipItem.raw;
                  return `${label}: ${value}`;
                },
                title: function (tooltipItems) {
                  const date = tooltipItems[0].label;
                  return `Data: ${date}`;
                }
              }
            },

          },
          scales: {
            x: {
              ticks: {
                autoSkip: false,
                display: true,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                display: true,
                stepSize: 1,
                precision: 0,
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <h1>Olá {userName}!</h1>
      <h2>Bem-vindo ao sistema <span style={{ fontSize: '1.2em', fontWeight: 'bolder' }}>JB Motos</span></h2>

      <div style={{ width: '100%', height: '14.6em', display: 'flex', justifyContent: 'center' }}>
        <canvas id="myChart"></canvas>
      </div>
    </div>
  );
}
