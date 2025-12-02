import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { ALL_CURRENCIES } from '../../models/currency.model';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.page.html',
  styleUrls: ['./chart.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ChartPage implements OnInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef;

  fromCurrency: string = 'USD';
  toCurrency: string = 'EUR';
  timePeriod: string = '7';
  currencies = ALL_CURRENCIES;
  chart: Chart | null = null;
  isLoading: boolean = false;

  minRate: number = 0;
  maxRate: number = 0;
  avgRate: number = 0;

  constructor(private exchangeRateService: ExchangeRateService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadChartData();
  }

  ionViewWillLeave() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  loadChartData() {
    this.isLoading = true;

    this.exchangeRateService.getRate(this.fromCurrency, this.toCurrency).subscribe({
      next: (currentRate) => {
        const historicalData = this.generateHistoricalData(currentRate, parseInt(this.timePeriod));
        this.calculateStats(historicalData.map(d => d.rate));
        this.isLoading = false;
        setTimeout(() => {
          this.updateChart(historicalData);
        }, 100);
      },
      error: (error) => {
        console.error('Error loading chart data:', error);
        this.isLoading = false;
      }
    });
  }

  generateHistoricalData(currentRate: number, days: number): { date: string, rate: number }[] {
    const data: { date: string, rate: number }[] = [];
    const today = new Date();

    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const fluctuation = (Math.random() - 0.5) * 0.04;
      const rate = currentRate * (1 + fluctuation * (i / days));

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rate: parseFloat(rate.toFixed(4))
      });
    }

    return data;
  }

  calculateStats(rates: number[]) {
    this.minRate = Math.min(...rates);
    this.maxRate = Math.max(...rates);
    this.avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
  }

  updateChart(data: { date: string, rate: number }[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.chartCanvas) {
      return;
    }

    const canvas = this.chartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.date),
        datasets: [{
          label: `${this.fromCurrency} to ${this.toCurrency}`,
          data: data.map(d => d.rate),
          borderColor: '#3880ff',
          backgroundColor: 'rgba(56, 128, 255, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context) => {
                return `Rate: ${context.parsed.y?.toFixed(4) || '0'}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: (value) => {
                return (value as number).toFixed(4);
              }
            }
          }
        }
      }
    });
  }

  onCurrencyChange() {
    this.loadChartData();
  }

  onPeriodChange() {
    this.loadChartData();
  }
}
