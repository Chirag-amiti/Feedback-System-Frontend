import { Component, h } from '@stencil/core';

@Component({
  tag: 'dashboard-page',
  styleUrl: 'dashboard-page.css',
  shadow: true,
})
export class DashboardPage {
  render() {
    return (
      <div class="dashboard-container">
        <h1>Dashboard</h1>
        <p>Welcome to your feedback dashboard.</p>
        {/* Add more UI blocks or navigation here */}
      </div>
    );
  }
}
