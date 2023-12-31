'use strict';

/**
 * publicity router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::publicity.publicity', {
    config: {
        findOne: {
            middlewares: ['api::product.is-owner']
        },
        find: {
            middlewares: ['api::product.is-owner']
        }
    }
});
