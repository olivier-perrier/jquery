var data = require('./data')

var Setting = {
    name: String,
    value: Object,
}

function addSetting(key, value, callback) {
    data.settings.insert({ name: key, value: value }, (err, set) => {
        callback(err, set)
    })
}

function getSetting(key, callback) {
    data.settings.findOne({ name: key }, (err, set) => {
        callback(err, set)
    })
}

// To improve
function getSettings(keys, callback) {
    data.settings.find({ name: { $in: keys } }, (err, sets) => {
        var setsReturn = {
            siteName : sets.find(e => e.name="siteName").value,
            siteTitle : sets.find(e => e.name="siteTitle").value,
        }
        callback(err, setsReturn)
    })
}

Setting.addSetting = addSetting
Setting.getSetting = getSetting
Setting.getSettings = getSettings

// addSetting("siteTitle", "OP style", (err, set) => {})

module.exports = Setting