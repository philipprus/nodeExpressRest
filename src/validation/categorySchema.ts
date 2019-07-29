import joi from 'joi';

export const categorySchema = joi.object().keys({
  id: joi.string().length(36).required(),
  name: joi.string().required(),
});
