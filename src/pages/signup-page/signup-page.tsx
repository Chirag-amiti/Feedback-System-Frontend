import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'signup-page',
  styleUrl: 'signup-page.css',
  shadow: false,
})
export class SignupPage {
  @State() name: string = '';
  @State() email: string = '';
  @State() password: string = '';
  @State() team: string = '';
  @State() role: string = '';
  @State() error: string = '';
  @State() success: string = '';

  async handleSignup(e: Event) {
    e.preventDefault();
    this.error = '';
    this.success = '';

    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.name,
          email: this.email,
          password: this.password,
          team: this.team,
          role: this.role === '' ? null : this.role,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Signup failed');
      }

      this.success = 'Signup successful! Please log in.';
      this.name = '';
      this.email = '';
      this.password = '';
      this.team = '';
      this.role = ''; // Clear the role field as well on success
    } catch (err) {
      this.error = err.message || 'Something went wrong.';
    }
  }

  render() {
    return (
      <div class="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={(e) => this.handleSignup(e)}>
          <label>
            Name:
            <input
              type="text"
              value={this.name}
              onInput={(e: any) => (this.name = e.target.value)}
              required
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              value={this.email}
              onInput={(e: any) => (this.email = e.target.value)}
              required
            />
          </label>

          <label>
            Password:
            <input
              type="password"
              value={this.password}
              onInput={(e: any) => (this.password = e.target.value)}
              required
            />
          </label>

          <label>
            Team:
            <input
              type="text"
              value={this.team}
              onInput={(e: any) => (this.team = e.target.value)}
              required
            />
          </label>

          {/* <label>
            Role (Optional):
            <select
              onChange={(e: Event) =>
                (this.role = (e.target as HTMLSelectElement).value)
              }
            >
              <option value="">Select Role</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label> */}


          <button type="submit">Sign Up</button>
        </form>

        {this.error && <p class="error">{this.error}</p>}
        {this.success && <p class="success">{this.success}</p>}

        <p>
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    );
  }
}
