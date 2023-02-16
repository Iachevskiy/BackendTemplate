/*
  Warnings:

  - Вы собираетесь удалить столбец "Электронная почта" в таблице "Пользователь". Все данные в столбце будут потеряны.
  - Добавлен обязательный столбец `телефон` в таблицу `Пользователь` без значения по умолчанию. Это невозможно, если таблица не пуста.
*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT NOT NULL,
    "name" TEXT,
    "refreshToken" TEXT
);
INSERT INTO "new_User" ("id", "phone", "refreshToken") SELECT "id", "name" as "phone", "refreshToken" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
