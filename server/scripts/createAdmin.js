const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const username = 'Apsit@123';
  const password = "Apsit@123"
  // const password = await bcrypt.hash('Apsit@123', 10);
  await Admin.create({ username, password });
  console.log('Admin created!');
  process.exit(0);
});