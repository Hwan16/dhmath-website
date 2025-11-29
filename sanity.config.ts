import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemas';

export default defineConfig({
  name: 'dhmath-studio',
  title: '다희쌤 수학 - 콘텐츠 관리',
  
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  
  basePath: '/studio', // /studio 경로에서 접근
  
  plugins: [structureTool()],
  
  schema: {
    types: schemaTypes,
  },
});

