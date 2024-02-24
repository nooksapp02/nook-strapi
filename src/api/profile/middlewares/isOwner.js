"use strict";
const { ValidationError } = require('@strapi/utils').errors;

module.exports = (config, { strapi }) => {

    return async (ctx, next) => {
        const profileId = ctx.request.body.profileId;
        await strapi.service('api::profile.security').isOwner(ctx, profileId);

        return next();
    }
};