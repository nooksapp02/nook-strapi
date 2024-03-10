'use strict';

/**
 * auth route
 */

module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/images/upload',
            handler: 'image.upload',
            config: {
                middlewares: ['api::image.upload-image-req'],
            }
        },
    ],
};