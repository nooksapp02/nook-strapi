'use strict';

/**
 * training-type controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::training-type.training-type',
({ strapi }) => ({
    async find(ctx) {
        const result = await strapi.entityService.findMany('api::training-type.training-type', { fields: ['id', 'label'] });
        const sanitizedResults = await this.sanitizeOutput(result, ctx);
        ctx.send(sanitizedResults);
    },
}));
