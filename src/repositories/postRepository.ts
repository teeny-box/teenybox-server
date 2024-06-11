import PostModel, { IPost } from "../models/postModel";
import { CreatePostDTO, UpdatePostDTO } from "../dtos/postDto";
import { FilterQuery } from "mongoose";

class PostRepository {
  private isMigrationDone = false;

  // 게시글 생성
  async create(postData: CreatePostDTO): Promise<IPost> {
    // 최신 게시글의 post_number 조회
    const latestPost = await PostModel.findOne().sort({ post_number: -1 });

    // 최신 게시글의 post_number가 있다면 그 값에 1을 더하고, 없다면 1로 설정
    const nextPostNumber =
      latestPost && latestPost.post_number ? latestPost.post_number + 1 : 1;

    postData.post_number = nextPostNumber;

    const post = new PostModel(postData);
    return await post.save();
  }

  // 게시글 수정
  async update(
    post_number: number,
    updateData: UpdatePostDTO,
  ): Promise<IPost | null> {
    return await PostModel.findOneAndUpdate(
      { post_number: post_number },
      updateData,
      {
        new: true,
      },
    );
  }

  // 게시글 전체 조회 & 페이징 + 게시글 댓글
  async findAll(
    skip: number,
    limit: number,
    sortBy: string,
    sortOrder: "asc" | "desc",
    filter: FilterQuery<IPost>,
  ): Promise<{
    posts: Array<
      IPost & {
        commentsCount: number;
        user: { nickname: string; profile_url: string };
      }
    >;
    totalCount: number;
  }> {
    if (!this.isMigrationDone) {
      // await this.migrateCategoryField();
      this.isMigrationDone = true;
    }

    // 정렬 필드를 기준으로 매핑
    const sortFieldMapping = {
      time: "createdAt", // 'time'으로 통합하여 사용
      view: "views", // 조회순
      like: "likes", // 추천순
    };

    // MongoDB 정렬 방향 설정
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    // 정렬 객체 생성
    const sortOptions = {};
    const sortField = sortFieldMapping[sortBy];
    sortOptions[sortField] = sortDirection;

    const totalCount = await PostModel.countDocuments(filter);

    const aggregationResult = await PostModel.aggregate([
      {
        $match: {
          deletedAt: { $eq: null },
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },
      {
        $addFields: {
          commentsCount: { $size: "$comments" },
        },
      },
      // 사용자 정보를 가져오는 $lookup 추가
      {
        $lookup: {
          from: "users", // `users` 컬렉션의 이름을 정확히 맞춰야 합니다.
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      // 배열로 반환된 사용자 정보를 단일 객체로 변환
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $project: {
          comments: 0,
        },
      },
      { $match: filter },
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: limit === -1 ? Number.MAX_SAFE_INTEGER : limit }, // limit이 -1이면 모든 문서를 반환하도록 설정
    ]).exec();

    // MongoDB 집계 결과를 명시적으로 타입 변환
    const posts = aggregationResult.map((post) => ({
      ...post,
      user: {
        nickname: post.user.nickname,
        profile_url: post.user.profile_url,
        state: post.user.state,
      },
      commentsCount: post.commentsCount,
    }));

    return { posts, totalCount };
  }

  // 카테고리 필드 마이그레이션 메서드
  // private async migrateCategoryField(): Promise<void> {
  //   try {
  //     // 모든 게시물 중 category 필드가 없는 게시물에 기본값 "자유" 추가
  //     await PostModel.updateMany(
  //       { category: { $exists: false } },
  //       { $set: { category: "자유" } },
  //     );

  //     // 모든 게시물 중 is_fixed 필드가 없는 게시물에 기본값 "일반" 추가
  //     await PostModel.updateMany(
  //       { is_fixed: { $exists: false } },
  //       { $set: { is_fixed: "일반" } },
  //     );

  //     console.log("Migration completed successfully");
  //   } catch (error) {
  //     console.error(`Migration failed: ${error.message}`);
  //   }
  // }

  // 게시글 번호로 조회
  async findByPostNumber(postNumber: number): Promise<IPost | null> {
    return await PostModel.findOne({ post_number: postNumber })
      .populate("user_id", "nickname profile_url state")
      .exec();
  }

  // 특정 user의 게시글 조회 + 갯수 count + 정렬
  async findPostsByUserId(
    userId: string,
    skip: number,
    limit: number,
    sortBy: string,
    sortOrder: "asc" | "desc",
  ): Promise<{ posts: IPost[]; totalCount: number }> {
    // 게시글 총 갯수를 가져오는 쿼리
    const totalCount = await PostModel.countDocuments({
      user_id: userId,
      deletedAt: null,
    });

    // 정렬 필드를 기준으로 매핑
    const sortFieldMapping = {
      time: "createdAt", // 'time'으로 통합하여 사용
      view: "views", // 조회순
      like: "likes", // 추천순
    };

    // MongoDB 정렬 방향 설정
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    // 정렬 객체 생성
    const sortOptions = {};
    const sortField = sortFieldMapping[sortBy];
    sortOptions[sortField] = sortDirection;

    const posts = await PostModel.find({ user_id: userId, deletedAt: null })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "user_id",
        select: "nickname profile_url _id state",
      })
      .exec();

    return { posts, totalCount };
  }

  // 게시글 삭제
  async deleteByPostNumber(postNumber: number): Promise<IPost | null> {
    const postToDelete = await PostModel.findOneAndUpdate(
      { post_number: postNumber },
      { deletedAt: new Date() },
      { new: true },
    );
    return postToDelete;
  }

  // 통합 검색
  async findByQuery(
    query: object,
    skip: number,
    limit: number,
    sortBy: string,
    sortOrder: "asc" | "desc",
  ): Promise<{ posts: IPost[]; totalCount: number }> {
    // 정렬 필드를 기준으로 매핑
    const sortFieldMapping = {
      time: "createdAt", // 'time'으로 통합하여 사용
      view: "views", // 조회순
      like: "likes", // 추천순
    };

    // MongoDB 정렬 방향 설정
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    // 정렬 객체 생성
    const sortOptions = {};
    const sortField = sortFieldMapping[sortBy];
    sortOptions[sortField] = sortDirection;

    let posts = await PostModel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "user_id",
        select: "nickname profile_url _id state",
      })
      .exec();

    const totalCount = await PostModel.countDocuments(query);

    posts = posts.map((post) => ({
      ...post.toObject(), // Mongoose 문서를 일반 객체로 변환
      user: {
        nickname: post.user_id.nickname,
        profile_url: post.user_id.profile_url,
        _id: post.user_id._id,
        state: post.user_id.state,
      },
    }));

    return { posts, totalCount };
  }

  // 게시글 삭제 전 게시글 일괄 찾기
  async findMany(postNumbers: number[]): Promise<IPost[]> {
    return await PostModel.find({ post_number: { $in: postNumbers } })
      .populate({ path: "user_id", select: "nickname profile_url _id state" })
      .exec();
  }

  // 게시글 일괄 삭제
  async deleteMany(postNumbers: number[]): Promise<void> {
    const updateQuery = {
      $set: {
        deletedAt: new Date(),
      },
    };

    await PostModel.updateMany(
      { post_number: { $in: postNumbers } },
      updateQuery,
    ).exec();
  }
}

export default new PostRepository();
