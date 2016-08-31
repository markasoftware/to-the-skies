const user = {
    get: function(){
        return m.request({method: 'GET', url: 'api/user'});
    }
}
