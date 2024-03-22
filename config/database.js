const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'sql6.freesqldatabase.com',
  port: '3306',
  username: 'sql6693360',
  password: 'nz7dFy88kV',
  database: 'sql6693360',
  logging: false // Set to true if you want to see SQL logs
});

// // Test the connection
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

// module.exports = sequelize;

(async () => {
    try {
      await sequelize.sync();
      console.log('Database synchronized successfully');
    } catch (error) {
      console.error('Error synchronizing database:', error);
    }
  })();


module.exports = sequelize;
