'use strict';

/**
 * objective controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::objective.objective',
    ({ strapi }) => ({
        async find(ctx) {
            const result = await strapi.entityService.findMany('api::objective.objective', { fields: ['id', 'label'] });
            const sanitizedResults = await this.sanitizeOutput(result, ctx);
            ctx.send(sanitizedResults);
        },
    }));

