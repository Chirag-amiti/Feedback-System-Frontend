import { Component, h, State } from '@stencil/core';
import { apiFetch } from '../../utils/apiFetch';

@Component({
  tag: 'manager-dashboard',
  styleUrl: 'manager-dashboard.css',
  shadow: false,
})
export class ManagerDashboard {
  @State() feedbacks: any[] = [];
  @State() error: string = '';
  @State() user: any = null;
  @State() showFeedbackForm: boolean = false;
  @State() showCycleForm: boolean = false;

  async componentWillLoad() {
    try {
      const userRes = await apiFetch('/api/users/me');
      this.user = await userRes.json();
    } catch (err) {
      this.error = 'Failed to load manager info.';
      return;
    }

    try {
      const res = await apiFetch('/api/feedback/all');
      if (!res.ok) throw new Error('Failed to fetch feedbacks');
      const data = await res.json();

      // Filter into two groups
      this.feedbacks = data.filter(
        (fb) => fb.fromUser.id === this.user.id || fb.toUser.id === this.user.id
      );
    } catch (err) {
      console.error('Error loading feedbacks:', err);
      this.error = 'Could not load feedback list.';
    }
  }


  handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  toggleForm = () => {
    this.showFeedbackForm = !this.showFeedbackForm;
  };

  toggleCycleForm = () => {
    this.showCycleForm = !this.showCycleForm;
  };

  render() {
    return (
      <div class="manager-dashboard-container">
        <div class="header">
          <h2>🧑‍💼 Manager Dashboard</h2>
          <button onClick={this.handleLogout}>Logout</button>
        </div>

        {this.error && <p class="error">{this.error}</p>}

        {this.user && (
          <div class="user-card">
            <h3>Welcome, {this.user.name}</h3>
            <p><strong>Email:</strong> {this.user.email}</p>
            <p><strong>Team:</strong> {this.user.team || 'N/A'}</p>
          </div>
        )}

        <div class="section">
          <h4>📤 Feedback Given by You</h4>
          {this.feedbacks.filter(fb => fb.fromUser.id === this.user.id).length === 0 ? (
            <p>No feedback given yet.</p>
          ) : (
            <ul class="feedback-list">
              {this.feedbacks.filter(fb => fb.fromUser.id === this.user.id).map((fb) => (
                <li>
                  <p><strong>To:</strong> {fb.toUser.name}</p>
                  <p><strong>Rating:</strong> {fb.rating}</p>
                  <p><strong>Feedback:</strong> {fb.comments}</p>
                  <p><strong>Cycle:</strong> {fb.performanceCycle?.title || 'N/A'}</p>
                </li>
              ))}
            </ul>
          )}

          <h4>📥 Feedback Received by You</h4>
          {this.feedbacks.filter(fb => fb.toUser.id === this.user.id).length === 0 ? (
            <p>No feedback received yet.</p>
          ) : (
            <ul class="feedback-list">
              {this.feedbacks.filter(fb => fb.toUser.id === this.user.id).map((fb) => (
                <li>
                  <p><strong>From:</strong> {fb.fromUser.name}</p>
                  <p><strong>Rating:</strong> {fb.rating}</p>
                  <p><strong>Feedback:</strong> {fb.comments}</p>
                  <p><strong>Cycle:</strong> {fb.performanceCycle?.title || 'N/A'}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div class="section">
          <button onClick={this.toggleForm}>
            {this.showFeedbackForm ? 'Cancel Feedback' : 'Give Feedback'}
          </button>
          {this.showFeedbackForm && <manager-feedback-form />}
        </div>

        <div class="section">
          <button onClick={() => (window.location.href = '/dashboard/team-feedback')}>
            👥 View Team Feedback
          </button>
        </div>


        <div class="section">
          <button onClick={() => (window.location.href = '/dashboard/analytics')}>
            📈 View Analytics
          </button>
        </div>

        <div class="section">
          <button onClick={this.toggleCycleForm}>
            {this.showCycleForm ? 'Cancel Cycle Form' : '➕ Create Performance Cycle'}
          </button>
          {this.showCycleForm && <create-performance-cycle />}
        </div>
      </div>
    );
  }
}
