'use strict';

/**
 * auth route
 */

module.exports = {
    routes: [
        {
            method: 'PUT',
            path: '/products/:id/add/profile',
            handler: 'product.addProfile',
            config: {
                middlewares: ['api::product.is-owner']
            }
        },
    ],
};