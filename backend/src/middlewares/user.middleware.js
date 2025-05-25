// userUpdateValidator.js (ESM style)
import Joi from 'joi';

const userUpdateSchema = Joi.object({
  displayName: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).allow('').optional(),
  facebook: Joi.string().max(100).allow('').optional(),
  instagram: Joi.string().max(100).allow('').optional(),
  photoURL: Joi.string().allow('').optional(),
  photoPublicId: Joi.string().allow('').optional(),
}); 

function validateBody(schema) {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,    // trả về hết lỗi
        stripUnknown: true    // tự remove mọi field không trong schema
      });
  
      if (error) {
        return res.status(400).json({
          message: 'Validation error',
          details: error.details.map(d => d.message)
        });
      }
  
      req.body = value;  // gán lại body đã được Joi xử lý
      next();
    };
  }

export const validateUserUpdate = validateBody(userUpdateSchema);
