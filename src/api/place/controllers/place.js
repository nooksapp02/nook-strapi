'use strict';

/**
 * place controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::place.place',
    ({ strapi }) => ({
        async findOne(ctx) {
            const placeId = ctx.params.id;
            const result = await strapi.entityService.findOne('api::place.place', placeId, {
                fields: ['id', 'name'], populate: {
                    images: true,
                    review: true,
                    comments: true,
                    location: true
                }
            });

            result.review = strapi.service('api::product.review-rating').calculateRanting(result.review);

            const sanitizedResults = await this.sanitizeOutput(result, ctx);
            ctx.send(sanitizedResults);
        },

        async findNearby(ctx) {
            const { latitude, longitude } = ctx.request.body;
            const result = await strapi.entityService.findMany('api::place.place', {
                fields: ['id', 'name'],
                filters: {
                    location: {
                        $and: [
                            {
                                latitude: {
                                    $between: [latitude.min, latitude.max],
                                }
                            },
                            {
                                longitude: {
                                    $between: [longitude.min, longitude.max],
                                }
                            }
                        ]
                    }
                },
                populate: {
                    location: {
                        fields: ['latitude', 'longitude', 'label']
                    },
                    review: true,
                    comments: true
                },
            });

            result.map(r => {
                r.review = strapi.service('api::product.review-rating').calculateRanting(r.review);
                r.comments = { total: r.comments.length }
            })
            const sanitizedResults = await this.sanitizeOutput(result, ctx);
            ctx.send(sanitizedResults);
        }
    }));
