module.exports.checkLogin = (req, res) => {
    if(!req.user) {
        res.status(401).json('not logged in');
        return true;
    } else { return false; }
}
