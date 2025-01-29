export class OperationResultResponseDTO {
    message!: string;
    success!: boolean;
    data?: any;

    constructor(message: string, success: boolean = true, data?: any) {
        this.message = message;
        this.success = success;
        if (data) {
            this.data = data;
        }
    }
}