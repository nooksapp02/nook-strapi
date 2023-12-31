"use strict";
const { ValidationError } = require('@strapi/utils').errors;

module.exports = (config, { strapi }) => {

    return async (ctx, next) => {
        const profileId = ctx.request.query.profileId;
        if (!profileId) throw new ValidationError('profileId query params is required.');
        await strapi.service('api::profile.security').isOwner(ctx, profileId);

        return next();
    }
};