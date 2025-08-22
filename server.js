require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cron = require('node-cron');
const connectDB = require('./config/db');
const { getLowStock, getExpiring } = require('./utils/alerts');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./docs/swagger.json');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => res.json({ message: 'Pharmacy Inventory System API' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Start
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pharmacy_inventory';

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});

// Cron for alerts
const schedule = process.env.CRON_SCHEDULE || '0 8 * * *'; // every day 08:00
const windowDays = parseInt(process.env.ALERT_WINDOW_DAYS || '30', 10);

cron.schedule(schedule, async () => {
  console.log('⏰ Running daily alert job...');
  try {
    const low = await getLowStock();
    if (low.length) {
      console.log(`LOW STOCK (${low.length}):`, low.map(i => `${i.name} (${i.batchNo}) qty=${i.quantity}/${i.threshold}`));
    } else {
      console.log('No low stock items.');
    }

    const exp = await getExpiring(windowDays);
    if (exp.length) {
      console.log(`EXPIRING in next ${windowDays} days (${exp.length}):`, exp.map(i => `${i.name} (${i.batchNo}) exp=${i.expiryDate.toISOString().slice(0,10)}`));
    } else {
      console.log('No items expiring soon.');
    }
  } catch (err) {
    console.error('Alert job error:', err.message);
  }
});