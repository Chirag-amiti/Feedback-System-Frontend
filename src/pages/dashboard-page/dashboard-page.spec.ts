import { newSpecPage } from '@stencil/core/testing';
import { DashboardPage } from './dashboard-page';

describe('dashboard-page', () => {
  it('renders correctly', async () => {
    const page = await newSpecPage({
      components: [DashboardPage],
      html: '<dashboard-page></dashboard-page>',
    });
    expect(page.root).toBeTruthy();
  });
});
