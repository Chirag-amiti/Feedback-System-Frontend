# app-root



<!-- Auto Generated Below -->


## Dependencies

### Depends on

- [login-page](../../pages/login-page)
- [signup-page](../../pages/signup-page)
- [dashboard-page](../../pages/dashboard-page)
- [employee-dashboard](../../pages/dashboard-page)
- [manager-dashboard](../../pages/dashboard-page)
- [analytics-dashboard](../../pages/dashboard-page)
- [not-found-page](../../pages/not-found-page)

### Graph
```mermaid
graph TD;
  app-root --> login-page
  app-root --> signup-page
  app-root --> dashboard-page
  app-root --> employee-dashboard
  app-root --> manager-dashboard
  app-root --> analytics-dashboard
  app-root --> not-found-page
  employee-dashboard --> employee-feedback-form
  manager-dashboard --> manager-feedback-form
  manager-dashboard --> create-performance-cycle
  style app-root fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
