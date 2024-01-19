import { Express } from 'express';
import fileUpload from 'express-fileupload';

export const configureFileUpload = (app: Express) => {
    app.use(
        fileUpload({
            limits: {
                fileSize: 10000000, // 10MB
            },
            abortOnLimit: true,
        })
    );
};