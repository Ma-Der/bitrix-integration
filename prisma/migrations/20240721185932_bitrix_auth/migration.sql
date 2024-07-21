-- CreateTable
CREATE TABLE "BitrixAuth" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "expires" INTEGER NOT NULL,
    "refreshToken" TEXT NOT NULL,

    CONSTRAINT "BitrixAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BitrixAuth_name_key" ON "BitrixAuth"("name");
