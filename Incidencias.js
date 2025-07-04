const DatabaseConnection = require('./DatabaseConnection');

class Incidencia {
    constructor(id = null, nombre = '') {
        this._id = id;
        this._nombre = nombre;
        this._db = new DatabaseConnection();
    }

    // Getters
    get id() {
        return this._id;
    }

    get nombre() {
        return this._nombre;
    }

    // Setters
    set id(id) {
        this._id = id;
    }

    set nombre(nombre) {
        this._nombre = nombre;
    }

    toString() {
        return `Incidencia [ID: ${this._id}, Nombre: ${this._nombre}]`;
    }

    // ================== MÉTODOS DE BASE DE DATOS ==================

    async guardar() {
        try {
            const sql = 'INSERT INTO INCIDENCIA (nombre) VALUES (?)';
            const params = [this._nombre];

            const result = await this._db.executeQuery(sql, params);

            this._id = result.results.insertId;

            await this._db.close();

            return {
                success: true,
                insertId: this._id,
                message: 'Incidencia guardada exitosamente'
            };
        } catch (error) {
            await this._db.close();
            throw new Error(`Error guardando incidencia: ${error.message}`);
        }
    }

    async actualizar() {
        try {
            if (!this._id) {
                throw new Error('No se puede actualizar una incidencia sin ID');
            }

            const sql = 'UPDATE INCIDENCIA SET nombre = ? WHERE id = ?';
            const params = [this._nombre, this._id];

            const result = await this._db.executeQuery(sql, params);
            await this._db.close();

            return {
                success: true,
                affectedRows: result.results.affectedRows,
                message: 'Incidencia actualizada exitosamente'
            };
        } catch (error) {
            await this._db.close();
            throw new Error(`Error actualizando incidencia: ${error.message}`);
        }
    }

    async eliminar() {
        try {
            if (!this._id) {
                throw new Error('No se puede eliminar una incidencia sin ID');
            }

            const result = await this._db.executeQuery('DELETE FROM INCIDENCIA WHERE id = ?', [this._id]);
            await this._db.close();

            return {
                success: true,
                affectedRows: result.results.affectedRows,
                message: 'Incidencia eliminada exitosamente'
            };
        } catch (error) {
            await this._db.close();
            throw new Error(`Error eliminando incidencia: ${error.message}`);
        }
    }

    static async obtenerPorId(id) {
        const db = new DatabaseConnection();
        try {
            const result = await db.executeQuery('SELECT * FROM INCIDENCIA WHERE id = ?', [id]);
            await db.close();

            if (result.results.length === 0) {
                return null;
            }

            const incidenciaData = result.results[0];
            return new Incidencia(
                incidenciaData.id,
                incidenciaData.nombre
            );
        } catch (error) {
            await db.close();
            throw new Error(`Error obteniendo incidencia por ID: ${error.message}`);
        }
    }

    static async obtenerTodas() {
        const db = new DatabaseConnection();
        try {
            const result = await db.executeQuery('SELECT * FROM INCIDENCIA');
            await db.close();

            return result.results.map(incidenciaData =>
                new Incidencia(
                    incidenciaData.id,
                    incidenciaData.nombre
                )
            );
        } catch (error) {
            await db.close();
            throw new Error(`Error obteniendo todas las incidencias: ${error.message}`);
        }
    }

    static async buscarPorNombre(nombre) {
        const db = new DatabaseConnection();
        try {
            const sql = 'SELECT * FROM INCIDENCIA WHERE nombre LIKE ?';
            const params = [`%${nombre}%`];

            const result = await db.executeQuery(sql, params);
            await db.close();

            return result.results.map(incidenciaData =>
                new Incidencia(
                    incidenciaData.id,
                    incidenciaData.nombre
                )
            );
        } catch (error) {
            await db.close();
            throw new Error(`Error buscando incidencias por nombre: ${error.message}`);
        }
    }

    static mostrarResultados(incidencias, titulo = 'RESULTADOS DE INCIDENCIAS') {
        console.log(`\n=== ${titulo} ===`);
        console.log('Número de incidencias encontradas:', incidencias.length);
        console.log('\nDatos:');

        incidencias.forEach((incidencia, index) => {
            console.log(`\nIncidencia ${index + 1}:`);
            console.log(incidencia.toString());
        });
    }

    async cargarDesdeBD() {
        try {
            if (!this._id) {
                throw new Error('No se puede cargar una incidencia sin ID');
            }

            const result = await this._db.executeQuery('SELECT * FROM INCIDENCIA WHERE id = ?', [this._id]);
            await this._db.close();

            if (result.results.length === 0) {
                throw new Error('Incidencia no encontrada en la base de datos');
            }

            const incidenciaData = result.results[0];
            this._nombre = incidenciaData.nombre;

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

module.exports = Incidencia;