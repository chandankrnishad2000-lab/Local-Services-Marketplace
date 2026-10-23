require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 8000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Local Services API running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
