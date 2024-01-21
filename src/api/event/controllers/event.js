'use strict';

/**
 * event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const moment = require('moment');

module.exports = createCoreController('api::event.event',
    ({ strapi }) => ({
        async find(ctx) {
            const now = moment().format('YYYY-MM-DDTHH:mm.sss[Z]');
            ctx.filter = {
                expiration: {
                    $gte: now
                }
            }
            ctx.populate = { reviews: true, comments: true }
            const result = await strapi.service('api::product.find-product').get(ctx, 'api::event.event');
            result.map(event => event.reviews = strapi.service('api::product.review-rating').calculateRanting(event.reviews));
            const sanitizedResults = await this.sanitizeOutput(result, ctx);
            ctx.send(sanitizedResults);
        },

        async findOne(ctx) {
            const idVideo = ctx.params.id;
            const result = await strapi.entityService.findOne('api::event.event', idVideo, {
                fields: ['id', 'publishedAt'],
                populate: {
                    location: true,
                    comments: true,
                    reviews: {
                        populate: ['comment']
                    },
                    product: {
                        fields: ['title', 'description', 'visibility', 'onlyList', 'metadata'],
                        populate: ['profiles', 'amount', 'filterTag', 'tumbnail']
                    }
                }
            });

            if (!result.publishedAt) throw new NotFoundError('No data');

            const { title, description, metadata, filterTag, tumbnail } = result.product;

            let response = {
                id: result.id,
                title, description, metadata, tumbnail, filterTag
            };

            response.comments = result.comments;
            response.reviews = strapi.service('api::product.review-rating').calculateRanting(result.reviews);
            response.location = result.location;

            const sanitizedResults = await this.sanitizeOutput(response, ctx);
            ctx.send(sanitizedResults);
        },
    }));