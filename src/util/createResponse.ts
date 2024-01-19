export function createResponse(data: any, code: number): object {
    return {
        status: code == 200 ? 'OK' : 'ERROR',
        code,
        data,
    };
}