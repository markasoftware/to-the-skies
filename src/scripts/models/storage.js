'use strict';

const m = require('mithril');

module.exports = {
    user: {
        get() {
            return location.search.indexOf('li') !== -1;
        },
    },
    characters: {
        getAll() {
            return m.request({
                method: 'GET',
                url: 'api/characters/get',
            });
        },
        create(name) {
            const queryString = m.route.buildQueryString({ name });
            return m.request({
                method: 'GET',
                url: `api/characters/create?${queryString}`,
            });
        },
    },
};
