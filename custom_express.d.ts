import { UserModel } from "./src/users/model";

declare global {
    namespace Express {
        interface Request {
            user?: UserModel;
        }
    }
}