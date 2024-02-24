'use strict';

/**
 * auth controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::auth.auth', ({ strapi, env }) => ({
  async callback(ctx) {
    try {
      await strapi.controller('plugin::users-permissions.auth').callback(ctx);
      const providerResp = ctx.body;
      ctx.redirect(`${process.env.APP_URL}?status=true&jwt=${providerResp.jwt}&provider=${ctx.params.provider}`);
    } catch (err) {
      ctx.redirect(`${process.env.APP_URL}?status=false`);
    }
  },
}));

