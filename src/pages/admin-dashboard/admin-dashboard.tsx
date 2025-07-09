import { Component, h, State } from '@stencil/core';
import { apiFetch } from '../../utils/apiFetch';

@Component({
  tag: 'admin-dashboard',
  styleUrl: 'admin-dashboard.css',
  shadow: false,
})
export class AdminDashboard {
  @State() users: any[] = [];
  @State() currentPage: number = 0;
  @State() totalPages: number = 1;
  @State() selectedRole: string = '';
  @State() loading: boolean = false;
  @State() error: string = '';

  pageSize: number = 5;

  async componentWillLoad() {
    await this.fetchUsers();
  }

  async fetchUsers(page = 0) {
    this.loading = true;
    try {
      const roleParam = this.selectedRole ? `&role=${this.selectedRole}` : '';
      const res = await apiFetch(`/api/admin/users?page=${page}&size=${this.pageSize}${roleParam}`);
      const data = await res.json();
      this.users = data.users;
      this.currentPage = data.currentPage;
      this.totalPages = data.totalPages;
    } catch (err) {
      this.error = 'Failed to load users.';
    } finally {
      this.loading = false;
    }
  }

  handleRoleChange(event: Event, userId: number) {
    const select = event.target as HTMLSelectElement;
    const updatedRole = select.value;
    const updatedUsers = [...this.users];
    const userIndex = updatedUsers.findIndex((u) => u.id === userId);
    if (userIndex > -1) {
      updatedUsers[userIndex].role = updatedRole;
      this.users = updatedUsers;
    }
  }

  handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  async updateUserRole(userId: number, role: string) {
    try {
      await apiFetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      });
      alert('Role updated successfully!');
    } catch (err) {
      alert('Failed to update role.');
    }
  }

  renderPagination() {
    const pages = Array.from({ length: this.totalPages }, (_, i) => i);
    return (
      <div class="pagination">
        {pages.map((p) => (
          <button
            class={p === this.currentPage ? 'active' : ''}
            onClick={() => this.fetchUsers(p)}
          >
            {p + 1}
          </button>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div class="admin-dashboard">
        <h2>🛠️ Admin Dashboard</h2>
        <button onClick={this.handleLogout}>Logout</button>

        <div class="filter">
          <label>
            Filter by Role:
            <select
              onInput={(e: Event) => {
                const target = e.target as HTMLSelectElement;
                this.selectedRole = target.value;
                this.fetchUsers();
              }}
            >
              <option value="">All</option>
              <option value="EMPLOYEE" selected={this.selectedRole === 'EMPLOYEE'}>Employee</option>
              <option value="MANAGER" selected={this.selectedRole === 'MANAGER'}>Manager</option>
              <option value="ADMIN" selected={this.selectedRole === 'ADMIN'}>Admin</option>
            </select>
          </label>
        </div>

        {this.error && <p class="error">{this.error}</p>}

        {this.loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Change Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.users.map((user) => (
                <tr>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <select onInput={(e: Event) => this.handleRoleChange(e, user.id)}>
                      <option value="EMPLOYEE" selected={user.role === 'EMPLOYEE'}>Employee</option>
                      <option value="MANAGER" selected={user.role === 'MANAGER'}>Manager</option>
                      <option value="ADMIN" selected={user.role === 'ADMIN'}>Admin</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => this.updateUserRole(user.id, user.role)}>Save</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {this.renderPagination()}
      </div>
    );
  }
}
