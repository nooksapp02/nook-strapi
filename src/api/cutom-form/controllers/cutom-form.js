'use strict';

/**
 * cutom-form controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::cutom-form.cutom-form',
    ({ strapi }) => ({
        async find(ctx) {
            const result = await strapi.entityService.findMany('api::cutom-form.cutom-form', {
                fields: ['title', 'subtitle', 'maxSelection'],
                populate: ['options'],
                filters: {
                    publishedAt: {
                        $notNull: true,
                    }
                }
            });
            const sanitizedResults = await this.sanitizeOutput(result, ctx);
            ctx.send(sanitizedResults);
        }
    }));
