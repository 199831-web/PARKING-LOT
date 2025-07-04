
const DatabaseConnection = require('./DatabaseConnection');

class Celda {
    constructor(id = null, tipo = '', estado = '') {
        this._id = id;
        this._tipo = tipo;
        this._estado = estado;
    }

    get id() { return this._id; }
    get tipo() { return this._tipo; }
    get estado() { return this._estado; }

    set id(id) { this._id = id; }
    set tipo(tipo) { this._tipo = tipo; }
    set estado(estado) { this._estado = estado; }

    toString() {
        return `Celda [ID: ${this._id}, Tipo: ${this._tipo}, Estado: ${this._estado}]`;
    }

    async guardar() {
        const db = new DatabaseConnection();
        try {
            const sql = 'INSERT INTO CELDA (tipo, estado) VALUES (?, ?)';
            const params = [this._tipo, this._estado];
            const result = await db.executeQuery(sql, params);
            this._id = result?.results?.insertId || null;
            await db.close();
            return {
                success: true,
                insertId: this._id,
                message: 'Celda guardada exitosamente'
            };
        } catch (error) {
            await db.close();
            throw new Error(`Error guardando celda: ${error.message}`);
        }
    }

    async actualizar() {
        const db = new DatabaseConnection();
        try {
            if (!this._id) throw new Error('No se puede actualizar una celda sin ID');
            const sql = 'UPDATE CELDA SET tipo = ?, estado = ? WHERE id = ?';
            const params = [this._tipo, this._estado, this._id];
            const result = await db.executeQuery(sql, params);
            await db.close();
            return {
                success: true,
                affectedRows: result?.results?.affectedRows || 0,
                message: 'Celda actualizada exitosamente'
            };
        } catch (error) {
            await db.close();
            throw new Error(`Error actualizando celda: ${error.message}`);
        }
    }

    async eliminar() {
        const db = new DatabaseConnection();
        try {
            if (!this._id) throw new Error('No se puede eliminar una celda sin ID');
            const result = await db.executeQuery('DELETE FROM CELDA WHERE id = ?', [this._id]);
            await db.close();
            return {
                success: true,
                affectedRows: result?.results?.affectedRows || 0,
                message: 'Celda eliminada exitosamente'
            };
        } catch (error) {
            await db.close();
            throw new Error(`Error eliminando celda: ${error.message}`);
        }
    }

    static async obtenerPorId(id) {
        const db = new DatabaseConnection();
        try {
            const result = await db.executeQuery('SELECT * FROM CELDA WHERE id = ?', [id]);
            await db.close();
            if (!result.results || result.results.length === 0) return null;
            const celdaData = result.results[0];
            return new Celda(celdaData.id, celdaData.tipo, celdaData.estado);
        } catch (error) {
            await db.close();
            throw new Error(`Error obteniendo celda por ID: ${error.message}`);
        }
    }

    static async obtenerTodas() {
        const db = new DatabaseConnection();
        try {
            const result = await db.executeQuery('SELECT * FROM CELDA');
            await db.close();
            return result?.results?.map(celdaData => new Celda(celdaData.id, celdaData.tipo, celdaData.estado)) || [];
        } catch (error) {
            await db.close();
            throw new Error(`Error obteniendo todas las celdas: ${error.message}`);
        }
    }

    static async buscarPorTipoOEstado(query) {
        const db = new DatabaseConnection();
        try {
            const sql = 'SELECT * FROM CELDA WHERE tipo LIKE ? OR estado LIKE ?';
            const params = [`%${query}%`, `%${query}%`];
            const result = await db.executeQuery(sql, params);
            await db.close();
            return result?.results?.map(celdaData => new Celda(celdaData.id, celdaData.tipo, celdaData.estado)) || [];
        } catch (error) {
            await db.close();
            throw new Error(`Error buscando celdas por tipo o estado: ${error.message}`);
        }
    }

    static mostrarResultados(celdas, titulo = 'RESULTADOS DE CELDAS') {
        console.log(`\n=== ${titulo} ===`);
        console.log('Número de celdas encontradas:', celdas.length);
        console.log('\nDatos:');
        celdas.forEach((celda, index) => {
            console.log(`\nCelda ${index + 1}:`);
            console.log(celda.toString());
        });
    }

    async cargarDesdeBD() {
        const db = new DatabaseConnection();
        try {
            if (!this._id) throw new Error('No se puede cargar una celda sin ID');
            const result = await db.executeQuery('SELECT * FROM CELDA WHERE id = ?', [this._id]);
            await db.close();
            if (!result.results || result.results.length === 0) throw new Error('Celda no encontrada en la base de datos');
            const celdaData = result.results[0];
            this._tipo = celdaData.tipo;
            this._estado = celdaData.estado;
            return { success: true, message: 'Datos cargados exitosamente' };
        } catch (error) {
            await db.close();
            throw new Error(`Error cargando datos: ${error.message}`);
        }
    }
}

module.exports = Celda;
