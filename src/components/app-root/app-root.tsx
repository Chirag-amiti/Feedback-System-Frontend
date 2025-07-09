import { Component, h, Host } from '@stencil/core';
import { match } from 'stencil-router-v2';
import { createRouter, Route } from 'stencil-router-v2';


const Router = createRouter();
@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: false
})
export class AppRoot {
  render() {
    return (
      <Host>
        <Router.Switch>
          <Route path="/">
            <login-page />
          </Route>
          <Route path="/signup">
            <signup-page />
          </Route>
          <Route path="/dashboard">
            <dashboard-page />
          </Route>
          <Route path="/employee-dashboard">
            <employee-dashboard />
          </Route>
          <Route path="/manager-dashboard">
            <manager-dashboard />
          </Route>

          <Route path="/admin-dashboard">
            <admin-dashboard />
          </Route>


          <Route path="/dashboard/analytics">
            <analytics-dashboard />
          </Route>

          <Route path="/dashboard/team-feedback">
            <team-feedback-page />
          </Route>

          <Route path={match('/(.*)')}>
            <not-found-page />
          </Route>
        </Router.Switch>
      </Host>
    );
  }
}
