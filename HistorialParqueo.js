const DatabaseConnection = require('./DatabaseConnection');

class HistorialParqueo {
    constructor(celdaId = null, vehiculoId = null, fechaHora = null) {
        this._celdaId = celdaId;
        this._vehiculoId = vehiculoId;
        this._fechaHora = fechaHora;
        this._db = new DatabaseConnection();
    }

    // Getters
    get celdaId() {
        return this._celdaId;
    }

    get vehiculoId() {
        return this._vehiculoId;
    }

    get fechaHora() {
        return this._fechaHora;
    }

    // Setters
    set celdaId(celdaId) {
        this._celdaId = celdaId;
    }

    set vehiculoId(vehiculoId) {
        this._vehiculoId = vehiculoId;
    }

    set fechaHora(fechaHora) {
        this._fechaHora = fechaHora;
    }

    toString() {
        return `HistorialParqueo [ID Celda: ${this._celdaId}, ID Vehiculo: ${this._vehiculoId}, Fecha/Hora: ${this._fechaHora}]`;
    }

    // ================== MÉTODOS DE BASE DE DATOS ==================

    async guardar() {
        try {
            if (this._celdaId === null || this._vehiculoId === null) {
                throw new Error('No se puede guardar un registro de historial de parqueo sin ID de Celda y ID de Vehículo.');
            }
            const sql = 'INSERT INTO HISTORIAL_PARQUEO (CELDA_id, VEHICULO_id, fecha_hora) VALUES (?, ?, ?)';
            const params = [this._celdaId, this._vehiculoId, this._fechaHora];

            const result = await this._db.executeQuery(sql, params);
            await this._db.close();

            return {
                success: true,
                message: 'Registro de Historial de Parqueo guardado exitosamente'
            };
        } catch (error) {
            await this._db.close();
            throw new Error(`Error guardando registro de historial de parqueo: ${error.message}`);
        }
    }

    async actualizar() {
        try {
            if (this._celdaId === null || this._vehiculoId === null) {
                throw new Error('No se puede actualizar un registro de historial de parqueo sin ID de Celda y ID de Vehículo.');
            }

            const sql = 'UPDATE HISTORIAL_PARQUEO SET fecha_hora = ? WHERE CELDA_id = ? AND VEHICULO_id = ?';
            const params = [this._fechaHora, this._celdaId, this._vehiculoId];

            const result = await this._db.executeQuery(sql, params);
            await this._db.close();

            return {
                success: true,
                affectedRows: result.results.affectedRows,
                message: 'Registro de Historial de Parqueo actualizado exitosamente'
            };
        } catch (error) {
            await this._db.close();
            throw new Error(`Error actualizando registro de historial de parqueo: ${error.message}`);
        }
    }

    async eliminar() {
        try {
            if (this._celdaId === null || this._vehiculoId === null) {
                throw new Error('No se puede eliminar un registro de historial de parqueo sin ID de Celda y ID de Vehículo.');
            }

            const result = await this._db.executeQuery('DELETE FROM HISTORIAL_PARQUEO WHERE CELDA_id = ? AND VEHICULO_id = ?', [this._celdaId, this._vehiculoId]);
            await this._db.close();

            return {
                success: true,
                affectedRows: result.results.affectedRows,
                message: 'Registro de Historial de Parqueo eliminado exitosamente'
            };
        } catch (error) {
            await this._db.close();
            throw new Error(`Error eliminando registro de historial de parqueo: ${error.message}`);
        }
    }

    static async obtenerPorIds(celdaId, vehiculoId) {
        const db = new DatabaseConnection();
        try {
            const result = await db.executeQuery('SELECT * FROM HISTORIAL_PARQUEO WHERE CELDA_id = ? AND VEHICULO_id = ?', [celdaId, vehiculoId]);
            await db.close();

            if (result.results.length === 0) {
                return null;
            }

            const historialParqueoData = result.results[0];
            return new HistorialParqueo(
                historialParqueoData.CELDA_id,
                historialParqueoData.VEHICULO_id,
                historialParqueoData.fecha_hora
            );
        } catch (error) {
            await db.close();
            throw new Error(`Error obteniendo registro de historial de parqueo por IDs: ${error.message}`);
        }
    }

    static async obtenerTodos() {
        const db = new DatabaseConnection();
        try {
            const result = await db.executeQuery('SELECT * FROM HISTORIAL_PARQUEO');
            await db.close();

            return result.results.map(historialParqueoData =>
                new HistorialParqueo(
                    historialParqueoData.CELDA_id,
                    historialParqueoData.VEHICULO_id,
                    historialParqueoData.fecha_hora
                )
            );
        } catch (error) {
            await db.close();
            throw new Error(`Error obteniendo todos los registros de historial de parqueo: ${error.message}`);
        }
    }

    static async obtenerPorCeldaId(celdaId) {
        const db = new DatabaseConnection();
        try {
            const result = await db.executeQuery('SELECT * FROM HISTORIAL_PARQUEO WHERE CELDA_id = ?', [celdaId]);
            await db.close();

            return result.results.map(historialParqueoData =>
                new HistorialParqueo(
                    historialParqueoData.CELDA_id,
                    historialParqueoData.VEHICULO_id,
                    historialParqueoData.fecha_hora
                )
            );
        } catch (error) {
            await db.close();
            throw new Error(`Error obteniendo registros de historial de parqueo por ID de Celda: ${error.message}`);
        }
    }

    static async obtenerPorVehiculoId(vehiculoId) {
        const db = new DatabaseConnection();
        try {
            const result = await db.executeQuery('SELECT * FROM HISTORIAL_PARQUEO WHERE VEHICULO_id = ?', [vehiculoId]);
            await db.close();

            return result.results.map(historialParqueoData =>
                new HistorialParqueo(
                    historialParqueoData.CELDA_id,
                    historialParqueoData.VEHICULO_id,
                    historialParqueoData.fecha_hora
                )
            );
        } catch (error) {
            await db.close();
            throw new Error(`Error obteniendo registros de historial de parqueo por ID de Vehículo: ${error.message}`);
        }
    }

    static mostrarResultados(historiales, titulo = 'RESULTADOS DE HISTORIAL DE PARQUEO') {
        console.log(`\n=== ${titulo} ===`);
        console.log('Número de registros encontrados:', historiales.length);
        console.log('\nDatos:');

        historiales.forEach((historial, index) => {
            console.log(`\nRegistro ${index + 1}:`);
            console.log(historial.toString());
        });
    }

    async cargarDesdeBD() {
        try {
            if (this._celdaId === null || this._vehiculoId === null) {
                throw new Error('No se puede cargar un registro de historial de parqueo sin ID de Celda y ID de Vehículo.');
            }

            const result = await this._db.executeQuery('SELECT * FROM HISTORIAL_PARQUEO WHERE CELDA_id = ? AND VEHICULO_id = ?', [this._celdaId, this._vehiculoId]);
            await this._db.close();

            if (result.results.length === 0) {
                throw new Error('Registro de Historial de Parqueo no encontrado en la base de datos');
            }

            const historialParqueoData = result.results[0];
            this._fechaHora = historialParqueoData.fecha_hora;

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

module.exports = HistorialParqueo;