'use strict';

/**
 * event router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::event.event', {
    config: {
        findOne: {
            middlewares: ['api::product.is-owner']
        }
    }
});