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
        {
            method: 'POST',
            path: '/places/add',
            handler: 'place.addPlace',
            config: {
                middlewares: ['api::place.add-place-req'],
            }
        },
        {
            method: 'POST',
            path: '/places/add/comment',
            handler: 'place.addComment',
            config: {
                middlewares: ['api::place.add-comment-req'],
            }
        },
        {
            method: 'POST',
            path: '/places/add/review',
            handler: 'place.addReview',
            config: {
                middlewares: ['api::place.add-review-req'],
            }
        },
    ],
};