import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'w28mpa',
  e2e: {
    baseUrl: 'http://localhost:4174',
    supportFile: false,
    excludeSpecPattern: ['*/*/**/screenshot.cy.ts'],
  },
});
