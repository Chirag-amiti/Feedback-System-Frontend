import { Component, h, State } from '@stencil/core';
import { apiFetch } from '../../utils/apiFetch';

// import { injectHistory } from 'stencil-router-v2';

@Component({
  tag: 'dashboard-page',
  styleUrl: 'dashboard-page.css',
  shadow: false,
})
export class DashboardPage {
  @State() isAuthorized: boolean = false;
  @State() redirectUrl: string | null = null;

//  @Prop() history: any;

  async componentWillLoad() {
    const token = localStorage.getItem('token');

    if (!token) {
      // No token, redirect to login
      window.location.href = '/';
      return;
    }

    try {
      // Fetch user info using token
      const res = await apiFetch('/api/users/me');
      const data = await res.json();

      // Redirect based on user role
      if (data.role === 'EMPLOYEE') {
        this.redirectUrl = '/employee-dashboard';
      } else if (data.role === 'MANAGER') {
        this.redirectUrl = '/manager-dashboard';
      } else {
        this.redirectUrl = '/';
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
      localStorage.removeItem('token');
      window.location.href = '/';
    }
  }

  render() {
    if (this.redirectUrl) {
      // return <stencil-router-redirect url={this.redirectUrl} />;

      window.location.href = this.redirectUrl;
      return;


      // return (<stencil-router-redirect url={this.redirectUrl} />);
        //  this.history.push(this.redirectUrl);
      // return (<div class="dashboard-container"> <h2>Dashboard</h2> </div>);
    }

    return <p>🔃 Redirecting...</p>;
  }
}








// import { Component, h, State } from '@stencil/core';
// import { apiFetch } from '../../utils/apiFetch';

// @Component({
//   tag: 'dashboard-page',
//   styleUrl: 'dashboard-page.css',
//   shadow: false,
// })
// export class DashboardPage {
//   @State() isAuthorized: boolean = false;
//   @State() user: any = null;
//   @State() error: string = '';
//   @State() message: string = '';

//   componentWillLoad() {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       window.location.href = '/';
//     } else {
//       this.isAuthorized = true;
//       this.loadUserInfo();
//     }
//   }

//   async loadUserInfo() {
//     try {
//       const res = await apiFetch('/api/users/me');
//       if (!res.ok) throw new Error('Failed to fetch user');
//       const data = await res.json();
//       this.user = data;
//     } catch (err) {
//       this.error = 'Error loading user information.';
//       console.error(err);
//     }
//   }

// //   async loadUserInfo() {
// //   try {
// //     const res = await apiFetch('/api/users/me');
// //     const data = await res.json();
// //     this.message = `Welcome, ${data.name}`;
// //   } catch (err) {
// //     console.error('❌ Fetch error:', err);
// //     this.message = 'Error loading user information.';
// //   }
// // }


//   handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     window.location.href = '/';
//   };

//   render() {
//     if (!this.isAuthorized) return null;

//     return (
//       <div class="dashboard-container">
//         <h2>Dashboard</h2>

//         {this.error ? (
//           <p class="error">{this.error}</p>
//         ) : this.user ? (
//           <div>
//             <p><strong>Welcome,</strong> {this.user.name}</p>
//             <p><strong>Email:</strong> {this.user.email}</p>
//             <p><strong>Role:</strong> {this.user.role}</p>
//             <p><strong>Team:</strong> {this.user.team}</p>
//           </div>
//         ) : (
//           <p>Loading user info...</p>
//         )}

//         <button onClick={this.handleLogout}>Logout</button>
//       </div>
//     );
//   }
// }
