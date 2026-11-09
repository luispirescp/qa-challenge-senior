import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Procura recursivamente por arquivos de teste dentro de tests/
});