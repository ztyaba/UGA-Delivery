const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');

const connectDB = require('./config/db');
const routes = require('./routes');
const { initSocket } = require('./sockets');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database
connectDB();

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err); // eslint-disable-line no-console
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

initSocket(server);

server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`); // eslint-disable-line no-console
});
