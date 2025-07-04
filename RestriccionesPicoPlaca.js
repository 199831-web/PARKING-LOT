const DatabaseConnection = require('./DatabaseConnection');

class PicoPlaca {
  constructor(id = null, tipoVehiculo = '', numero = '', dia = '') {
    this._id = id;
    this._tipoVehiculo = tipoVehiculo;
    this._numero = numero;
    this._dia = dia;
    this._db = new DatabaseConnection();
  }

  get id() {
    return this._id;
  }

  get tipoVehiculo() {
    return this._tipoVehiculo;
  }

  get numero() {
    return this._numero;
  }

  get dia() {
    return this._dia;
  }

  set id(id) {
    this._id = id;
  }

  set tipoVehiculo(tipoVehiculo) {
    this._tipoVehiculo = tipoVehiculo;
  }

  set numero(numero) {
    this._numero = numero;
  }

  set dia(dia) {
    this._dia = dia;
  }

  toString() {
    return `PicoPlaca [ID: ${this._id}, Tipo Vehiculo: ${this._tipoVehiculo}, Número: ${this._numero}, Día: ${this._dia}]`;
  }

  async guardar() {
    try {
      const sql = 'INSERT INTO PICO_PLACA (tipo_vehiculo, numero, dia) VALUES (?,?,?)';
      const params = [this._tipoVehiculo, this._numero, this._dia];

      const result = await this._db.executeQuery(sql, params);

      this._id = result.results.insertId;

      await this._db.close();

      return {
        success: true,
        insertId: this._id,
        message: 'Regla de Pico y Placa guardada exitosamente'
      };
    } catch (error) {
      await this._db.close();
      throw new Error(`Error guardando regla de Pico y Placa: ${error.message}`);
    }
  }

  async actualizar() {
    try {
      if (!this._id) {
        throw new Error('No se puede actualizar una regla de Pico y Placa sin ID');
      }

      const sql = 'UPDATE PICO_PLACA SET tipo_vehiculo = ?, numero = ?, dia = ? WHERE id = ?';
      const params = [this._tipoVehiculo, this._numero, this._dia, this._id];

      const result = await this._db.executeQuery(sql, params);
      await this._db.close();

      return {
        success: true,
        affectedRows: result.results.affectedRows,
        message: 'Regla de Pico y Placa actualizada exitosamente'
      };
    } catch (error) {
      await this._db.close();
      throw new Error(`Error actualizando regla de Pico y Placa: ${error.message}`);
    }
  }

  async eliminar() {
    try {
      if (!this._id) {
        throw new Error('No se puede eliminar una regla de Pico y Placa sin ID');
      }

      const result = await this._db.executeQuery('DELETE FROM PICO_PLACA WHERE id = ?', [this._id]);
      await this._db.close();

      return {
        success: true,
        affectedRows: result.results.affectedRows,
        message: 'Regla de Pico y Placa eliminada exitosamente'
      };
    } catch (error) {
      await this._db.close();
      throw new Error(`Error eliminando regla de Pico y Placa: ${error.message}`);
    }
  }

  static async obtenerPorId(id) {
    const db = new DatabaseConnection();
    try {
      const result = await db.executeQuery('SELECT * FROM PICO_PLACA WHERE id = ?', [id]);
      await db.close();

      if (result.results.length === 0) {
        return null;
      }

      const picoPlacaData = result.results[0];
      return new PicoPlaca(
        picoPlacaData.id,
        picoPlacaData.tipo_vehiculo,
        picoPlacaData.numero,
        picoPlacaData.dia
      );
    } catch (error) {
      await db.close();
      throw new Error(`Error obteniendo regla de Pico y Placa por ID: ${error.message}`);
    }
  }

  static async obtenerTodas() {
    const db = new DatabaseConnection();
    try {
      const result = await db.executeQuery('SELECT * FROM PICO_PLACA');
      await db.close();

      return result.results.map(picoPlacaData =>
        new PicoPlaca(
          picoPlacaData.id,
          picoPlacaData.tipo_vehiculo,
          picoPlacaData.numero,
          picoPlacaData.dia
        )
      );
    } catch (error) {
      await db.close();
      throw new Error(`Error obteniendo todas las reglas de Pico y Placa: ${error.message}`);
    }
  }

  static mostrarResultados(picoPlacaRules, titulo = 'RESULTADOS DE REGLAS DE PICO Y PLACA') {
    console.log(`\n=== ${titulo} ===`);
    console.log('Número de reglas encontradas:', picoPlacaRules.length);
    console.log('\nDatos:');

    picoPlacaRules.forEach((rule, index) => {
      console.log(`\nRegla ${index + 1}:`);
      console.log(rule.toString());
    });
  }

  async cargarDesdeBD() {
    try {
      if (!this._id) {
        throw new Error('No se puede cargar una regla de Pico y Placa sin ID');
      }

      const result = await this._db.executeQuery('SELECT * FROM PICO_PLACA WHERE id = ?', [this._id]);
      await this._db.close();

      if (result.results.length === 0) {
        throw new Error('Regla de Pico y Placa no encontrada en la base de datos');
      }

      const picoPlacaData = result.results[0];
      this._tipoVehiculo = picoPlacaData.tipo_vehiculo;
      this._numero = picoPlacaData.numero;
      this._dia = picoPlacaData.dia;

      return {
        success: true,
        message: 'Datos cargados exitosamente'
      };
    } catch (error) {
      await this._db.close();
      throw new Error(`Error cargando datos: ${error.message}`);
    }
  }
}

module.exports = PicoPlaca;
