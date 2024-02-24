'use strict';

module.exports = ({ strapi }) => ({

    calculateRanting(reviews) {
        if (reviews?.length === 0) return {total: 0};
        const ratingTypes = {};
        reviews.forEach(review => {
            const typeValue = ratingTypes[review.ranting];
            ratingTypes[review.ranting] = typeValue ? typeValue + 1 : 1;
        });
        const sum = Object.keys(ratingTypes).reduce((i, key) => i + ratingTypes[key] * parseInt(key), 0);
        return { rating: (sum / reviews.length).toFixed(1), total: reviews.length }
    }
})