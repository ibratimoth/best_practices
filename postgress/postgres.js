const { Sequelize } = require('sequelize');
const dotenv = require("dotenv");

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

//Database configuration

const sequelize = new Sequelize(process.env.DB_NAME, 'postgres', process.env.DB_PASS, {
  host: 'localhost',
  dialect: 'postgres'
});


const connectionDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ alter: true })
    console.log('Dtabase synced')
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = { connectionDB, sequelize }