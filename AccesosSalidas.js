const DatabaseConnection = require('./DatabaseConnection');

class AccesoSalidas {
    constructor(id = null, movimiento = '', fechaHora = null, puerta = '', tiempoEstadia = 0, vehiculoId = null) {
        this._id = id;
        this._movimiento = movimiento;
        this._fechaHora = fechaHora;
        this._puerta = puerta;
        this._tiempoEstadia = tiempoEstadia;
        this._vehiculoId = vehiculoId;
        this._db = new DatabaseConnection();
    }

    get id() {
        return this._id;
    }

    get movimiento() {
        return this._movimiento;
    }

    get fechaHora() {
        return this._fechaHora;
    }

    get puerta() {
        return this._puerta;
    }

    get tiempoEstadia() {
        return this._tiempoEstadia;
    }

    get vehiculoId() {
        return this._vehiculoId;
    }

    set id(id) {
        this._id = id;
    }

    set movimiento(movimiento) {
        this._movimiento = movimiento;
    }

    set fechaHora(fechaHora) {
        this._fechaHora = fechaHora;
    }

    set puerta(puerta) {
        this._puerta = puerta;
    }

    set tiempoEstadia(tiempoEstadia) {
        this._tiempoEstadia = tiempoEstadia;
    }

    set vehiculoId(vehiculoId) {
        this._vehiculoId = vehiculoId;
    }

    toString() {
        return `Acceso/Salida [ID: ${this._id}, Movimiento: ${this._movimiento}, Fecha/Hora: ${this._fechaHora}, Puerta: ${this._puerta}, Tiempo Estadia: ${this._tiempoEstadia} min, ID Vehículo: ${this._vehiculoId}]`;
    }

    async guardar() {
        try {
            const sql = 'INSERT INTO ACCESO_SALIDAS (movimiento, fecha_hora, puerta, tiempo_estadia, VEHICULO_id) VALUES (?, ?, ?, ?, ?)';
            const params = [this._movimiento, this._fechaHora, this._puerta, this._tiempoEstadia, this._vehiculoId];

            const result = await this._db.executeQuery(sql, params);

            this._id = result.results.insertId;

            await this._db.close();

            return {
                success: true,
                insertId: this._id,
                message: 'Registro de Acceso/Salida guardado exitosamente'
            };
        } catch (error) {
            await this._db.close();
            throw new Error(`Error guardando registro de Acceso/Salida: ${error.message}`);
        }
    }

    async actualizar() {
        try {
            if (!this._id) {
                throw new Error('No se puede actualizar un registro de Acceso/Salida sin ID');
            }

            const sql = 'UPDATE ACCESO_SALIDAS SET movimiento = ?, fecha_hora = ?, puerta = ?, tiempo_estadia = ?, VEHICULO_id = ? WHERE id = ?';
            const params = [this._movimiento, this._fechaHora, this._puerta, this._tiempoEstadia, this._vehiculoId, this._id];

            const result = await this._db.executeQuery(sql, params);
            await this._db.close();

            return {
                success: true,
                affectedRows: result.results.affectedRows,
                message: 'Registro de Acceso/Salida actualizado exitosamente'
            };
        } catch (error) {
            await this._db.close();
            throw new Error(`Error actualizando registro de Acceso/Salida: ${error.message}`);
        }
    }

    async eliminar() {
        try {
            if (!this._id) {
                throw new Error('No se puede eliminar un registro de Acceso/Salida sin ID');
            }

            const result = await this._db.executeQuery('DELETE FROM ACCESO_SALIDAS WHERE id = ?', [this._id]);
            await this._db.close();

            return {
                success: true,
                affectedRows: result.results.affectedRows,
                message: 'Registro de Acceso/Salida eliminado exitosamente'
            };
        } catch (error) {
            await this._db.close();
            throw new Error(`Error eliminando registro de Acceso/Salida: ${error.message}`);
        }
    }

    static async obtenerPorId(id) {
        const db = new DatabaseConnection();
        try {
            const result = await db.executeQuery('SELECT * FROM ACCESO_SALIDAS WHERE id = ?', [id]);
            await db.close();

            if (result.results.length === 0) {
                return null;
            }

            const accesoSalidasData = result.results[0];
            return new AccesoSalidas(
                accesoSalidasData.id,
                accesoSalidasData.movimiento,
                accesoSalidasData.fecha_hora,
                accesoSalidasData.puerta,
                accesoSalidasData.tiempo_estadia,
                accesoSalidasData.VEHICULO_id
            );
        } catch (error) {
            await db.close();
            throw new Error(`Error obteniendo registro de Acceso/Salida por ID: ${error.message}`);
        }
    }

    static async obtenerTodas() {
        const db = new DatabaseConnection();
        try {
            const result = await db.executeQuery('SELECT * FROM ACCESO_SALIDAS');
            await db.close();

            return result.results.map(accesoSalidasData =>
                new AccesoSalidas(
                    accesoSalidasData.id,
                    accesoSalidasData.movimiento,
                    accesoSalidasData.fecha_hora,
                    accesoSalidasData.puerta,
                    accesoSalidasData.tiempo_estadia,
                    accesoSalidasData.VEHICULO_id
                )
            );
        } catch (error) {
            await db.close();
            throw new Error(`Error obteniendo todos los registros de Acceso/Salida: ${error.message}`);
        }
    }

    static async buscarRegistro(query) {
        const db = new DatabaseConnection();
        try {
            const sql = 'SELECT * FROM ACCESO_SALIDAS WHERE movimiento LIKE ? OR puerta LIKE ?';
            const params = [`%${query}%`, `%${query}%`];

            const result = await db.executeQuery(sql, params);
            await db.close();

            return result.results.map(accesoSalidasData =>
                new AccesoSalidas(
                    accesoSalidasData.id,
                    accesoSalidasData.movimiento,
                    accesoSalidasData.fecha_hora,
                    accesoSalidasData.puerta,
                    accesoSalidasData.tiempo_estadia,
                    accesoSalidasData.VEHICULO_id
                )
            );
        } catch (error) {
            await db.close();
            throw new Error(`Error buscando registros de Acceso/Salida: ${error.message}`);
        }
    }

    static mostrarResultados(accesoSalidasRecords, titulo = 'RESULTADOS DE REGISTROS DE ACCESO Y SALIDA') {
        console.log(`\n=== ${titulo} ===`);
        console.log('Número de registros encontrados:', accesoSalidasRecords.length);
        console.log('\nDatos:');

        accesoSalidasRecords.forEach((record, index) => {
            console.log(`\nRegistro ${index + 1}:`);
            console.log(record.toString());
        });
    }

    async cargarDesdeBD() {
        try {
            if (!this._id) {
                throw new Error('No se puede cargar un registro de Acceso/Salida sin ID');
            }

            const result = await this._db.executeQuery('SELECT * FROM ACCESO_SALIDAS WHERE id = ?', [this._id]);
            await this._db.close();

            if (result.results.length === 0) {
                throw new Error('Registro de Acceso/Salida no encontrado en la base de datos');
            }

            const accesoSalidasData = result.results[0];
            this._movimiento = accesoSalidasData.movimiento;
            this._fechaHora = accesoSalidasData.fecha_hora;
            this._puerta = accesoSalidasData.puerta;
            this._tiempoEstadia = accesoSalidasData.tiempo_estadia;
            this._vehiculoId = accesoSalidasData.VEHICULO_id;

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

module.exports = AccesoSalidas;