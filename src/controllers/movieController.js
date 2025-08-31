const movieService = require('../services/movieService');

class MovieController {
  async getAllMovies(req, res) {
    try {
      const queryParams = req.validatedQuery || {};
      const result = await movieService.findAllMovies(queryParams);
      
      res.status(200).json({
        status: true,
        message: 'Movies retrieved successfully',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error in getAllMovies:', error);
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getMovieById(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id) || parseInt(id) <= 0) {
        return res.status(400).json({
          status: false,
          message: 'ID harus berupa angka positif'
        });
      }
      
      const movie = await movieService.findMovieById(parseInt(id));
      
      if (!movie) {
        return res.status(404).json({
          status: false,
          message: 'Movie tidak ditemukan'
        });
      }
      
      res.status(200).json({
        status: true,
        message: 'Movie retrieved successfully',
        data: movie
      });
    } catch (error) {
      console.error('Error in getMovieById:', error);
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async createMovie(req, res) {
    try {
      const movieData = req.validatedBody;
      const newMovie = await movieService.createMovie(movieData);
      
      res.status(201).json({
        status: true,
        message: 'Movie created successfully',
        data: newMovie
      });
    } catch (error) {
      console.error('Error in createMovie:', error);
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async updateMovie(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.validatedBody;
      if (isNaN(id) || parseInt(id) <= 0) {
        return res.status(400).json({
          status: false,
          message: 'ID harus berupa angka positif'
        });
      }
      
      const updatedMovie = await movieService.updateMovie(parseInt(id), updateData);
      
      if (!updatedMovie) {
        return res.status(404).json({
          status: false,
          message: 'Movie tidak ditemukan'
        });
      }
      
      res.status(200).json({
        status: true,
        message: 'Movie updated successfully',
        data: updatedMovie
      });
    } catch (error) {
      console.error('Error in updateMovie:', error);
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async deleteMovie(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id) || parseInt(id) <= 0) {
        return res.status(400).json({
          status: false,
          message: 'ID harus berupa angka positif'
        });
      }
      
      const isDeleted = await movieService.deleteMovie(parseInt(id));
      
      if (!isDeleted) {
        return res.status(404).json({
          status: false,
          message: 'Movie tidak ditemukan'
        });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error in deleteMovie:', error);
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = new MovieController();
