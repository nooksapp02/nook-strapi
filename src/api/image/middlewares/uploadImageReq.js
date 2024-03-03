"use strict";
const { ValidationError } = require('@strapi/utils').errors;

module.exports = (config, { strapi }) => {

  return async (ctx, next) => {
    const requiredFields = [ 'images', 'prefix', 'extension', 'type'];
    const missingFields = requiredFields.filter(field => !ctx.request.body.hasOwnProperty(field));

    if (missingFields.length > 0) {
      throw new ValidationError(`Faltan campos requeridos: ${missingFields.join(', ')}`);
    }

    await next();
  }
};