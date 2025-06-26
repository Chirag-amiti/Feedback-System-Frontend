import { Component, h, State } from '@stencil/core';
import { apiFetch } from '../../utils/apiFetch';

@Component({
  tag: 'manager-dashboard',
  styleUrl: 'manager-dashboard.css',
  shadow: false,
})
export class ManagerDashboard {
  @State() user: any = null;
  @State() loading: boolean = true;
  @State() error: string = '';

  async componentWillLoad() {
    try {
      const res = await apiFetch('/api/users/me');
      const data = await res.json();
      this.user = data;
    } catch (err) {
      console.error('❌ Failed to load user:', err);
      this.error = 'Failed to load user data';
    } finally {
      this.loading = false;
    }
  }

  handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  render() {
    if (this.loading) {
      return <p>Loading your dashboard...</p>;
    }

    if (this.error) {
      return <p class="error">{this.error}</p>;
    }

    return (
      <div class="manager-dashboard">
        <h2>Welcome, {this.user.name}</h2>
        <p>Email: {this.user.email}</p>
        <p>Role: {this.user.role}</p>

        <div class="actions">
          <button onClick={this.handleLogout}>Logout</button>
        </div>
      </div>
    );
  }
}
