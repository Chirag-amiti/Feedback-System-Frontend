import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'login-page',
  styleUrl: 'login-page.css',
  shadow: false,
})
export class LoginPage {
  @State() email: string = '';
  @State() password: string = '';
  @State() error: string = '';

  private async handleLogin(e: Event) {
    e.preventDefault();
    this.error = '';

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.error = errorText || 'Login failed';
        return;
      }

      const data = await response.json();

      // console.log(data);
      // console.log(response);
      // localStorage.setItem('token', '123');

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error:', err);
      this.error = 'Something went wrong. Please try again.';
    }
  }

  private handleInputChange(event: Event, field: 'email' | 'password') {
    const value = (event.target as HTMLInputElement).value;
    if (field === 'email') this.email = value;
    else this.password = value;
  }

  render() {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/dashboard';
      return null;
    }
    return (
      <div class="login-container">
        <h2>Login</h2>
        <form onSubmit={e => this.handleLogin(e)}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={this.email}
            onInput={e => this.handleInputChange(e, 'email')}
            required
          />

          <label htmlFor="password">Password</label>
          {/* <input
            type="password"
            id="password"
            value={this.password}
            onInput={e => this.handleInputChange(e, 'password')}
            required
          /> */}
          <input
            type="password"
            id="password"
            required
            autocomplete="current-password"
            onInput={(e) => this.password = (e.target as HTMLInputElement).value}
          />


          <button type="submit">Login</button>
        </form>

        <p>Don't have an account? <a href="/signup">Sign up here</a></p>


        {this.error && <p style={{ color: 'red', marginTop: '10px' }}>{this.error}</p>}
      </div>
    );
  }
}
