'use strict';

/**
 * product router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::product.product', {
    config: {
        findOne: {
            middlewares: ['api::product.is-owner']
        },
        find: {
            middlewares: ['api::product.opcional-is-owner']
        }
    }
});
