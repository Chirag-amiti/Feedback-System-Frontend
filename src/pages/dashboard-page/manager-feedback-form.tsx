import { Component, h, State } from '@stencil/core';
import { apiFetch } from '../../utils/apiFetch';

@Component({
  tag: 'manager-feedback-form',
  styleUrl: 'manager-feedback-form.css',
  shadow: false,
})
export class ManagerFeedbackForm {
  @State() message: string = '';
  @State() rating: number = 0;
  @State() employees: any[] = [];
  @State() selectedEmployeeId: string = '';
  @State() cycles: any[] = [];
  @State() selectedCycleId: string = '';
  @State() successMessage: string = '';
  @State() errorMessage: string = '';

  async componentWillLoad() {
    try {
      const res = await apiFetch('/api/users');
      const users = await res.json();
      this.employees = users.filter((u: any) => u.role === 'EMPLOYEE');
    } catch (err) {
      console.error('Failed to fetch users:', err);
      this.errorMessage = 'Could not load employees.';
    }

    try {
      const cycleRes = await apiFetch('/api/cycles');
      const cycleData = await cycleRes.json();
      this.cycles = cycleData;
    } catch (err) {
      console.error('Failed to fetch cycles:', err);
      this.errorMessage = 'Could not load performance cycles.';
    }
  }

  async handleSubmit(e: Event) {
    e.preventDefault();

    if (!this.selectedEmployeeId || !this.selectedCycleId || !this.message || !this.rating) {
      this.errorMessage = 'All fields are required.';
      this.successMessage = '';
      return;
    }

    try {
      const res = await apiFetch(`/api/feedback/manager/submit/${this.selectedEmployeeId}`, {
        method: 'POST',
        body: JSON.stringify({
          comments: this.message,
          rating: this.rating,
          cycleId: this.selectedCycleId,
        }),
      });

      if (!res.ok) throw new Error('Submission failed');

      this.successMessage = '✅ Feedback submitted!';
      this.errorMessage = '';
      this.message = '';
      this.rating = 0;
      this.selectedEmployeeId = '';
      this.selectedCycleId = '';
    } catch (err) {
      console.error('Submit error:', err);
      this.errorMessage = 'Submission failed.';
      this.successMessage = '';
    }
  }

  render() {
    return (
      <div class="manager-feedback-form-container">
        <h3>📋 Manager Feedback Form</h3>

        {this.successMessage && <p class="success">{this.successMessage}</p>}
        {this.errorMessage && <p class="error">{this.errorMessage}</p>}

        <form onSubmit={(e) => this.handleSubmit(e)}>
          <label>
            Select Employee:
            <select
              onInput={(e: Event) => {
                const target = e.target as HTMLSelectElement;
                this.selectedEmployeeId = target.value;
              }}
            >
              <option value="">-- Select --</option>
              {this.employees.map(emp => (
                <option
                  value={emp.id}
                  selected={this.selectedEmployeeId === emp.id}
                >
                  {emp.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Select Cycle:
            <select
              onInput={(e: Event) => {
                const target = e.target as HTMLSelectElement;
                this.selectedCycleId = target.value;
              }}
            >
              <option value="">-- Select --</option>
              {this.cycles.map(cycle => (
                <option
                  value={cycle.id}
                  selected={this.selectedCycleId === cycle.id}
                >
                  {cycle.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            Rating (1–5):
            <input
              type="number"
              min="1"
              max="5"
              value={this.rating}
              onInput={(e: any) => (this.rating = parseInt(e.target.value))}
            />
          </label>

          <label>
            Comments:
            <textarea
              value={this.message}
              onInput={(e: any) => (this.message = e.target.value)}
              placeholder="Write your feedback here..."
            ></textarea>
          </label>

          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
