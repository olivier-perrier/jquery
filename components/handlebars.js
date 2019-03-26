console.log("[INFO] Loading Handlebars...")

var exphbs = require('express-handlebars')



exports.hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        toDate: function (date) {
            var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
            if (date)
                return date.toLocaleDateString('en-EN', options)
        },
        toSimpleDate: function (date) { if (date) return date.toLocaleString() },
        toElapsedTime: function (date) {
            if (date) {
                if (Math.abs(new Date().getDay() - date.getDay()) > 0) return (7 + (new Date().getDay() - date.getDay())) % 7 + " days"
                if (new Date().getHours() - date.getHours() > 0) return new Date().getHours() - date.getHours() + " hours"
                if (new Date().getMinutes() - date.getMinutes() > 0) return new Date().getMinutes() - date.getMinutes() + " minutes"
                return new Date().getSeconds() - date.getSeconds() + " secondes"
            }
        },
        ifeq: function (var1, var2, options) {
            if (var1 == var2) return options.fn(this)
            else
                return options.inverse(this)
        }
    }
})