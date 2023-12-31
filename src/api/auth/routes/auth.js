'use strict';

/**
 * auth route
 */

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/custom/connect/:provider/callback',
            handler: 'auth.callback',
            config: {
                callback: {
                    auth: false
                }
            }
        },
    ],
};