const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('velina.sqlite');

// Initialize the database and create the history table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS history (
      chat_id TEXT,
      role TEXT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

function addMessage(chatId, role, content) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO history (chat_id, role, content) VALUES (?, ?, ?)`,
      [chatId, role, content],
      function (err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

function getHistory(chatId, limit = 20) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT role, content FROM history WHERE chat_id = ? ORDER BY created_at DESC LIMIT ?`,
      [chatId, limit],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows.reverse()); // Reverse to maintain the order of messages
      }
    );
  });
}



  

module.exports = { addMessage, getHistory };
