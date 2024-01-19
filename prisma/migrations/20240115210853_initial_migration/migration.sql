-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Preduzetnik', 'Investitor');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('Edukacija', 'Ekologija', 'Usluge', 'IT', 'Restoran', 'Turizam', 'Zdravlje', 'Drugo...');

-- CreateEnum
CREATE TYPE "BusinessLegalType" AS ENUM ('DOO', 'AD', 'KO', 'OD');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" "UserType" NOT NULL,
    "photo" TEXT NOT NULL DEFAULT 'default_user.png',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "legal_type" "BusinessLegalType" NOT NULL,
    "type" "BusinessType" NOT NULL,
    "description" TEXT NOT NULL,
    "photo" TEXT NOT NULL DEFAULT 'default_business.png',
    "postedByUserId" INTEGER NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_liked_business" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_saved_business" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_liked_business_AB_unique" ON "_liked_business"("A", "B");

-- CreateIndex
CREATE INDEX "_liked_business_B_index" ON "_liked_business"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_saved_business_AB_unique" ON "_saved_business"("A", "B");

-- CreateIndex
CREATE INDEX "_saved_business_B_index" ON "_saved_business"("B");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_postedByUserId_fkey" FOREIGN KEY ("postedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_liked_business" ADD CONSTRAINT "_liked_business_A_fkey" FOREIGN KEY ("A") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_liked_business" ADD CONSTRAINT "_liked_business_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_saved_business" ADD CONSTRAINT "_saved_business_A_fkey" FOREIGN KEY ("A") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_saved_business" ADD CONSTRAINT "_saved_business_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
