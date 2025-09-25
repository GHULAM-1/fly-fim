import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4z4f081m',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  },
  deployment: {
    appId: 'yvgjttrx72ew5x96qorxqw8x',
  }
})