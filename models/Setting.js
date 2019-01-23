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

// To improve with getAllSettings function
function getSettings(keys, callback) {
    data.settings.find({ name: { $in: keys } }, (err, sets) => {
        var setsReturn = {
            siteName: sets.find(e => e.name = "siteName") == null ? "" : sets.find(e => e.name = "siteName").value,
            siteTitle: sets.find(e => e.name = "siteTitle") == null ? "" : sets.find(e => e.name = "siteTitle").value,
        }
        callback(err, setsReturn)
    })
}

function getAllSettings(callback) {
    data.settings.find({}, { name: 1, value: 1, _id: 0 }, (err, sets) => {
        resTest = sets.reduce((acc, cur) => {
            acc[cur.name] = cur.value;
            return acc;
        }, {})
        callback(err, resTest)
    })
}

Setting.addSetting = addSetting
Setting.getSetting = getSetting
Setting.getSettings = getSettings
Setting.getAllSettings = getAllSettings

// addSetting("siteTitle", "OP style", (err, set) => {})
data.settings.update({ name: "siteName" }, { name: "siteName", value: "OP" }, { upsert: true })
data.settings.update({ name: "siteTitle" }, { name: "siteTitle", value: "OP" }, { upsert: true })

module.exports = Setting