const { pool } = require('../configs/database');

class MovieService {
  async findAllMovies({ search = '', page = 1, limit = 10, sortBy = 'id', sortOrder = 'ASC' } = {}) {
    try {
      let whereClause = '';
      let params = [];
      
      if (search) {
        whereClause = 'WHERE title LIKE ? OR genre LIKE ?';
        params = [`%${search}%`, `%${search}%`];
      }
      const allowedSortColumns = ['id', 'title', 'year', 'genre', 'rating', 'created_at'];
      const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'id';
      const safeSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';
      const safePage = Math.max(1, parseInt(page) || 1);
      const safeLimit = Math.max(1, Math.min(100, parseInt(limit) || 10));
      const safeOffset = (safePage - 1) * safeLimit;
      
      const countQuery = `SELECT COUNT(*) as total FROM movies ${whereClause}`;
      const [countResult] = await pool.execute(countQuery, params);
      const total = countResult[0].total;      
      const query = `
        SELECT * FROM movies 
        ${whereClause}
        ORDER BY ${safeSortBy} ${safeSortOrder}
        LIMIT ${safeLimit} OFFSET ${safeOffset}
      `;
      
      console.log('Executing query:', query);
      console.log('Query parameters:', params);
      
      const [rows] = await pool.execute(query, params);
      return {
        data: rows,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          totalPages: Math.ceil(total / safeLimit)
        }
      };
    } catch (error) {
      console.error('Database error in findAllMovies:', error);
      throw new Error(`Error finding movies: ${error.message}`);
    }
  }

  async findMovieById(id) {
    try {
      const query = 'SELECT * FROM movies WHERE id = ?';
      const [rows] = await pool.execute(query, [id]);
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding movie by ID: ${error.message}`);
    }
  }

  async createMovie(payload) {
    try {
      const { title, year, genre, rating } = payload;
      
      const query = `
        INSERT INTO movies (title, year, genre, rating) 
        VALUES (?, ?, ?, ?)
      `;
      
      const [result] = await pool.execute(query, [title, year, genre, rating]);
      const createdMovie = await this.findMovieById(result.insertId);
      return createdMovie;
    } catch (error) {
      throw new Error(`Error creating movie: ${error.message}`);
    }
  }

  async updateMovie(id, payload) {
    try {
      const movie = await this.findMovieById(id);
      if (!movie) {
        return null;
      }
      const updateFields = [];
      const updateValues = [];
      
      if (payload.title !== undefined) {
        updateFields.push('title = ?');
        updateValues.push(payload.title);
      }
      
      if (payload.year !== undefined) {
        updateFields.push('year = ?');
        updateValues.push(payload.year);
      }
      
      if (payload.genre !== undefined) {
        updateFields.push('genre = ?');
        updateValues.push(payload.genre);
      }
      
      if (payload.rating !== undefined) {
        updateFields.push('rating = ?');
        updateValues.push(payload.rating);
      }
      if (updateFields.length === 0) {
        return movie;
      }
      
      const query = `
        UPDATE movies 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `;
      
      console.log('Executing update query:', query);
      console.log('Update parameters:', [...updateValues, id]);
      
      await pool.execute(query, [...updateValues, id]);
      const updatedMovie = await this.findMovieById(id);
      return updatedMovie;
    } catch (error) {
      console.error('Database error in updateMovie:', error);
      throw new Error(`Error updating movie: ${error.message}`);
    }
  }

  async deleteMovie(id) {
    try {
      const movie = await this.findMovieById(id);
      if (!movie) {
        return false;
      }
      const query = 'DELETE FROM movies WHERE id = ?';
      await pool.execute(query, [id]);
      return true;
    } catch (error) {
      throw new Error(`Error deleting movie: ${error.message}`);
    }
  }
}

module.exports = new MovieService();
