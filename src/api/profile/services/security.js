'use strict';
const { ValidationError } = require('@strapi/utils').errors;

module.exports = ({ strapi }) => ({

    async isOwner(ctx, profileId) {
        const currentId = ctx.params.id;
        ctx.params = {  ...ctx.params, id: ctx.state.user.id };
        ctx.query = { ...ctx.query, populate: ['profiles'] };
        await strapi.controller('plugin::users-permissions.user').findOne(ctx);
        const result = ctx.body;

        ctx.params.id = currentId;
        if (!result.profiles.find(profile => profile.id === parseInt(profileId))) {
            throw new ValidationError('This action is unauthorized.');
        }
    }
})