const Joi = require('joi');

const createMovieSchema = Joi.object({
  title: Joi.string().required().min(1).max(255).messages({
    'string.empty': 'Title tidak boleh kosong',
    'string.min': 'Title minimal 1 karakter',
    'string.max': 'Title maksimal 255 karakter',
    'any.required': 'Title wajib diisi'
  }),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).optional().messages({
    'number.base': 'Year harus berupa angka',
    'number.integer': 'Year harus berupa angka bulat',
    'number.min': 'Year minimal 1900',
    'number.max': `Year maksimal ${new Date().getFullYear() + 1}`
  }),
  genre: Joi.string().max(100).optional().messages({
    'string.max': 'Genre maksimal 100 karakter'
  }),
  rating: Joi.number().min(0).max(10).precision(1).optional().messages({
    'number.base': 'Rating harus berupa angka',
    'number.min': 'Rating minimal 0',
    'number.max': 'Rating maksimal 10',
    'number.precision': 'Rating maksimal 1 angka desimal'
  })
});

const updateMovieSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional().messages({
    'string.empty': 'Title tidak boleh kosong',
    'string.min': 'Title minimal 1 karakter',
    'string.max': 'Title maksimal 255 karakter'
  }),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).optional().messages({
    'number.base': 'Year harus berupa angka',
    'number.integer': 'Year harus berupa angka bulat',
    'number.min': 'Year minimal 1900',
    'number.max': `Year maksimal ${new Date().getFullYear() + 1}`
  }),
  genre: Joi.string().max(100).optional().messages({
    'string.max': 'Genre maksimal 100 karakter'
  }),
  rating: Joi.number().min(0).max(10).precision(1).optional().messages({
    'number.base': 'Rating harus berupa angka',
    'number.min': 'Rating minimal 0',
    'number.max': 'Rating maksimal 10',
    'number.precision': 'Rating maksimal 1 angka desimal'
  })
}).min(1).messages({
  'object.min': 'Minimal satu field harus diisi untuk update'
});

const querySchema = Joi.object({
  search: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page harus berupa angka',
    'number.integer': 'Page harus berupa angka bulat',
    'number.min': 'Page minimal 1'
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'Limit harus berupa angka',
    'number.integer': 'Limit harus berupa angka bulat',
    'number.min': 'Limit minimal 1',
    'number.max': 'Limit maksimal 100'
  }),
  sortBy: Joi.string().valid('id', 'title', 'year', 'genre', 'rating', 'created_at').default('id').messages({
    'any.only': 'SortBy hanya boleh: id, title, year, genre, rating, created_at'
  }),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC').messages({
    'any.only': 'SortOrder hanya boleh: ASC atau DESC'
  })
});

// User validation schemas
const registerSchema = Joi.object({
  username: Joi.string().required().min(3).max(30).pattern(/^[a-zA-Z0-9_]+$/).messages({
    'string.empty': 'Username tidak boleh kosong',
    'string.min': 'Username minimal 3 karakter',
    'string.max': 'Username maksimal 30 karakter',
    'string.pattern.base': 'Username hanya boleh mengandung huruf, angka, dan underscore',
    'any.required': 'Username wajib diisi'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email tidak boleh kosong',
    'string.email': 'Format email tidak valid',
    'any.required': 'Email wajib diisi'
  }),
  password: Joi.string().required().min(6).messages({
    'string.empty': 'Password tidak boleh kosong',
    'string.min': 'Password minimal 6 karakter',
    'any.required': 'Password wajib diisi'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email tidak boleh kosong',
    'string.email': 'Format email tidak valid',
    'any.required': 'Email wajib diisi'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password tidak boleh kosong',
    'any.required': 'Password wajib diisi'
  })
});

const validateCreateMovie = (req, res, next) => {
  const { error, value } = createMovieSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      status: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  req.validatedBody = value;
  next();
};

const validateUpdateMovie = (req, res, next) => {
  const { error, value } = updateMovieSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      status: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  req.validatedBody = value;
  next();
};

const validateQuery = (req, res, next) => {
  const { error, value } = querySchema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      status: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  req.validatedQuery = value;
  next();
};

const validateRegister = (req, res, next) => {
  const { error, value } = registerSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      status: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  req.validatedBody = value;
  next();
};

const validateLogin = (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      status: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  req.validatedBody = value;
  next();
};

module.exports = {
  validateCreateMovie,
  validateUpdateMovie,
  validateQuery,
  validateRegister,
  validateLogin
};
