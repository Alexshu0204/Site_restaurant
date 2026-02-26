import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(12, {
    message: 'Le mot de passe doit contenir au moins 12 caractères.',
  })
  // The regex pattern ensures that the password contains at least one lowercase letter, one uppercase letter, one digit, and one special character.
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message:
      'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.',
  })
  password: string;
}
