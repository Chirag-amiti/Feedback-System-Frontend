import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'frontend',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      // customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      indexHtml: 'index.html',
    },
  ],

  // testing: {
  //   browserHeadless: true,
  // },
};

// import { Config } from '@stencil/core';

// export const config: Config = {
//   namespace: 'frontend',
//   outputTargets: [
//     {
//       type: 'dist',
//       esmLoaderPath: '../loader',
//     },
//     {
//       type: 'dist-custom-elements',
//       externalRuntime: false,
//     },
//     {
//       type: 'docs-readme',
//     },
//     {
//       type: 'www',
//       serviceWorker: null,
//     },
//   ],
// };
