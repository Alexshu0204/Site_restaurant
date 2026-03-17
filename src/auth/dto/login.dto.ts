import { IsEmail, IsString, MaxLength } from "class-validator";

// The LoginDto class defines the structure of the data required for a user to log in.
// It includes an email field, which must be a valid email address, and a password field,
// which must be a string with a maximum length of 128 characters.
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(128)
  password: string;
}