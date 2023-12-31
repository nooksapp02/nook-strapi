'use strict';

/**
 * publicity controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { NotFoundError } = require('@strapi/utils').errors;
const moment = require('moment');

module.exports = createCoreController('api::publicity.publicity',
    ({ strapi }) => ({
        async find(ctx) {
            const type = ctx.request.query?.type ? {
                type: {
                    $eq: ctx.request.query?.type
                }
            } : {};
            const now = moment().format('YYYY-MM-DDTHH:mm.sss[Z]');
            ctx.filter = {
                expiration: {
                    $lte: now
                },
                ...type
            }
            ctx.product = { fields: ['visibility', 'onlyList'], populate: ['profiles'] };
            ctx.fields = ['link', 'expiration', 'type', 'label']

            const result = await strapi.service('api::product.find-product').get(ctx, 'api::publicity.publicity');
            const response = result.filter(pub => strapi.service('api::product.visibility').canView(ctx, pub.product));
            response.map(pub => {
                const { title, tumbnail } = pub.product;
                pub.product = { title, tumbnail };
            });

            const sanitizedResults = await this.sanitizeOutput(response, ctx);
            ctx.send(sanitizedResults);
        },

        async findOne(ctx) {
            const idPub = ctx.params.id;
            const result = await strapi.entityService.findOne('api::publicity.publicity', idPub, {
                fields: ['id', 'publishedAt', 'type', 'expiration', 'link'],
                populate: {
                    product: {
                        fields: ['title', 'description', 'visibility', 'onlyList', 'metadata'],
                        populate: ['profiles', 'amount', 'filterTag', 'tumbnail']
                    }
                }
            });

            if (!result.publishedAt) throw new NotFoundError('No data');

            const isVisible = strapi.service('api::product.visibility').canView(ctx, result.product);
            const { title, description, metadata, filterTag, ['tumbnail']: tumbnail } = result.product;
            const { link, expiration, type } = result;

            let response = {
                id: result.id,
                canUse: isVisible,
                title, description, metadata, tumbnail, filterTag,
                link, expiration, type
            };

            const sanitizedResults = await this.sanitizeOutput(response, ctx);
            ctx.send(sanitizedResults);
        },
    }
    )
);
