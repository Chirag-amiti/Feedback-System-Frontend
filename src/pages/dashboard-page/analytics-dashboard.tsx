import { Component, h, State } from '@stencil/core';
import { apiFetch } from '../../utils/apiFetch';
import Chart from 'chart.js/auto';

@Component({
  tag: 'analytics-dashboard',
  styleUrl: 'analytics-dashboard.css', // Assuming this CSS file exists and is correct
  shadow: false,
})
export class ManagerAnalytics {
  @State() averageRating: number | null = null;
  @State() topRated: any[] = [];
  @State() cycleBreakdown: any[] = [];
  @State() error: string = '';
  @State() user: any = null;

  chartRef: HTMLCanvasElement;
  chartInstance: Chart | null = null; // To store the Chart.js instance for destruction

  async componentWillLoad() {
    try {
      // Get logged-in user to know their team
      const userRes = await apiFetch('/api/users/me');
      if (!userRes.ok) {
        throw new Error(`Failed to fetch user: ${userRes.status} ${userRes.statusText}`);
      }
      this.user = await userRes.json();
      console.log('Fetched User:', this.user);

      // Average rating for manager's team
      const avgRes = await apiFetch(`/api/analytics/average-rating/${this.user.team}`);
      if (!avgRes.ok) {
        throw new Error(`Failed to fetch average rating: ${avgRes.status} ${avgRes.statusText}`);
      }
      this.averageRating = await avgRes.json();
      console.log('Fetched Average Rating:', this.averageRating);

      // Top-rated employees
      const topRatedRes = await apiFetch('/api/analytics/top-rated');
      if (!topRatedRes.ok) {
        throw new Error(`Failed to fetch top-rated employees: ${topRatedRes.status} ${topRatedRes.statusText}`);
      }
      // Backend returns [{ "user": "Name", "avgRating": 4.5 }]
      this.topRated = await topRatedRes.json();
      console.log('Fetched Top Rated Employees:', this.topRated);

      // Cycle breakdown data
      const cycleRes = await apiFetch('/api/analytics/cycle-wise');
      if (!cycleRes.ok) {
        throw new Error(`Failed to fetch cycle-wise data: ${cycleRes.status} ${cycleRes.statusText}`);
      }
      const cycleDataMap = await cycleRes.json(); // Backend returns a Map: { "Q1 2025": 5.0, ... }

      // Transform the map into an array of objects for Chart.js
      // Expected format: [{ title: 'Q1 2025', averageRating: 5.0 }, ...]
      this.cycleBreakdown = Object.entries(cycleDataMap).map(([title, averageRating]) => ({
        title: title,
        averageRating: averageRating,
      }));
      console.log('Transformed Cycle Breakdown Data:', this.cycleBreakdown);

    } catch (err: any) { // Use 'any' for error type to safely access 'message'
      console.error('Analytics fetch error:', err);
      this.error = `Failed to load analytics data: ${err.message || 'Unknown error'}`;
    }
  }

  // Use componentDidRender to ensure the canvas element is available
  // and data is ready before initializing the chart.
  componentDidRender() {
    // Destroy existing chart instance before creating a new one to prevent memory leaks
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    if (this.chartRef && this.cycleBreakdown.length > 0) {
      const ctx = this.chartRef.getContext('2d');
      if (!ctx) {
        console.error('Failed to get 2D context for chart canvas.');
        return;
      }

      this.chartInstance = new Chart(ctx, {
        type: 'bar', // Bar chart for cycle-wise ratings
        data: {
          // Map 'title' from your transformed cycleBreakdown to chart labels
          labels: this.cycleBreakdown.map((c) => c.title),
          datasets: [{
            label: 'Average Rating by Cycle',
            // Map 'averageRating' from your transformed cycleBreakdown to chart data
            data: this.cycleBreakdown.map((c) => c.averageRating),
            backgroundColor: '#4CAF50', // Green color for bars
            borderColor: '#388E3C',
            borderWidth: 1,
            borderRadius: 5, // Rounded corners for bars
            // categoryPercentage: 1.0, // Controls the width of the bar group
            // barPercentage: 1.0,   
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Allows the chart to fill its container
          plugins: {
            legend: {
              display: true,
              position: 'top', // Position legend at the top
              labels: {
                font: {
                  size: 14,
                  family: 'Inter, sans-serif', // Use Inter font
                },
                color: '#333',
              },
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += context.parsed.y.toFixed(2); // Format rating to 2 decimal places
                  }
                  return label;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Average Rating',
                font: {
                  size: 14,
                  family: 'Inter, sans-serif',
                },
                color: '#555',
              },
              max: 5, // Assuming ratings are out of 5
              ticks: {
                stepSize: 1,
                font: {
                  family: 'Inter, sans-serif',
                },
                color: '#555',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Performance Cycle',
                font: {
                  size: 14,
                  family: 'Inter, sans-serif',
                },
                color: '#555',
              },
              ticks: {
                font: {
                  family: 'Inter, sans-serif',
                },
                color: '#555',
              },
            },
          },
        },
      });
    }
  }

  // Lifecycle hook to clean up the chart when the component is removed
  disconnectedCallback() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  render() {
    return (
      <div class="manager-analytics-container p-6 bg-gray-50 min-h-screen font-inter">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">📈 Manager Analytics</h2>

        {this.error && <p class="error-message text-red-600 bg-red-100 p-3 rounded-md mb-4 text-center">{this.error}</p>}

        {!this.user ? (
          <p class="text-center text-gray-600">Loading analytics data...</p>
        ) : (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Team Average Rating Section */}
            <div class="section bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
              <h3 class="text-xl font-semibold text-gray-700 mb-3">Team: {this.user.team}</h3>
              <p class="text-4xl font-bold text-blue-600">
                {this.averageRating !== null ? this.averageRating.toFixed(2) : 'N/A'}
              </p>
              <p class="text-gray-500 mt-1">Average Rating</p>
            </div>

            {/* Top-Rated Employees Section */}
            <div class="section bg-white p-6 rounded-lg shadow-md md:col-span-1 lg:col-span-1">
              <h3 class="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <span class="text-yellow-500 mr-2">🏆</span> Top-Rated Employees
              </h3>
              {this.topRated.length === 0 ? (
                <p class="text-gray-500">No top performers yet.</p>
              ) : (
                <ul class="list-disc list-inside space-y-2 text-gray-700">
                  {this.topRated.map((u, index) => (
                    <li key={index} class="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                      {/* Changed u.name to u.user and u.averageRating to u.avgRating */}
                      <span class="font-medium">{u.user}</span>
                      <span class="text-blue-500 font-semibold">(Rating: {u.avgRating !== undefined ? u.avgRating.toFixed(2) : 'N/A'})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Cycle-wise Ratings Chart Section */}
            <div class="section bg-white p-6 rounded-lg shadow-md md:col-span-2 lg:col-span-1">
              <h3 class="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <span class="text-purple-500 mr-2">📅</span> Cycle-wise Ratings
              </h3>
              {this.cycleBreakdown.length === 0 ? (
                <p class="text-gray-500">No cycle data available to display chart.</p>
              ) : (
                <div class="relative h-64"> {/* Fixed height for chart container */}
                  <canvas ref={(el) => (this.chartRef = el as HTMLCanvasElement)}></canvas>
                </div>
              )}
            </div>
          </div>
        )}
         <div class="back">
          <button onClick={() => window.history.back()}>🔙 Back to Dashboard</button>
        </div>
      </div>
    );
  }
}
