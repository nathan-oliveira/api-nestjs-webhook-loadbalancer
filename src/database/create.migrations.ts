/* eslint-disable */
const { execSync } = require('child_process');

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Por favor, forneça o nome da migração.');
  process.exit(1);
}

const migrationPath = `./src/database/migrations/${migrationName}`;

execSync(
  `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create ${migrationPath}`,
  { stdio: 'inherit' },
);
