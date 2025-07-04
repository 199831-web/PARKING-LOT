
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Vehiculo", {
    placa: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    marca: DataTypes.STRING,
    modelo: DataTypes.STRING,
    color: DataTypes.STRING,
    tipo: DataTypes.STRING,
    USUARIO_id: DataTypes.INTEGER
  }, {
    tableName: "vehiculos", 
    timestamps: false
  });
};
