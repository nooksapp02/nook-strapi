'use strict';

/**
 * place controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { ValidationError, NotFoundError } = require('@strapi/utils').errors;

module.exports = createCoreController('api::place.place',
    ({ strapi }) => ({
        async findOne(ctx) {
            const placeId = ctx.params.id;
            const result = await strapi.entityService.findOne('api::place.place', placeId, {
                fields: ['id', 'name', 'creatorProfile', 'createdAt'], populate: {
                    images: true,
                    review: true,
                    comments: {fields: ['*']},
                    location: true
                }
            });

            result.date = result.createdAt;

            result.comments.map(async comment => {
                const profileUser = await strapi.entityService.findOne('plugin::users-permissions.user', comment.profileUser, {
                    fields: ['username']
                });

                comment.nick = profileUser?.username;
            })

            const creatorProfile = await strapi.entityService.findOne('plugin::users-permissions.user', result?.creatorProfile, {
                fields: ['username']
            });

            result.creatorProfile = creatorProfile;

            result.review = strapi.service('api::product.review-rating').calculateRanting(result.review);

            const sanitizedResults = await this.sanitizeOutput(result, ctx);
            ctx.send(sanitizedResults);
        },

        async findNearby(ctx) {
            const { latitude, longitude } = ctx.request.body;
            const result = await strapi.entityService.findMany('api::place.place', {
                fields: ['id', 'name'],
                filters: {
                    location: {
                        $and: [
                            {
                                latitude: {
                                    $between: [latitude.min, latitude.max],
                                }
                            },
                            {
                                longitude: {
                                    $between: [longitude.min, longitude.max],
                                }
                            }
                        ]
                    }
                },
                populate: {
                    location: {
                        fields: ['latitude', 'longitude', 'label']
                    },
                    review: true,
                    comments: true
                },
            });

            result.map(r => {
                r.review = strapi.service('api::product.review-rating').calculateRanting(r.review);
                r.comments = { total: r.comments.length }
            })
            const sanitizedResults = await this.sanitizeOutput(result, ctx);
            ctx.send(sanitizedResults);
        },
        async addPlace(ctx) {
            try {
                const { name, description, longitude, latitude } = ctx.request.body;
                const creatorProfile = ctx.state.user.id;
                const url = `${process.env.API_MAP_DOMAIN}/v5/mapbox.places/${longitude},${latitude}.json?limit=1&types=address&access_token=${process.env.API_MAP_tOKEN}`;

                const response = await fetch(url, { method: 'GET' });
                const result = await response.json();
                if (response?.status !== 200) {
                    console.log(result);
                    throw new NotFoundError(`MAP API ERROR`);
                }

                const newLocation = {latitude, longitude, label: result?.features[0].place_name};

                const create = await strapi.entityService.create('api::place.place', {
                    data: {
                        name,
                        description,
                        location: newLocation,
                        creatorProfile,
                        publishedAt: new Date()
                    }
                });
                const sanitizedResults = await this.sanitizeOutput(create, ctx);
                ctx.send(sanitizedResults);


            } catch (error) {
                console.log(error);
                throw new NotFoundError(`Unknow Error`);
            }
        },

        async addComment(ctx) {
            const { description, placeId } = ctx.request.body;

            const result = await strapi.entityService.findOne('api::place.place', placeId, {
                fields: ['id'], populate: {
                    comments: true,
                }
            });

            const update = await strapi.entityService.update('api::place.place', placeId, {
                data: {
                    comments: [
                        ...result.comments, {
                            profileUser: ctx.state.user.id,
                            description,
                            date: new Date()
                        }
                    ]
                }
            });
            const sanitizedResults = await this.sanitizeOutput(update, ctx);
            ctx.send(sanitizedResults);
        },

        async addReview(ctx) {
            const { ranting, placeId, description } = ctx.request.body;

            const result = await strapi.entityService.findOne('api::place.place', placeId, {
                fields: ['id'], populate: {
                    review: {
                        fields: '*',
                        populate: '*'
                    },
                }
            });

            const userId = ctx.state.user.id;

            if (result.review.find(review => review?.comment?.profileUser === userId) !== undefined) {
                throw new ValidationError(`DUPLICATED`);
            };

            const update = await strapi.entityService.update('api::place.place', placeId, {
                data: {
                    review: [
                        ...result.review, {
                            ranting,
                            comment: {
                                profileUser: userId,
                                description
                            }
                        }
                    ]
                }
            });
            const sanitizedResults = await this.sanitizeOutput(update, ctx);
            ctx.send(sanitizedResults);
        }
    }));
