import { Component, h, State } from '@stencil/core';
import { apiFetch } from '../../utils/apiFetch';

@Component({
  tag: 'team-feedback-page',
  styleUrl: 'team-feedback-page.css',
  shadow: false,
})
export class TeamFeedbackPage {
  @State() feedbacks: any[] = [];
  @State() error: string = '';
  @State() editingId: number | null = null;
  @State() updatedComments: string = '';
  @State() updatedRating: number = 0;

  async componentWillLoad() {
    try {
      const res = await apiFetch('/api/feedback/team');
      if (!res.ok) throw new Error('Failed to fetch feedbacks');
      this.feedbacks = await res.json();
    } catch (err) {
      console.error(err);
      this.error = 'Error loading team feedback.';
    }
  }

  handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    try {
      const res = await apiFetch(`/api/feedback/${id}`, { method: 'DELETE' });
      if (res.ok) {
        this.feedbacks = this.feedbacks.filter(fb => fb.id !== id);
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      console.error(err);
      this.error = 'Failed to delete feedback.';
    }
  };

  startEdit = (fb: any) => {
    this.editingId = fb.id;
    this.updatedComments = fb.comments;
    this.updatedRating = fb.rating;
  };

  cancelEdit = () => {
    this.editingId = null;
    this.updatedComments = '';
    this.updatedRating = 0;
  };

handleSave = async () => {
  try {
    const res = await apiFetch(`/api/feedback/${this.editingId}`, {
      method: 'PUT',
      body: JSON.stringify({
        comments: this.updatedComments,
        rating: this.updatedRating,
        cycleId: this.feedbacks.find(fb => fb.id === this.editingId)?.performanceCycle?.id || null,
      }),
    });

      if (res.ok) {
        const updated = await res.json();
        this.feedbacks = this.feedbacks.map(fb => (fb.id === updated.id ? updated : fb));
        this.cancelEdit();
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      console.error(err);
      this.error = 'Failed to update feedback.';
    }
  };

  render() {
    return (
      <div class="team-feedback-container">
        <h2>👥 Team Feedback Overview</h2>

        {this.error && <p class="error">{this.error}</p>}

        {this.feedbacks.length === 0 ? (
          <p>No feedback found for your team.</p>
        ) : (
          <ul class="feedback-list">
            {this.feedbacks.map(fb => (
              <li>
                <p><strong>From:</strong> {fb.fromUser.name} ({fb.fromUser.team})</p>
                <p><strong>To:</strong> {fb.toUser.name} ({fb.toUser.team})</p>
                {this.editingId === fb.id ? (
                  <div class="edit-form">
                    <label>Rating:
                      <input type="number" min="1" max="5" value={this.updatedRating} onInput={e => this.updatedRating = parseInt((e.target as HTMLInputElement).value)} />
                    </label>
                    <label>Comments:
                      <textarea value={this.updatedComments} onInput={e => this.updatedComments = (e.target as HTMLTextAreaElement).value}></textarea>
                    </label>
                    <button onClick={this.handleSave}>💾 Save</button>
                    <button onClick={this.cancelEdit}>❌ Cancel</button>
                  </div>
                ) : (
                  <div>
                    <p><strong>Rating:</strong> {fb.rating}</p>
                    <p><strong>Comments:</strong> {fb.comments}</p>
                    <p><strong>Cycle:</strong> {fb.performanceCycle?.title || 'N/A'}</p>
                    <button onClick={() => this.startEdit(fb)}>✏️ Edit</button>
                    <button onClick={() => this.handleDelete(fb.id)}>🗑️ Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <div class="back">
          <button onClick={() => window.history.back()}>🔙 Back to Dashboard</button>
        </div>
      </div>
    );
  }
}
