'use strict';

require('../lib/general.js');

module.exports.processGetCurrentRes = (dbRes) => {
    const toReturn = {
        content: dbRes[0].node_content,
        options: [],
    };
    dbRes.forEach((cur) =>
        toReturn.options.push({
            optionid: cur.optionid,
            content: cur.option_content,
        })
    );
    return toReturn;
};
