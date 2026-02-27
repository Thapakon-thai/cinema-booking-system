-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "price" REAL NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL,
    "showTime" DATETIME NOT NULL
);
INSERT INTO "new_Movie" ("id", "image", "price", "showTime", "title") SELECT "id", "image", "price", "showTime", "title" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
CREATE INDEX "Movie_title_idx" ON "Movie"("title");
CREATE INDEX "Movie_showTime_idx" ON "Movie"("showTime");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
