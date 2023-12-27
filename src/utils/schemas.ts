import Joi from 'joi';

export const createFoodItemSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  quantity: Joi.number().required(),
  expiry_date: Joi.date().iso().greater('now').required(),
  dietary_restrictions: Joi.string(),
  image_url: Joi.string().required(),
});
