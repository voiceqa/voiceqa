'use strict';
const Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
}

const handlers = {
    'LaunchRequest': function () {
        this.emit(":tell", "チェックアウトしますね．この度はご利用ありがとうございました．");
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':tell', " つかいかた");
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', "キャンセル");
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', "ストップ");
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', "セッション終了");
    }
};
