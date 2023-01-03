/*
  Warnings:

  - The primary key for the `schedulings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `is` on the `schedulings` table. All the data in the column will be lost.
  - The required column `id` was added to the `schedulings` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `schedulings` DROP PRIMARY KEY,
    DROP COLUMN `is`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
