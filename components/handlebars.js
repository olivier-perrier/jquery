console.log("[INFO] Loading Handlebars...")

var exphbs = require('express-handlebars')



exports.hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        labelify: function(string) {
            var label
            if(string){
                label = string.replace(/([A-Z])/g, ' $1').trim()
                label = label.charAt(0).toUpperCase() + label.slice(1)
            }
            return label
        },
        toDate: function (date) {
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            try {
                return date.toLocaleDateString('en-EN', options)
            }catch(e){
                console.log("[ERROR] " + e)
                return date
            }
        },
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