'use strict';

module.exports = ({ strapi }) => ({
    async get(ctx, api) {
        const start = ctx.request.query?.start || 0;
        const limit = ctx.request.query?.limit || 10;
        const fields = Array.isArray(ctx?.fields) ? ctx.fields : [];
        const populate = ctx?.populate ? ctx.populate : {};
        const productFields = Array.isArray(ctx?.product?.fields) ? ctx.product.fields : [];
        const productPopulate = Array.isArray(ctx?.product?.populate) ? ctx.product.populate : [];

        const result = await strapi.entityService.findMany(api, {
            start, limit, fields: ['id'].concat(fields), populate: {
                ...populate,
                product: {
                    fields: ['title', 'description', 'metaData'].concat(productFields),
                    populate: ['tumbnail', 'amount', 'filterTag'].concat(productPopulate)
                }
            },
            filters: {
                $and: [
                    {
                        publishedAt: {
                            $notNull: true,
                        }
                    },
                    ctx.filter ? ctx.filter : {}
                ]
            }
        });

        return result;
    }
})