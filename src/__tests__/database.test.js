require('dotenv').config();
const client = require('../config/database');

test('Database connects successfully', async () => {
  const res = await client.query('SELECT 1');
  expect(res).toBeDefined();
  expect(res.rowCount).toBe(1);
});
