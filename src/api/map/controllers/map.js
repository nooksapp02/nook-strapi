'use strict';

/**
 * place controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { NotFoundError } = require('@strapi/utils').errors;

module.exports = createCoreController('api::map.map',
    ({ strapi }) => ({
        async findPlaces(ctx) {
            const { latitude, longitude, place } = ctx.request.body;
            const url = `${process.env.API_MAP_DOMAIN}/v5/mapbox.places/${place}.json?proximity=${longitude},${latitude}&access_token=${process.env.API_MAP_tOKEN}`
            try {
                const response = await fetch(url, { method: 'GET' });
                const result = await response.json();
                if (response?.status !== 200) {
                    throw new NotFoundError(`MAP API ERROR`);
                }

                const sanitizedResults = await this.sanitizeOutput({status: 'ok', data:result?.features}, ctx);
                ctx.send(sanitizedResults);

            } catch (error) {
                console.log(error);
                throw new NotFoundError(`Unknow Error`);
            }
        },
    }));
