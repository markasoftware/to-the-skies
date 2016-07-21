var storage = {
    user: {
        get: function() {
            return m.prop(location.search.indexOf('li') !== -1);
        }
    },
    characters: {
        getAll: function() {
            return m.request({method: 'GET', url:
                'api/characters/get'
            }).then(function (charArr) {
                var toReturn = {};
                charArr.forEach(function(curChar) {
                    toReturn[curChar.characterid] = {
                        name: m.prop(curChar.name),
                        position: m.prop(curChar.position)
                    }
                });
                return toReturn;
            });
        },
        create: function(name) {
            var queryString = m.route.buildQueryString(
                { name: name }
            );
            return m.request({method: 'GET', url:
                `api/characters/create?${queryString}`
            });
        }
    }
}
