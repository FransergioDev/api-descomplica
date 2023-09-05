class ApplicationError {
    message;
    httpStatusCode;

    constructor(message, httpStatusCode) {
        this.message = message;
        this.httpStatusCode = httpStatusCode;
    }

    getMensagens() {
        return this.message;
    }

    getHttpStatusCode() {
        return this.httpStatusCode;
    }
}

module.exports = {
    ApplicationError
}