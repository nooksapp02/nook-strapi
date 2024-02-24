'use strict';

/**
 * video controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { NotFoundError } = require('@strapi/utils').errors;

module.exports = createCoreController('api::video.video',
    ({ strapi }) => ({
        async find(ctx) {
            const result = await strapi.service('api::product.find-product').get(ctx, 'api::video.video');
            const sanitizedResults = await this.sanitizeOutput(result, ctx);
            ctx.send(sanitizedResults);
        },

        async findOne(ctx) {
            const idVideo = ctx.params.id;
            const result = await strapi.entityService.findOne('api::video.video', idVideo, {
                fields: ['id', 'publishedAt'],
                populate: {
                    preview: {
                        fields: ['link'],
                        populate: ['tumbnail']
                    },
                    content: {
                        fields: ['link'],
                        populate: ['tumbnail']
                    },
                    product: {
                        fields: ['title', 'description', 'visibility', 'onlyList', 'metadata'],
                        populate: ['profiles', 'amount', 'filterTag', 'tumbnail']
                    }
                }
            });

            if (!result.publishedAt) throw new NotFoundError('No data');

            const isVisible = strapi.service('api::product.visibility').canView(ctx, result.product);

            const { title, description, metadata, filterTag, tumbnail, amount } = result.product;

            let response = {
                id: result.id,
                type: 'PREVIEW',
                title, description, metadata, tumbnail, filterTag
            };

            if (isVisible) {
                const { link, ['tumbnail']: videoTumbnail } = result.content;
                response = {
                    ...response, videoTumbnail, link, type: 'CONTENT'
                }
            }

            if (result.preview && !isVisible) {
                const { link, ['tumbnail']: videoTumbnail } = result.preview;
                response = {
                    ...response, videoTumbnail, link
                }
            }
            else if (!isVisible) {
                response.type = 'NO_PREVIEW';
                response.amount = amount;
            }

            const sanitizedResults = await this.sanitizeOutput(response, ctx);
            ctx.send(sanitizedResults);
        },
    }));
