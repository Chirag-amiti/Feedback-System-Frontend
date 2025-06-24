import { Component, h, Host } from '@stencil/core'; // Import Host for best practice
import { match } from 'stencil-router-v2';
// Import specific functions/components from stencil-router-v2
import { createRouter, Route } from 'stencil-router-v2';
// Create an instance of the router. This should typically be done once
// at the top level where you define your router.
const Router = createRouter();
@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: false // Keep as per your original config
})
export class AppRoot {
  render() {
    return (
      // It's good practice to wrap your root component's content in <Host>
      // even if shadow: false, as it represents the component's own element.
      <Host>
        {/*
          The Router instance itself is not used as a JSX component tag.
          Instead, you use Router.Switch to encapsulate your routes.
        */}
        <Router.Switch>
          {/*
            The 'Route' component (imported directly) defines your individual routes.
            You place the component to be rendered as a child of the Route.
          */}
          <Route path="/">
            <login-page /> {/* Your login component */}
          </Route>
          <Route path="/dashboard">
            <dashboard-page /> {/* Your dashboard component */}
          </Route>

          <Route path={match('/(.*)')}>
            <not-found-page />
          </Route>
          
          {/* Optional: Add a 404 route using a wildcard match */}
          {/*
            import { match } from 'stencil-router-v2'; // You'd need to import match as well
            <Route path={match('/(.*)')}>
              <not-found-page />
            </Route>
          */}
        </Router.Switch>
      </Host>
    );
  }
}
