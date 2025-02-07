import { EntityNotFoundError } from 'typeorm';

type ResponseException = {
  message: string[];
};

export class HttpExceptionDto extends EntityNotFoundError {
  status: number;
  message: string;
  response: ResponseException | string;
  detail: string;
  code: string;
}
