// middlewares/validateRecipe.js
import Joi from 'joi';

// 1. Định nghĩa schema cho create (bắt buộc) và update (tùy chọn)
const recipeCreateSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().allow('').optional(),
  ingredients: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      text: Joi.string().required(),
      isHeader: Joi.boolean().required()
    })
  ).min(1).required(),
  directions: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      text: Joi.string().required(),
      isHeader: Joi.boolean().required()
    })
  ).min(1).required(),
  prepTime: Joi.object({
    time: Joi.number().integer().min(0).required(),
    unit: Joi.string().valid('mins', 'hours').required()
  }).required(),
  cookTime: Joi.object({
    time: Joi.number().integer().min(0).required(),
    unit: Joi.string().valid('mins', 'hours').required()
  }).required(),
  totalTime: Joi.number().integer().min(0).required(),
  additionalTimers: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      time: Joi.number().integer().min(0).required(),
      type: Joi.string().required(),
      unit: Joi.string().valid('mins', 'hours').required()
    })
  ).optional(),
  servings: Joi.string().allow('').optional(),
  categories: Joi.array().items(Joi.string()).min(1).required(),
  notes: Joi.array().items(Joi.string().min(1)).optional(),
  imageUrl: Joi.string().allow('').optional(),
  imagePublicId: Joi.string().allow('').optional(),
});

// 2. Tạo schema cho update: tất cả field đều optional
const recipeUpdateSchema = recipeCreateSchema.fork(
  Object.keys(recipeCreateSchema.describe().keys),
  schema => schema.optional()
);

// 3. Middleware factory
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

export const validateRecipeCreate = validateBody(recipeCreateSchema);
export const validateRecipeUpdate = validateBody(recipeUpdateSchema);