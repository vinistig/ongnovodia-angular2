export class MessagesLogin {
    invalidCredentials: string;
    permissionError: string;
    defaultMessage: string;

    constructor(invalidCredentials: string, permissionError: string, defaultMessage:string, ) {

        this.invalidCredentials = invalidCredentials;
        this.permissionError = permissionError;
        this.defaultMessage = defaultMessage;

    }
}

export const Messages: MessagesLogin = {
    "invalidCredentials": "Credentials invalid! Please, try again.",
    "permissionError": "Oops! It seems you do not have permission to access this. :(",
    "defaultMessage": "Oops! Something went wrong! Please, try again in a few moments."
}