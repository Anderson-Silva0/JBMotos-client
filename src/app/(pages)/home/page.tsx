'use client';

import Cookies from 'js-cookie';
import { useEffect, useMemo, useRef, useState } from 'react';
import { decode } from 'jsonwebtoken';
import { DecodedToken } from '@/middleware';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip } from 'chart.js';
import { DailyDataChartService } from '@/services/dailyDataChartService';
import { errorMessage } from '@/models/toast';
import { DailyDataChart } from '@/models/dailyDataChart';
import WelcomeHeader from '@/components/WelcomeHeader';
import '@/styles/home.css';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip);

export default function HomePage() {

  const [chartData, setChartData] = useState<DailyDataChart[]>([]);
  const [userName, setUserName] = useState<string>('');
  const chartRef = useRef<Chart | null>(null);

  const { fetchChartData } = DailyDataChartService();

  const dashboardSummary = useMemo(() => {
    const safeQuantity = (value: number | null | undefined): number => value ?? 0;

    if (!chartData.length) {
      return {
        totalSales: 0,
        totalRepairs: 0,
        peakDayLabel: '--/--',
        peakDayValue: 0,
        lastUpdateLabel: '--/--',
      };
    }

    const totalSales = chartData.reduce((acc, item) => acc + safeQuantity(item.saleQuantity), 0);
    const totalRepairs = chartData.reduce((acc, item) => acc + safeQuantity(item.repairQuantity), 0);

    const peakDay = [...chartData].sort((a, b) => {
      const totalA = safeQuantity(a.saleQuantity) + safeQuantity(a.repairQuantity);
      const totalB = safeQuantity(b.saleQuantity) + safeQuantity(b.repairQuantity);
      return totalB - totalA;
    })[0];

    const formatLabel = (dataMillis: number) => {
      const date = new Date(dataMillis);
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
    };

    const peakDayLabel = formatLabel(peakDay.dataMillis);
    const peakDayValue = safeQuantity(peakDay.saleQuantity) + safeQuantity(peakDay.repairQuantity);
    const lastUpdateLabel = formatLabel(chartData[chartData.length - 1].dataMillis);

    return {
      totalSales,
      totalRepairs,
      peakDayLabel,
      peakDayValue,
      lastUpdateLabel,
    };
  }, [chartData]);

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



function isMobileViewport(): boolean {
  let viewportIsMobile = false;
  const MOBILE_MAX_WIDTH_PX = 999;

  if (typeof window != 'undefined') {
    const mobileBreakpointQuery = `(max-width: ${MOBILE_MAX_WIDTH_PX}px)`;
    const mediaQueryList = window.matchMedia(mobileBreakpointQuery);
    viewportIsMobile = mediaQueryList.matches;
  }

  return viewportIsMobile;
}

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
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Desempenho Mensal',
              font: {
                size: isMobileViewport() ? 16 : 22,
              },
            },
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: 'black',
                font: {
                  size: isMobileViewport() ? 8 : 13,
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
                font: {
                  size: isMobileViewport() ? 9 : 13,
                }
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
    <div className="home-dashboard">
      <WelcomeHeader userName={userName} />

      <section className="dashboard-summary-grid" aria-label="Resumo do desempenho">
        <article className="summary-card">
          <p className="summary-label">Vendas no periodo</p>
          <p className="summary-value">{dashboardSummary.totalSales}</p>
        </article>

        <article className="summary-card">
          <p className="summary-label">Servicos no periodo</p>
          <p className="summary-value">{dashboardSummary.totalRepairs}</p>
        </article>

        <article className="summary-card">
          <p className="summary-label">Pico operacional</p>
          <p className="summary-value">
            {dashboardSummary.peakDayLabel} <span>{dashboardSummary.peakDayValue} itens</span>
          </p>
        </article>

        <article className="summary-card summary-card-highlight">
          <p className="summary-label">Ultima atualizacao</p>
          <p className="summary-value">{dashboardSummary.lastUpdateLabel}</p>
        </article>
      </section>

      <section className="dashboard-chart-panel" aria-label="Grafico de desempenho mensal">
        <div className="chart-panel-header">
          <h2>Visao mensal de vendas e servicos</h2>
          <p>Comparativo diario para apoio rapido nas decisoes operacionais.</p>
        </div>

        <div className="chart-container">
          <canvas id="myChart"></canvas>
        </div>
      </section>
    </div>
  );
}
