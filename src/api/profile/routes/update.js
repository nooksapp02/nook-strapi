'use strict';

/**
 * auth route
 */

module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/profile/update/objectives',
            handler: 'profile.updateObjectives',
            config: {
                middlewares: ['api::profile.update-objectives-req', 'api::profile.is-owner'],
            }
        },
        {
            method: 'POST',
            path: '/profile/update/training-types',
            handler: 'profile.updateTrainingTypes',
            config: {
                middlewares: ['api::profile.update-training-types-req', 'api::profile.is-owner'],
            }
        },
        {
            method: 'POST',
            path: '/profile/update/frecuency-day',
            handler: 'profile.updateFrecuencyDay',
            config: {
                middlewares: ['api::profile.update-frecuency-day-req', 'api::profile.is-owner'],
            }
        },
        {
            method: 'POST',
            path: '/profile/update/customForm',
            handler: 'profile.updateCustomForm',
            config: {
                middlewares: ['api::profile.update-custom-form-req', 'api::profile.is-owner'],
            }
        },
        {
            method: 'POST',
            path: '/profile/update/personal-data',
            handler: 'profile.updatePersonalData',
            config: {
                middlewares: ['api::profile.update-personal-data-req', 'api::profile.is-owner'],
            }
        },
        {
            method: 'POST',
            path: '/profile/update/image',
            handler: 'profile.updateProfileImage',
            config: {
                middlewares: ['api::profile.update-image-req', 'api::profile.is-owner'],
            }
        },
    ],
};