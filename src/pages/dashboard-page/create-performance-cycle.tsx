import { Component, h, State } from '@stencil/core';
import { apiFetch } from '../../utils/apiFetch';

@Component({
  tag: 'create-performance-cycle',
  styleUrl: 'create-performance-cycle.css',
  shadow: false,
})
export class CreatePerformanceCycle {
  @State() title: string = '';
  @State() startDate: string = '';
  @State() endDate: string = '';
  @State() successMessage: string = '';
  @State() errorMessage: string = '';

  async handleSubmit(e: Event) {
    e.preventDefault();

    if (!this.title || !this.startDate || !this.endDate) {
      this.errorMessage = 'All fields are required.';
      this.successMessage = '';
      return;
    }

    try {
      const res = await apiFetch('/api/cycles/create', {
        method: 'POST',
        body: JSON.stringify({
          title: this.title,
          startDate: this.startDate,
          endDate: this.endDate,
        }),
      });

      if (!res.ok) throw new Error('Failed to create cycle');

      this.successMessage = '✅ Performance cycle created!';
      this.errorMessage = '';
      this.title = '';
      this.startDate = '';
      this.endDate = '';
    } catch (err) {
      console.error('Error submitting cycle:', err);
      this.errorMessage = '❌ Failed to create performance cycle.';
      this.successMessage = '';
    }
  }

  render() {
    return (
      <div class="cycle-form-container">
        <h3>📅 Create Performance Cycle</h3>

        <form onSubmit={(e) => this.handleSubmit(e)}>
          {this.successMessage && <p class="success">{this.successMessage}</p>}
          {this.errorMessage && <p class="error">{this.errorMessage}</p>}

          <label>
            Title:
            <input
              type="text"
              placeholder="e.g. Q3 2025"
              onInput={(e: any) => (this.title = e.target.value)}
            />
          </label>

          <label>
            Start Date:
            <input
              type="date"
              onInput={(e: any) => (this.startDate = e.target.value)}
            />
          </label>

          <label>
            End Date:
            <input
              type="date"
              onInput={(e: any) => (this.endDate = e.target.value)}
            />
          </label>

          <button type="submit">Create Cycle</button>
        </form>
      </div>
    );
  }
}
