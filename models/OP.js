var data = require('./data')

OP = {

    widgets: [],

    addWidget(name) {
        this.widgets.push({ name })
    },

    getWidgets() {
        return this.widgets
    }
}

OP.addWidget("widget-posts")

module.exports = OP