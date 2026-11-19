const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = 3000;

app.use(express.static(path.join(__dirname)));

// Root → Login page (users must sign in)
app.get('/', (req, res) => {
  res.redirect('/assets/html/Login.html');
});

app.listen(PORT, () => {
  console.log('');
  console.log('  ✅  PaaniLink is running!');
  console.log(`  🌐  Open: http://localhost:${PORT}`);
  console.log('');
  console.log('  Demo logins:');
  console.log('    Admin          → admin@paanilink.com   / admin123');
  console.log('    Zone Officer   → zeeshan@paanilink.com / officer123');
  console.log('    Hydrant Op.    → tariq@paanilink.com   / pass123');
  console.log('    Driver         → imran@paanilink.com   / pass123');
  console.log('    Customer       → ayesha@example.com    / pass123');
  console.log('');
  console.log('  Press Ctrl+C to stop.');
});
