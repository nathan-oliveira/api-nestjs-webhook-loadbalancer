import typesErrorPostgres from 'src/locales/en-US/postgres.json';

export const getMessagePgError = (code: string) => {
  try {
    return typesErrorPostgres[code];
  } catch (error) {
    return null;
  }
};
