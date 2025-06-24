import { Component, h } from '@stencil/core';

@Component({
  tag: 'not-found-page',
  styleUrl: 'not-found-page.css',
  shadow: false
})
export class NotFoundPage {
  render() {
    return (
      <div class="not-found-container">
        <h1>404</h1>
        <p>Oops! The page you are looking for doesn't exist.</p>
        <a href="/" class="home-link">← Back to Home</a>
      </div>
    );
  }
}
