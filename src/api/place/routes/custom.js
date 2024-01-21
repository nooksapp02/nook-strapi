'use strict';

/**
 * auth route
 */

module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/places/nearby',
            handler: 'place.findNearby',
            config: {
                middlewares: ['api::place.get-nearby-place-req'],
            }
        },
    ],
};