import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export type JsonObject = Record<string, unknown>;

export async function toValidatedDto<T extends object>(
  DtoClass: new () => T,
  input: JsonObject,
): Promise<T> {
  const dto = plainToInstance(DtoClass, input);
  await validateOrReject(dto as object, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  return dto;
}
