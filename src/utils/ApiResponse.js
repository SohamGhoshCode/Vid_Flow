class ApiResponse{
    constructor(
        StatusCode,
        message = "Success",
        data
    ){
        this.message = message;
        this.StatusCode = StatusCode;
        this.data = data;
        this.success = StatusCode<400;
    }
}

export { ApiResponse };