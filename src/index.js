'use strict';
const Alexa = require('alexa-sdk');
import QADriver from "./drivers/qa-driver";

const qaDriver = new QADriver();

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers, qa1Handlers, qa2Handlers);
    alexa.execute();
}

const handlers = {
    'LaunchRequest': function () {
        console.log("LaunchRequest");
        this.emit("checkout");
    },
    'checkout': function () {
        console.log("checkout");
        const message = new Array();
        message.push("チェックアウトしますね．この度はご利用ありがとうございました．");
        message.push("アンケートにご協力ください．");
        message.push("サービスの満足度を５段階でお答えください");
        this.handler.state = "QA_1"
        this.emit(":ask", message.join(""));
    },
    'review': function () {
        qaDriver.get()
            .then((data) => {
                console.log(data);
                const qa1answers = data.filter(row => row.field === "qa1");
                
                const messages = new Array();
                messages.push("サービス満足度は");
                for(let i = 0; i <= 5; ++i) {
                    messages.push(`${i}が${qa1answers.filter(row => row.val == i).length}人.`);
                }
                messages.push("です．");

                const qa2answers = data.filter(row => row.field === "qa2");
                messages.push(`また来たいと答えたお客様は${qa2answers.filter(row => row.val === "yes").length}人です．`);
                messages.push(`また来たくないと答えたお客様は${qa2answers.filter(row => row.val === "no").length}人です．`);
                this.emit(":ask", messages.join(""));  
            })
            .catch((err) => {
                console.error(err);
                this.emit(":tell", "データベースから取得に失敗しました.");
            });
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

const qa1Handlers = Alexa.CreateStateHandler("QA_1", {
    "checkout": function () {
        const qa1 = this.event.request.intent.slots.number.value;
        console.log(this.event.request.intent.slots);
        console.log(qa1);
        const qa1Num = parseInt(qa1);
        if (isNaN(qa1Num)) {
            this.emit(":ask", "よく聞こえません");
        }
        qaDriver.put("qa1", qa1).then(() => {
            this.handler.state = "QA_2";
            this.emit(":ask", "また利用したいですか？");
        }).catch((err) => {
            console.error(err);
            this.emit(":ask", "データベースへの書き込みに失敗しました");
        });
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', "セッション終了");
    }
});


const qa2Handlers = Alexa.CreateStateHandler("QA_2", {
    "checkout": function () {
        const qa2 = this.event.request.intent.slots.yesno.value;
        console.log(qa2);
        qaDriver.put("qa2", qa2).then(() => {
            this.emit(":tell", "ありがとうございました．今後ともよろしくお願いします．");
        }).catch((err) => {
            console.error(err);
            this.emit(":ask", "データベースへの書き込みに失敗しました");
        });
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', "セッション終了");
    }
});
