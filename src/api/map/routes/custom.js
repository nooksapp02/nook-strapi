'use strict';

/**
 * auth route
 */

module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/geocoding/places',
            handler: 'map.findPlaces',
            config: {
                middlewares: ['api::map.get-geocoding-place-req'],
            }
        },
    ],
};