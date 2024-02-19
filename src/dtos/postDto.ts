import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsEnum,
} from "class-validator";

// 게시글 생성을 위한 DTO
export class CreatePostDTO {
  post_number?: number;

  @IsString({ message: "제목은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "제목은 반드시 입력되어야 합니다." })
  @MaxLength(40, { message: "제목은 40자를 초과할 수 없습니다." })
  title!: string;

  @IsString({ message: "내용은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "내용은 반드시 입력되어야 합니다." })
  content!: string;

  @IsOptional()
  tags?: string[] | string;

  @IsEnum({ 0: 0, 1: 1 }, { message: "일반 게시글 : 0, 고정 게시글 : 1" })
  is_fixed;
}

// 게시글 수정을 위한 DTO
export class UpdatePostDTO {
  @IsString({ message: "제목은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "제목은 반드시 입력되어야 합니다." })
  @MaxLength(40, { message: "제목은 40자를 초과할 수 없습니다." })
  title!: string;

  @IsString({ message: "내용은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "내용은 반드시 입력되어야 합니다." })
  content!: string;

  @IsOptional()
  tags?: string[] | string;

  @IsEnum({ 0: 0, 1: 1 }, { message: "일반 게시글 : 0, 고정 게시글 : 1" })
  is_fixed;
}
