const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { 
  validateCreateMovie, 
  validateUpdateMovie, 
  validateQuery 
} = require('../middleware/validation');
const { verifyToken } = require('../middleware/auth');


router.get('/movies', verifyToken, validateQuery, movieController.getAllMovies);
router.get('/movie/:id', verifyToken, movieController.getMovieById);
router.post('/movie', verifyToken, validateCreateMovie, movieController.createMovie);
router.patch('/movie/:id', verifyToken, validateUpdateMovie, movieController.updateMovie);
router.delete('/movie/:id', verifyToken, movieController.deleteMovie);

module.exports = router;
