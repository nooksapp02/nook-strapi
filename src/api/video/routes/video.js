'use strict';

/**
 * video router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::video.video', {
    config: {
        findOne: {
            middlewares: ['api::product.is-owner']
        }
    }
});
