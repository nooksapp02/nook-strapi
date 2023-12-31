'use strict';

module.exports = ({ strapi }) => ({

    canView(ctx, product) {
        const profileId = ctx.request.query.profileId;
        const role = ctx.state.user.role.name;
        const profiles = product.profiles;
        const onlyList = product.onlyList;
        const isSuscribed = 'SUSCRIBED' === role.toUpperCase();
        const isPublic = 'AUTHENTICATED' === product.visibility;
        const inList = (onlyList && profiles.find(profile => profile.id === parseInt(profileId))) || !onlyList ? true : false;
        return (isPublic || isSuscribed) && inList ? true : false;
    }
})