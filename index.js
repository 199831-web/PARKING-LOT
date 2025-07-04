const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('parkinglot', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});


sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión con Sequelize a MySQL exitosa.');
  })
  .catch(err => {
    console.error('❌ Error al conectar con Sequelize:', err.message);
  });

module.exports = sequelize;
