const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { 
  validateCreateMovie, 
  validateUpdateMovie, 
  validateQuery 
} = require('../middleware/validation');

router.get('/movies', validateQuery, movieController.getAllMovies);
router.get('/movie/:id', movieController.getMovieById);
router.post('/movie', validateCreateMovie, movieController.createMovie);
router.patch('/movie/:id', validateUpdateMovie, movieController.updateMovie);
router.delete('/movie/:id', movieController.deleteMovie);

module.exports = router;
