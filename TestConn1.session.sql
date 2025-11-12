SELECT
  name
FROM
  sqlite_master
WHERE
  type = 'table';

PRAGMA table_info(entries);

SELECT
  COUNT(*) AS row_count
FROM
  entries;

SELECT
  *
FROM
  entries
ORDER BY
  createdAt DESC
LIMIT
  10;
