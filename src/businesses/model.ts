import { Business, BusinessLegalType, BusinessType, User } from "@prisma/client";
import { UserModel, userModelFromPrisma } from "../users/model";
import prisma from "../util/db";

export const BusinessModelTypes = [
    "Edukacija",
    "Ekologija",
    "Usluge",
    "IT",
    "Restoran",
    "Turizam",
    "Zdravlje",
    "Drugo..."
];
export type BusinessModelType =
    "Edukacija" |
    "Ekologija" |
    "Usluge" |
    "IT" |
    "Restoran" |
    "Turizam" |
    "Zdravlje" |
    "Drugo...";


export const BusinessModelLegalTypes = [
    "D.O.O.",
    "A.D.",
    "K.O.",
    "O.D."];
export type BusinessModelLegalType =
    "D.O.O." |
    "A.D." |
    "K.O." |
    "O.D.";

export interface BusinessModel {
    id: number;
    name: string;
    legalType: BusinessModelLegalType;
    type: BusinessModelType;
    description: string;
    photo: string;
    postedBy: UserModel;
}

export const businessModelFromPrisma = async (prismaModel: Business): Promise<BusinessModel> => {
    let postedByPrisma: User = (await prisma.user.findUnique({
        where: {
            id: prismaModel.posted_by_id
        }
    }))!;

    return {
        id: prismaModel.id,
        name: prismaModel.name,
        description: prismaModel.description,
        photo: prismaModel.photo,

        postedBy: await userModelFromPrisma(postedByPrisma),

        legalType: legalTypeFromPrisma(prismaModel.legal_type),
        type: typeFromPrisma(prismaModel.type)
    };
};

export const typeFromPrisma = (prismaValue: BusinessType): BusinessModelType => {
    if (prismaValue == "Drugo") {
        return "Drugo...";
    }
    return prismaValue;
};

export const legalTypeFromPrisma = (prismaValue: BusinessLegalType): BusinessModelLegalType => {
    // wanted to try out this 1337 type system feature, teehee :3
    const mapping: Record<"DOO" | "AD" | "KO" | "OD", BusinessModelLegalType>
        = {
        "DOO": "D.O.O.",
        "AD": "A.D.",
        "KO": "K.O.",
        "OD": "O.D.",
    };

    return mapping[prismaValue];
};

export const typeToPrisma = (type: BusinessModelType): BusinessType => {
    if (type == "Drugo...") {
        return "Drugo";
    }

    return type;
};


export const legalTypeToPrisma = (legalType: BusinessModelLegalType): BusinessLegalType => {
    // uhh same as in `legalTypeFromPrisma`, just reversed
    const mapping: Record<"D.O.O." | "A.D." | "K.O." | "O.D.", BusinessLegalType>
        = {
        "D.O.O.": "DOO",
        "A.D.": "AD",
        "K.O.": "KO",
        "O.D.": "OD",
    };

    return mapping[legalType];
};