/*
  Warnings:

  - Added the required column `expiresIn` to the `token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "token" ADD COLUMN     "expiresIn" INTEGER NOT NULL;
