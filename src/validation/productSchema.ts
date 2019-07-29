import joi from 'joi';

export const productSchema = joi.object().keys({
  id: joi.string().length(36).required(),
  name: joi.string().required(),
  categoryId: joi.string().required(),
  itemsInStock: joi.number().required()
});
