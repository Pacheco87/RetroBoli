import './config/env.js';

import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';

const port = process.env.PORT || 4000;
const app = createApp();

async function bootstrap() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`RetroBoli API listening on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start RetroBoli API');
  console.error(error);
  process.exit(1);
});
