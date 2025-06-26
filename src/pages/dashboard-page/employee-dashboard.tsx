import { Component, h, State } from '@stencil/core';
import { apiFetch } from '../../utils/apiFetch';

@Component({
  tag: 'employee-dashboard',
  styleUrl: 'employee-dashboard.css',
  shadow: false,
})
export class EmployeeDashboard {
  @State() user: any = null;
  @State() error: string = '';
  @State() feedbacks: any[] = [];

  async componentWillLoad() {
    try {
      const res = await apiFetch('/api/users/me');
      const data = await res.json();
      this.user = data;

      await this.loadFeedbacks();
    } catch (err) {
      console.error('Error loading user info:', err);
      this.error = 'Failed to load user information.';
    }
  }

  async loadFeedbacks() {
    try {
      const res = await apiFetch('/api/feedback/received');
      const data = await res.json();
      this.feedbacks = data;
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      this.feedbacks = [];
    }
  }

  handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  render() {
    return (
      <div class="employee-dashboard-container">
        <div class="header">
          <h2>👤 Employee Dashboard</h2>
          <button onClick={this.handleLogout}>Logout</button>
        </div>

        {this.error ? (
          <p class="error">{this.error}</p>
        ) : this.user ? (
          <div class="user-card">
            <h3>Welcome, {this.user.name}</h3>
            <p><strong>Email:</strong> {this.user.email}</p>
            <p><strong>Team:</strong> {this.user.team || 'N/A'}</p>
          </div>
        ) : (
          <p>Loading user info...</p>
        )}

        {/* 🔽 Feedback Form (New Section) */}
        <div class="section">
          {/* <h4>📝 Submit Feedback</h4> */}
          <employee-feedback-form></employee-feedback-form>
        </div>

        <div class="section">
          <h4>📌 Your Feedback</h4>
          {this.feedbacks.length === 0 ? (
            <p>No feedback received yet.</p>
          ) : (
            <ul class="feedback-list">
              {this.feedbacks.map((fb) => (
                <li>
                  {/* <p><strong>Quarter:</strong> {fb.quarter}</p> */}
                  <p><strong>Quarter:</strong> {fb.performanceCycle?.title || 'N/A'}</p>
                  <p><strong>From:</strong> {fb.fromUser.name}</p>
                  <p><strong>Rating:</strong> {fb.rating}</p>
                  <p><strong>Comments:</strong> {fb.comments}</p>


                  {/* <p><strong>From:</strong> {fb.fromUser.name}</p>
                  <p><strong>Message:</strong> {fb.message}</p> */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
}
