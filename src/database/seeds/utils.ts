import { join } from 'path';
import { readFileSync } from 'fs';
import { QueryRunner } from 'typeorm';

export const getQuery = (whichQuery: string, whickSeed: string) => {
  const sqlPath = join(__dirname, `${whickSeed}.${whichQuery}.sql`);
  const sql = readFileSync(sqlPath, 'utf8');
  return sql.toString();
};

export const executeSetVal = async (
  queryRunner: QueryRunner,
  table: string,
  valseq: number,
) => {
  const [serialQuery, setValQuery] = [
    `SELECT pg_get_serial_sequence('${process.env.DATABASE_NAME_SCHEMA}.${table}', 'id') as valseq`,
    `SELECT setval('$valseq', ${valseq}, false)`,
  ];

  const [resultSerial] = await queryRunner.query(serialQuery);

  await queryRunner.query(setValQuery.replace('$valseq', resultSerial.valseq));
};

export const queryRunnerSeed = async (
  queryRunner: QueryRunner,
  type: string,
  whichSeed: { seed: string; table: string },
  setVal: number,
  replace: { search: string; value: string } = null,
) => {
  let query = getQuery(type, whichSeed.seed);
  query = query.replace('replace_schema', process.env.DATABASE_NAME_SCHEMA);
  if (replace) query = query.replace(replace.search, replace.value);
  await queryRunner.query(query);
  await executeSetVal(queryRunner, whichSeed.table, setVal);
};
