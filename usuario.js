
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Usuario", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tipo_documento: DataTypes.STRING,
    numero_documento: DataTypes.STRING,
    primer_nombre: DataTypes.STRING,
    direccion_correo: DataTypes.STRING,
    numero_celular: DataTypes.STRING,
    clave: DataTypes.STRING,
    estado: DataTypes.STRING,
    PERFIL_USUARIO_id: DataTypes.INTEGER
  }, {
    tableName: "usuarios", 
    timestamps: false
  });
};
