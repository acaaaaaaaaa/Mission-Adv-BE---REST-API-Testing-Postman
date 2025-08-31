CREATE DATABASE IF NOT EXISTS movie_db;
USE movie_db;

CREATE TABLE IF NOT EXISTS movies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  year INT,
  genre VARCHAR(100),
  rating DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO movies (title, year, genre, rating) VALUES
('Interstellar', 2014, 'Sci-Fi', 8.6),
('The Dark Knight', 2008, 'Action', 9.0),
('Inception', 2010, 'Sci-Fi', 8.8),
('Pulp Fiction', 1994, 'Crime', 8.9),
('Fight Club', 1999, 'Drama', 8.8);

DESCRIBE movies;

SELECT * FROM movies;
