'use strict';

/**
 * publicity service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::publicity.publicity');
