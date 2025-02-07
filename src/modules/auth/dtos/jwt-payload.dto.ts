export interface JwtPayloadDto {
  iat: number;
  sub: number;
  companyId: number;
  active: boolean;
  rule: number;
}
