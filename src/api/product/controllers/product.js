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
                frecuency_day: {
                    $contains: profileId,
                },
            },
        } : {};

        const filterByCategory = category === '*' ? {} : {
            categories: {
                name: {
                    $contains: category.toLocaleLowerCase(),
                },
            },
        };

        const result = await strapi.entityService.findMany('api::product.product', {
            start, limit, fields: ['id', 'createdAt', 'publishedAt', 'title', 'description', 'visibility', 'onlyList'], populate: ['tumbnail'], filters: {
                publishedAt: {
                    $notNull: true,
                },
                ...filterByTag,
                ...filterByProfile,
                ...filterByCategory
            }
        });

        result.map(product => { 
            product.tumbnail = product?.tumbnail.formats.small.url,
            product.canView = strapi.service('api::product.visibility').canView(ctx, product) ? true : false;
        }
        )

        const sanitizedResults = await this.sanitizeOutput(result, ctx);
        ctx.send(sanitizedResults);
    },
    async findOne(ctx) {
        const profileId = ctx.request.query.profileId;
        const productId = ctx.params.id;
        const mediaPopulate = {
            fields: ['*'],
            populate: ['tumbnail'],
        }

        const result = await strapi.entityService.findOne('api::product.product', productId, {
            fields: ['id', 'createdAt', 'publishedAt', 'title', 'description', 'visibility', 'onlyList', 'metadata'],
            populate: {
                tumbnail: true,
                metadata: true,
                amount: true,
                categories: {
                    fields: ['name']
                },
                profiles: {
                    fields: ['id']
                },
                filterTag: {
                    fields: ['tag']
                },
                videos: {
                    fields: ['*'],
                    populate: {
                        preview: mediaPopulate,
                        content: mediaPopulate,
                    }
                },
                blogs: {
                    fields: ['*'],
                    populate: {
                        preview: mediaPopulate,
                        content: mediaPopulate,
                    }
                },
            }
        });

        if (!result?.publishedAt) throw new NotFoundError('No data');

        const isVisible = strapi.service('api::product.visibility').canView(ctx, result);

        const { title, description, metadata, filterTag, tumbnail, amount, blogs, videos, createdAt, categories, profiles } = result;

        let response = {
            id: result.id,
            type: 'PREVIEW',
            mediaCotent: {
                blogs: setContent(blogs, isVisible),
                videos: setContent(videos, isVisible),
            },
            category: categories[0]?.name,
            filterTag: filterTag[0]?.tag,
            suscribed: profiles.some(profile => profile.id === parseInt(profileId)),
            tumbnail: tumbnail?.url,
            title, description, metadata, createdAt
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

        const sanitizedResults = await this.sanitizeOutput({ status: 'ok' }, ctx);
        ctx.send(sanitizedResults);
    }
}));

function setContent(mediaArray, isVisible) {
    return mediaArray.map(media => {
        const content = isVisible ? media.content : media.preview;
        content.tumbnail = content?.tumbnail.formats.thumbnail.url;
        return { id: media.id, ...content}
    });
}
