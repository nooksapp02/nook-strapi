'use strict';

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async callback(ctx) {
    console.log('hola desde ctx user !!!!!!!!', ctx);
    // Obtén los datos del usuario desde el proveedor OAuth
    const userData = await strapi.plugins['users-permissions'].services.providers.callback(ctx);

    // Puedes personalizar este código para adaptarlo a tus necesidades específicas
    const user = await strapi.plugins['users-permissions'].services.user.add({
      username: userData.email,
      email: userData.email,
      provider: userData.provider,
      confirmed: true, // Puedes ajustar esto según tus requisitos
    });

    // Devuelve la información del usuario
    return sanitizeEntity(user, { model: strapi.models.user });
  },
};