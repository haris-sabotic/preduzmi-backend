import express from "express";
import bodyParser from "body-parser";
import * as dotenv from 'dotenv';
import { configureFileUpload } from "./util/configureFileUpload";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import router from "./routes";

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

configureFileUpload(app);

app.use('/api', router);

app.listen(process.env.APP_PORT, () => {
    console.log(`Listening on port ${process.env.APP_PORT}`);
});

app.use(errorHandlerMiddleware);