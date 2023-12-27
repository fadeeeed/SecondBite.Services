import Joi from 'joi';

export const createFoodItemSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  quantity: Joi.number().required(),
  expiry_date: Joi.date().iso().greater('now').required(),
  dietary_restrictions: Joi.string(),
  image_url: Joi.string().required(),
});

export const updateFoodItemSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  quantity: Joi.number(),
  expiry_date: Joi.date().iso().greater('now'),
  dietary_restrictions: Joi.string(),
  image_url: Joi.string(),
});

export const requestDonationSchema = Joi.object({
  food_item_id: Joi.number().required(),
  quantity: Joi.number().required(),
});
