'use strict';

const { FormData } = require('formdata-node');

/**
 * image controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::image.image', ({ strapi }) => ({
    async upload(ctx) {
        const { images, prefix, extension, type } = ctx.request.body;

        ctx.request = createUploadReq(images, prefix, extension, type);

        await strapi.controller('plugin::upload.content-api').uploadFiles(ctx);
    }
}

));

const createUploadReq = async (images, prefix, extension, type) => {
    const form = new FormData();

    images.forEach(async (image, index) => {
        const fileName = `${prefix}${index}.${extension}`;
        form.append('files', b64toBlob(image, type), fileName);
    });

    return form;
}

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}
