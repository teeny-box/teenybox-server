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

  @IsEnum(
    { 자유: "자유", 기타: "공지" },
    { message: "카테고리는 자유, 공지중에 선택하세요." },
  )
  category!: "자유" | "공지";

  @IsEnum(
    { 고정: "고정", 일반: "일반" },
    { message: "고정, 일반 중에서 선택해야 합니다." },
  )
  is_fixed!: "고정" | "일반";
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

  @IsEnum(
    { 자유: "자유", 기타: "공지" },
    { message: "카테고리는 자유, 공지중에 선택하세요." },
  )
  category!: "자유" | "공지";

  @IsEnum(
    { 고정: "고정", 일반: "일반" },
    { message: "고정, 일반 중에서 선택해야 합니다." },
  )
  is_fixed?: "고정" | "일반";
}
