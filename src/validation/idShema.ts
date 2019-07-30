import joi from 'joi';

export const idSchema = joi.number().min(0);
