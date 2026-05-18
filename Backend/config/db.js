import pg from "pg";
import env from "dotenv";
env.config();

const { Pool } = pg;

const db = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: true, 
  },
  max: 10,                 
  idleTimeoutMillis: 10000, // Reduced to 10s so Node closes idle lines before Neon forces them shut
  connectionTimeoutMillis: 15000,
});

// This catches errors on the pool level so your app doesn't crash
db.on('error', (err) => {
  // We log it as a warning, because node-postgres will automatically 
  // slice out the broken client and make a new one next time you query.
  console.warn('Neon Pool Notice (Expected serverless behavior):', err.message);
});

// REMOVED: The manual db.connect() block that was throwing the unhandled exception.
// The pool will now automatically connect the very first time you run db.query()

export default db;