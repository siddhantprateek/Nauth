-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "token_token_key" ON "token"("token");
