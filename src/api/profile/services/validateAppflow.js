'use strict';
const { ValidationError } = require('@strapi/utils').errors;

module.exports = ({ strapi }) => ({

    async validateAppflow(flow) {
        let appflow = flow;
            if (typeof appflow === 'string') {
                const response = await strapi.entityService.findMany('api::appflow.appflow', { filters: { label: flow }, fields: 'id' });
                appflow = response.length !== 0 ? response[0].id : null;
            }

            if (!appflow) throw new ValidationError(`Campo flow no valido`);

            return appflow;
    }
})