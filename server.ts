import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const db = new Database('leads.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT,
    message TEXT,
    referrer TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(email, phone)
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Endpoint for Form Submission
  app.post('/api/leads', (req, res) => {
    const apiKey = req.headers['x-api-key'];
    const expectedKey = process.env.LEAD_API_KEY;

    if (!apiKey || apiKey !== expectedKey) {
  return res.status(401).json({ error: 'Unauthorized' });
}

    const { name, email, phone, company, message, referrer } = req.body;

    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required' });
    }

    // Categorization Logic
    let category = 'Uncategorized';
    const refUpper = (referrer || '').toUpperCase();
    if (refUpper.includes('B2B')) category = 'B2B';
    else if (refUpper.includes('BFSI')) category = 'BFSI';
    else if (refUpper.includes('B2E')) category = 'B2E';
    else if (refUpper.includes('NAPS')) category = 'NAPS';
    else if (refUpper.includes('STAFFING')) category = 'STAFFING';

    try {
      const stmt = db.prepare(`
        INSERT INTO leads (name, email, phone, company, message, referrer, category)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(name, email, phone, company, message, referrer, category);
      res.status(201).json({ message: 'Lead captured successfully', category });
    } catch (err: any) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).json({ error: 'Lead with this email and phone already exists' });
      }
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // API Endpoint to fetch leads for dashboard
  app.get('/api/leads', (req, res) => {
    const { category, search } = req.query;
    let query = 'SELECT * FROM leads';
    const params: any[] = [];

    const conditions: string[] = [];
    
    // Filter out Uncategorized leads from UI views
    if (category && category !== 'ALL') {
      conditions.push('category = ?');
      params.push(category);
    } else {
      conditions.push("category != 'Uncategorized'");
    }

    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ? OR phone LIKE ?)');
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    try {
      const leads = db.prepare(query).all(...params);
      res.json(leads);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // API Endpoint for stats
  app.get('/api/stats', (req, res) => {
    try {
      const total = db.prepare("SELECT COUNT(*) as count FROM leads WHERE category != 'Uncategorized'").get() as any;
      const categories = db.prepare('SELECT category, COUNT(*) as count FROM leads GROUP BY category').all() as any[];
      
      const stats = {
        total: total.count,
        B2B: categories.find(c => c.category === 'B2B')?.count || 0,
        BFSI: categories.find(c => c.category === 'BFSI')?.count || 0,
        B2E: categories.find(c => c.category === 'B2E')?.count || 0,
        NAPS: categories.find(c => c.category === 'NAPS')?.count || 0,
        STAFFING: categories.find(c => c.category === 'STAFFING')?.count || 0,
      };
      res.json(stats);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
