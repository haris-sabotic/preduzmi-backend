import { User, UserType } from "@prisma/client";

export type UserModelType = UserType;

export interface UserModel {
    id: number;
    name: string;
    email: string;
    phone: string;
    type: UserModelType;
    photo: String;

}
export const userModelFromPrisma = async (prismaModel: User): Promise<UserModel> => {
    return {
        id: prismaModel.id,
        name: prismaModel.name,
        email: prismaModel.email,
        phone: prismaModel.phone,
        type: prismaModel.type,
        photo: prismaModel.photo
    };
};