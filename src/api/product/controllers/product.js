'use strict';

/**
 * product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { NotFoundError } = require('@strapi/utils').errors;

module.exports = createCoreController('api::product.product', ({ strapi }) => ({
    async find(ctx) {
        const start = ctx.request.query?.start || 0;
        const limit = ctx.request.query?.limit || 10;
        const type = ctx.request.query?.type || '*';
        const category = ctx.request.query?.category || '*';
        const profileId = ctx.request.query?.profileId || null;

        const filterByTag = type === '*' ? {} : {
            filterTag: {
                tag: {
                    $contains: type.toLocaleLowerCase(),
                },
            },
        };

        const filterByProfile = profileId ? {
            profiles: {
                id: {
                    $contains: profileId,
                },
            },
        } : {};

        const filterByCategory = category === '*'  ? {} : {
            categories: {
                name: {
                    $contains: category.toLocaleLowerCase(),
                },
            },
        };

        const result = await strapi.entityService.findMany('api::product.product', {
            start, limit, fields: ['id', 'createdAt', 'publishedAt', 'title', 'description', 'visibility', 'onlyList'], filters: {
                publishedAt: {
                    $notNull: true,
                },
                ...filterByTag,
                ...filterByProfile,
                ...filterByCategory
            }

        });

        result.map(product => product.canView = strapi.service('api::product.visibility').canView(ctx, product) ? true : false)

        const sanitizedResults = await this.sanitizeOutput(result, ctx);
        ctx.send(sanitizedResults);
    },
    async findOne(ctx) {
        const productId = ctx.params.id;
        const result = await strapi.entityService.findOne('api::product.product', productId, {
            fields: ['id', 'createdAt', 'publishedAt', 'title', 'description', 'visibility', 'onlyList', 'metadata'],
            populate: {
                tumbnail: true,
                metadata: true,
                amount: true,
                videos: {
                    fields: ['*'],
                    populate: ['*']
                },
                blogs: {
                    fields: ['*'],
                    populate: ['preview', 'content']
                },
            }
        });

        if (!result?.publishedAt) throw new NotFoundError('No data');

        const isVisible = strapi.service('api::product.visibility').canView(ctx, result);

        const { title, description, metadata, filterTag, tumbnail, amount, blogs, videos, createdAt } = result;

        let response = {
            id: result.id,
            type: 'PREVIEW',
            mediaCotent: {
                blogs: setContent(blogs, isVisible),
                videos: setContent(videos, isVisible),
            },
            title, description, metadata, tumbnail, filterTag, createdAt
        };

        if (isVisible) {
            response = {
                ...response, type: 'CONTENT'
            }
        }

        else if (!isVisible) {
            response.type = 'PREVIEW';
            response.amount = amount;
        }

        const sanitizedResults = await this.sanitizeOutput(response, ctx);
        ctx.send(sanitizedResults);
    },
    async addProfile(ctx) {
        const productId = ctx.params.id;
        const profileId = ctx.request.query?.profileId

        await strapi.entityService.update('api::product.product', productId, {
            data: {
                profiles: {
                    connect: [profileId]
                }
            }
        });

        const sanitizedResults = await this.sanitizeOutput({status: 'ok'}, ctx);
        ctx.send(sanitizedResults);
    }
}));

function setContent(mediaArray, isVisible) {
    return mediaArray.map(media => ({ id: media.id, content: isVisible ? media?.content?.content : media?.preview?.content }));
}
