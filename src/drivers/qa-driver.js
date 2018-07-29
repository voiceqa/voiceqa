const DocumentClient = require("aws-sdk").DynamoDB.DocumentClient;
const uuid = require("uuid").v4;

export default class QADriver {
    constructor() {
        this.db = new DocumentClient();
    }

    get() {
        return new Promise((resolve, reject) => {
            this.db.scan({
                TableName: process.env.DYNAMODB,
            }, (err, data) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(data.Items);
            });
        })
    }

    /**
     * @param {int} field 質問番号
     * @param {any} val 
     */
    put(field, val) {
        return this.db.put({
            TableName: process.env.DYNAMODB,
            Item: {
                id: uuid(),
                field,
                val,
                datetime: new Date().getTime() / 1000
            }
        }).promise();
    }
}
