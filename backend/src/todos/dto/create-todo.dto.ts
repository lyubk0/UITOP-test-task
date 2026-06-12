import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  text: string;

  @IsInt()
  @Min(1)
  categoryId: number;
}
