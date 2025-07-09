import { Component, h, State } from '@stencil/core';
import { apiFetch } from '../../utils/apiFetch';

@Component({
  tag: 'dashboard-page',
  styleUrl: 'dashboard-page.css',
  shadow: false,
})
export class DashboardPage {
  @State() isAuthorized: boolean = false;
  @State() redirectUrl: string | null = null;

  async componentWillLoad() {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/';
      return;
    }

    try {
      const res = await apiFetch('/api/users/me');
      console.log("hey, I am responce", res);
      const data = await res.json();

      if (data.role === 'EMPLOYEE') {
        this.redirectUrl = '/employee-dashboard';
      } else if (data.role === 'MANAGER') {
        this.redirectUrl = '/manager-dashboard';
      } else if (data.role === 'ADMIN') {
        this.redirectUrl = '/admin-dashboard';
      } else {
        this.redirectUrl = '/';
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
      localStorage.removeItem('token');
      window.location.href = '/';
    }
  }

  render() {
    if (this.redirectUrl) {
      window.location.href = this.redirectUrl;
      return;
    }

    return <p> Redirecting...</p>;
  }
}
