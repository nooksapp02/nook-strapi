'use strict';

/**
 * auth route
 */

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/profile/get/user/:id',
            handler: 'profile.getUser',
            config: {
                middlewares: ['api::profile.is-owner-get'],
            }
        }
    ],
};