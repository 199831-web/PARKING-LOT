const DatabaseConnection = require('./DatabaseConnection');

class ReporteIncidencia {
    constructor(vehiculoId = null, incidenciaId = null, fechaHora = null) {
        this._vehiculoId = vehiculoId;
        this._incidenciaId = incidenciaId;
        this._fechaHora = fechaHora;
        this._db = new DatabaseConnection();
    }

    get vehiculoId() {
        return this._vehiculoId;
    }

    get incidenciaId() {
        return this._incidenciaId;
    }

    get fechaHora() {
        return this._fechaHora;
    }

    set vehiculoId(vehiculoId) {
        this._vehiculoId = vehiculoId;
    }

    set incidenciaId(incidenciaId) {
        this._incidenciaId = incidenciaId;
    }

    set fechaHora(fechaHora) {
        this._fechaHora = fechaHora;
    }

    toString() {
        return `ReporteIncidencia [ID Vehículo: ${this._vehiculoId}, ID Incidencia: ${this._incidenciaId}, Fecha/Hora: ${this._fechaHora}]`;
    }

    async guardar() {
        try {
            if (this._vehiculoId === null || this._incidenciaId === null) {
                throw new Error('No se puede guardar un reporte de incidencia sin ID de Vehículo y ID de Incidencia.');
            }
            const sql = 'INSERT INTO REPORTE_INCIDENCIA (VEHICULO_id, INCIDENCIA_id, fecha_hora) VALUES (?, ?, ?)';
            const params = [this._vehiculoId, this._incidenciaId, this._fechaHora];

            const result = await this._db.executeQuery(sql, params);
            await this._db.close();

            return {
                success: true,
                message: 'Reporte de Incidencia guardado exitosamente'
            };
        } catch (error) {
            await this._db.close();
            throw new Error(`Error guardando reporte de incidencia: ${error.message}`);
        }
    }

    async actualizar() {
        try {
            if (this._vehiculoId === null || this._incidenciaId === null) {
                throw new Error('No se puede actualizar un reporte de incidencia sin ID de Vehículo y ID de Incidencia.');
            }

            const sql = 'UPDATE REPORTE_INCIDENCIA SET fecha_hora = ? WHERE VEHICULO_id = ? AND INCIDENCIA_id = ?';
            const params = [this._fechaHora, this._vehiculoId, this._incidenciaId];

            const result = await this._db.executeQuery(sql, params);
            await this._db.close();

            return {
                success: true,
                affectedRows: result.results.affectedRows,
                message: 'Reporte de Incidencia actualizado exitosamente'
            };
        } catch (error) {
            await this._db.close();
            throw new Error(`Error actualizando reporte de incidencia: ${error.message}`);
        }
    }

    async eliminar() {
        try {
            if (this._vehiculoId === null || this._incidenciaId === null) {
                throw new Error('No se puede eliminar un reporte de incidencia sin ID de Vehículo y ID de Incidencia.');
            }

            const result = await this._db.executeQuery('DELETE FROM REPORTE_INCIDENCIA WHERE VEHICULO_id = ? AND INCIDENCIA_id = ?', [this._vehiculoId, this._incidenciaId]);
            await this._db.close();

            return {
                success: true,
                affectedRows: result.results.affectedRows,
                message: 'Reporte de Incidencia eliminado exitosamente'
            };
        } catch (error) {
            await this._db.close();
            throw new Error(`Error eliminando reporte de incidencia: ${error.message}`);
        }
    }

    static async obtenerPorIds(vehiculoId, incidenciaId) {
        const db = new DatabaseConnection();
        try {
            const result = await db.executeQuery('SELECT * FROM REPORTE_INCIDENCIA WHERE VEHICULO_id = ? AND INCIDENCIA_id = ?', [vehiculoId, incidenciaId]);
            await db.close();

            if (result.results.length === 0) {
                return null;
            }

            const reporteIncidenciaData = result.results[0];
            return new ReporteIncidencia(
                reporteIncidenciaData.VEHICULO_id,
                reporteIncidenciaData.INCIDENCIA_id,
                reporteIncidenciaData.fecha_hora
            );
        } catch (error) {
            await db.close();
            throw new Error(`Error obteniendo reporte de incidencia por IDs: ${error.message}`);
        }
    }

    static async obtenerTodos() {
        const db = new DatabaseConnection();
        try {
            const result = await db.executeQuery('SELECT * FROM REPORTE_INCIDENCIA');
            await db.close();

            return result.results.map(reporteIncidenciaData =>
                new ReporteIncidencia(
                    reporteIncidenciaData.VEHICULO_id,
                    reporteIncidenciaData.INCIDENCIA_id,
                    reporteIncidenciaData.fecha_hora
                )
            );
        } catch (error) {
            await db.close();
            throw new Error(`Error obteniendo todos los reportes de incidencia: ${error.message}`);
        }
    }

    static async obtenerPorVehiculoId(vehiculoId) {
        const db = new DatabaseConnection();
        try {
            const result = await db.executeQuery('SELECT * FROM REPORTE_INCIDENCIA WHERE VEHICULO_id = ?', [vehiculoId]);
            await db.close();

            return result.results.map(reporteIncidenciaData =>
                new ReporteIncidencia(
                    reporteIncidenciaData.VEHICULO_id,
                    reporteIncidenciaData.INCIDENCIA_id,
                    reporteIncidenciaData.fecha_hora
                )
            );
        } catch (error) {
            await db.close();
            throw new Error(`Error obteniendo reportes de incidencia por ID de Vehículo: ${error.message}`);
        }
    }

    static async obtenerPorIncidenciaId(incidenciaId) {
        const db = new DatabaseConnection();
        try {
            const result = await db.executeQuery('SELECT * FROM REPORTE_INCIDENCIA WHERE INCIDENCIA_id = ?', [incidenciaId]);
            await db.close();

            return result.results.map(reporteIncidenciaData =>
                new ReporteIncidencia(
                    reporteIncidenciaData.VEHICULO_id,
                    reporteIncidenciaData.INCIDENCIA_id,
                    reporteIncidenciaData.fecha_hora
                )
            );
        } catch (error) {
            await db.close();
            throw new Error(`Error obteniendo reportes de incidencia por ID de Incidencia: ${error.message}`);
        }
    }

    static mostrarResultados(reportes, titulo = 'RESULTADOS DE REPORTES DE INCIDENCIA') {
        console.log(`\n=== ${titulo} ===`);
        console.log('Número de reportes encontrados:', reportes.length);
        console.log('\nDatos:');

        reportes.forEach((reporte, index) => {
            console.log(`\nReporte ${index + 1}:`);
            console.log(reporte.toString());
        });
    }

    async cargarDesdeBD() {
        try {
            if (this._vehiculoId === null || this._incidenciaId === null) {
                throw new Error('No se puede cargar un reporte de incidencia sin ID de Vehículo y ID de Incidencia.');
            }

            const result = await this._db.executeQuery('SELECT * FROM REPORTE_INCIDENCIA WHERE VEHICULO_id = ? AND INCIDENCIA_id = ?', [this._vehiculoId, this._incidenciaId]);
            await this._db.close();

            if (result.results.length === 0) {
                throw new Error('Reporte de Incidencia no encontrado en la base de datos');
            }

            const reporteIncidenciaData = result.results[0];
            this._fechaHora = reporteIncidenciaData.fecha_hora;

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

module.exports = ReporteIncidencia;