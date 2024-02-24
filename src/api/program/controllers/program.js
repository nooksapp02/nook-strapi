'use strict';

/**
 * program controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::program.program',
    ({ strapi }) => ({
        async find(ctx) {
            const result = await strapi.service('api::product.find-product').get(ctx, 'api::program.program');
            const sanitizedResults = await this.sanitizeOutput(result, ctx);
            ctx.send(sanitizedResults);
        },

        async findOne(ctx) {
            const idProgram = ctx.params.id;
            const videoPopulate = {
                fields: ['id', 'link'], populate: ['tumbnail']
            };
            const blogPopulate = {
                fields: ['id', 'content'], populate: ['tumbnail']
            };
            const result = await strapi.entityService.findOne('api::program.program', idProgram, {
                fields: ['id', 'publishedAt', 'contentProgram'],
                populate: {
                    workouts: videoPopulate,
                    previewWorkouts: videoPopulate,
                    recipes: blogPopulate,
                    previewRecipes: blogPopulate,
                    product: {
                        fields: ['title', 'description', 'visibility', 'onlyList', 'metadata'],
                        populate: ['profiles', 'amount', 'filterTag', 'tumbnail']
                    }
                }
            });

            if (!result.publishedAt) throw new NotFoundError('No data');

            const isVisible = strapi.service('api::product.visibility').canView(ctx, result.product);

            const { title, description, metadata, filterTag, tumbnail, contentProgram } = result.product;

            let response = {
                id: result.id,
                type: isVisible ? 'CONTENT' : 'PREVIEW',
                title, description, metadata, tumbnail, filterTag, contentProgram,
                workouts: result.workouts,
                recipes: result.recipes
            };

            if (!isVisible && result.previewWorkouts) {
                response.workouts = result.previewWorkouts ? result.previewWorkouts : [];
            }

            if (!isVisible && result.previewRecipes) {
                response.recipes = result.previewRecipes ? result.previewRecipes : [];
            }

            const sanitizedResults = await this.sanitizeOutput(response, ctx);
            ctx.send(sanitizedResults);
        },
    }));

