const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Application is healthy' });
});

app.get('/', (req, res) => {
  res.send('Jenkins CI/CD Pipeline Assessment App is Running Successfully!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});