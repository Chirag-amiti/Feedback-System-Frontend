import { Component, h, State } from '@stencil/core';
import { apiFetch } from '../../utils/apiFetch';

@Component({
    tag: 'employee-feedback-form',
    styleUrl: 'employee-feedback-form.css',
    shadow: false,
})
export class EmployeeFeedbackForm {
    @State() message: string = '';
    @State() quarter: string = ''; //  Unused: quarter now comes from performanceCycle.title
    @State() rating: number = 0;
    @State() managers: any[] = [];
    @State() cycles: any[] = [];
    @State() selectedCycleId: string = '';
    @State() selectedManagerId: string = '';
    @State() successMessage: string = '';
    @State() errorMessage: string = '';

    async componentWillLoad() {
        try {
            const res = await apiFetch('/api/users');
            const data = await res.json();
            this.managers = data.filter((user: any) => user.role === 'MANAGER');
        } catch (err) {
            console.error('Error fetching managers:', err);
            this.errorMessage = 'Failed to load managers.';
        }

        try {
            const cycleRes = await apiFetch('/api/cycles');
            const cycleData = await cycleRes.json();
            this.cycles = cycleData;
        } catch (err) {
            console.error('Error fetching cycles:', err);
            this.errorMessage = 'Failed to load performance cycles.';
        }
    }

    async handleSubmit(e: Event) {
        e.preventDefault();

        if (!this.selectedManagerId || !this.message || !this.selectedCycleId || this.rating < 1) {
            this.errorMessage = 'All fields are required.';
            this.successMessage = '';
            return;
        }

        try {
            const res = await apiFetch(`/api/feedback/submit/${this.selectedManagerId}`, {
                method: 'POST',
                body: JSON.stringify({
                    comments: this.message,
                    rating: this.rating,
                    performanceCycle: {
                        id: this.selectedCycleId,
                    },
                    // quarter: this.quarter, // ❌ No longer used
                }),
            });

            if (!res.ok) throw new Error('Failed to submit feedback');

            this.successMessage = '✅ Feedback submitted!';
            this.errorMessage = '';
            this.message = '';
            this.quarter = '';
            this.rating = 0;
            this.selectedManagerId = '';
            this.selectedCycleId = '';
        } catch (err) {
            console.error('Submission error:', err);
            this.errorMessage = 'Failed to submit feedback.';
            this.successMessage = '';
        }
    }

    render() {
        return (
            <div class="feedback-form-container">
                <h3>📝 Submit Feedback</h3>
                <form class="feedback-form" onSubmit={(e) => this.handleSubmit(e)}>
                    {this.successMessage && <p class="success">{this.successMessage}</p>}
                    {this.errorMessage && <p class="error">{this.errorMessage}</p>}

                    <label>
                        Select Manager:
                        <select
                            onInput={(e: Event) => {
                                const target = e.target as HTMLSelectElement;
                                this.selectedManagerId = target.value;
                            }}
                        >
                            <option value="">-- Select --</option>
                            {this.managers.map((manager) => (
                                <option
                                    value={manager.id}
                                    selected={this.selectedManagerId === manager.id}
                                >
                                    {manager.name}
                                </option>
                            ))}
                        </select>

                    </label>

                    {/* ❌ Quarter field retained only for reference */}
                    <label>
                        Quarter: (no longer used)
                        <input
                            type="text"
                            value={this.quarter}
                            onInput={(e: any) => (this.quarter = e.target.value)}
                            placeholder="e.g. Q1 2025"
                        />
                    </label>

                    <label>
                        Performance Cycle:
                        <select
                            onInput={(e: Event) => {
                                const target = e.target as HTMLSelectElement;
                                this.selectedCycleId = target.value;
                            }}
                        >
                            <option value="">-- Select --</option>
                            {this.cycles.map((cycle) => (
                                <option
                                    value={cycle.id}
                                    selected={this.selectedCycleId === cycle.id}
                                >
                                    {cycle.title} ({cycle.startDate} → {cycle.endDate})
                                </option>
                            ))}
                        </select>

                    </label>

                    <label>
                        Rating (1-5):
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={this.rating}
                            onInput={(e: any) => (this.rating = parseInt(e.target.value))}
                            placeholder="Enter rating"
                        />
                    </label>

                    <label>
                        Feedback:
                        <textarea
                            value={this.message}
                            onInput={(e: any) => (this.message = e.target.value)}
                            placeholder="Write your feedback here"
                        />
                    </label>

                    <button type="submit">Submit Feedback</button>
                </form>
            </div>
        );
    }
}
