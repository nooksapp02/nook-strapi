'use strict';

/**
 * profile controller
 */

const { ValidationError } = require('@strapi/utils').errors;
const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::profile.profile',
    ({ strapi }) => ({
        async find(ctx) {
            const userId = ctx.state.user.id;
            const result = await strapi.entityService.findMany('api::profile.profile', { fields: ['id'], populate: ['appflow'], filters: { user: userId } });
            const sanitizedResults = await this.sanitizeOutput(result, ctx);
            ctx.send(sanitizedResults);
        },

        async findOne(ctx) {
            const idProfile = ctx.params.id;
            const { id, username, provider, email } = ctx.state.user;
            const profile = await strapi.entityService.findMany('api::profile.profile', { filters: { id: idProfile, user: id }, populate: '*' });
            if (0 === profile.length) {
                throw new ValidationError('not found profile data');
            }

            const sanitizedResults = await this.sanitizeOutput({ ...profile[0], userData: { username, provider, email } }, ctx);
            ctx.send(sanitizedResults);
        },

        async create(ctx) {
            const userId = ctx.state.user.id;
            const appflow = await strapi.entityService.findOne('api::appflow.appflow', 1, { fields: ['id'] });
            if (!appflow) {
                throw new ValidationError('not found profile data');
            }
            const profile = await strapi.entityService.create('api::profile.profile', { data: { appflow, user: userId }, fields: ['id'] });
            const sanitizedResults = await this.sanitizeOutput({ status: 'success', profile }, ctx);
            ctx.send(sanitizedResults);
        },

        async updateObjectives(ctx) {
            const { profileId, flow, objectives } = ctx.request.body;

            await strapi.entityService.update('api::profile.profile', profileId, {
                data: {
                    appflow: flow,
                    objectives
                },
            });


            ctx.send({ ok: true });
        },

        async updateTrainingTypes(ctx) {
            const { profileId, flow, training_types } = ctx.request.body;

            await strapi.entityService.update('api::profile.profile', profileId, {
                data: {
                    appflow: flow,
                    training_types
                },
            });


            ctx.send({ ok: true });
        },

        async updateFrecuencyDay(ctx) {
            const { profileId, flow, frecuency_day } = ctx.request.body;

            await strapi.entityService.update('api::profile.profile', profileId, {
                data: {
                    appflow: flow,
                    frecuency_day
                },
            });

            ctx.send({ ok: true });
        },

        async updatePersonalData(ctx) {
            const { profileId, flow, weight, height, age, name, lastname } = ctx.request.body;
            const data = { name, lastname, weight, height, age };
            const profileApi = 'api::profile.profile';
            const personalDataApi = 'api::personal-data.personal-data';

            const getPersonalData = await strapi.entityService.findOne(profileApi, profileId, { populate: 'personal_data' });
            let personalDataId;

            if (!getPersonalData['personal_data']) {
                const personalData = await strapi.entityService.create(personalDataApi, { data });
                personalDataId = personalData.id;
            } else {
                const personalData = await strapi.entityService.update(personalDataApi, getPersonalData['personal_data'].id, { data });
                personalDataId = personalData.id;
            }

            await strapi.entityService.update(profileApi, profileId, {
                data: {
                    appflow: flow,
                    personal_data: personalDataId
                },
            });

            ctx.send({ ok: true });
        },
        async getUser(ctx) {
            const profileId = ctx.params.id;
            const profileApi = 'api::profile.profile';

            const getPersonalData = await strapi.entityService.findOne(profileApi, profileId, {
                fields: ['id'],
                populate:
                {
                    personal_data:
                    {
                        fields: ['age', 'name', 'lastname']
                    },
                    profileImage: true
                }
            });

            ctx.send(getPersonalData);
        },
    }));
