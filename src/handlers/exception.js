
module.exports = class ErrorOccured extends Error{
    constructor(status, description, ...params){
        super(params);
        this.status = status;
        this.description = description
    }
}