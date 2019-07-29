import joi from 'joi';

export const projectSchema = joi.object().keys({
  id: joi.string().length(36).required(),
  name: joi.string().required(),
});
