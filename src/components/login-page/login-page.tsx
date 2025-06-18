import { Component, State, h } from '@stencil/core';
import { login } from '../../services/api';

@Component({
  tag: 'login-page',
  styleUrl: 'login-page.css',
  shadow: true,
})
export class LoginPage {
  @State() email: string = '';
  @State() password: string = '';
  @State() errorMessage: string = '';

  handleInputChange(event: Event, field: 'email' | 'password') {
    const target = event.target as HTMLInputElement;
    this[field] = target.value;
  }

  async handleLogin(event: Event) {
    event.preventDefault();
    try {
      const token = await login(this.email, this.password);
      localStorage.setItem('token', token);
      alert('Login successful');
      // You can redirect or change page state here
    } catch (error) {
      this.errorMessage = 'Invalid email or password.';
    }
  }

  render() {
    return (
      <div class="login-container">
        <h2>Login</h2>
        <form onSubmit={(e) => this.handleLogin(e)}>
          <input
            type="email"
            placeholder="Email"
            value={this.email}
            onInput={(e) => this.handleInputChange(e, 'email')}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={this.password}
            onInput={(e) => this.handleInputChange(e, 'password')}
            required
          />
          {this.errorMessage && <p class="error">{this.errorMessage}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}
