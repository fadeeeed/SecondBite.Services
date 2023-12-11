import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsLatitude, IsLongitude, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public user_name: string;

  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  public password: string;

  @IsOptional()
  @IsString()
  public role: string;

  @IsOptional()
  @IsString()
  public first_name: string;

  @IsOptional()
  @IsString()
  public last_name: string;

  @IsOptional()
  @IsString()
  public contact_number: string;

  @IsOptional()
  @IsString()
  public address: string;

  @IsOptional()
  @IsLatitude()
  public location_longitude: number;

  @IsOptional()
  @IsLongitude()
  public location_latitude: number;
}
