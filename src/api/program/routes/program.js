'use strict';

/**
 * program router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::program.program', {
    config: {
        findOne: {
            middlewares: ['api::product.is-owner']
        }
    }
});
