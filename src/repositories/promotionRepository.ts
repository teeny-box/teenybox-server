import PromotionModel, { IPromotion } from "../models/promotionModel";
import { CreatePromotionDTO, UpdatePromotionDTO } from "../dtos/promotionDto";
import { FilterQuery } from "mongoose";

class promotionRepository {
  // 게시글 생성
  async create(promotionData: CreatePromotionDTO): Promise<IPromotion> {
    // 최신 게시글의 promotion_number 조회
    const latestPromotion = await PromotionModel.findOne().sort({
      promotion_number: -1,
    });

    // 최신 게시글의 promotion_number가 있다면 그 값에 1을 더하고, 없다면 1로 설정
    const nextPromotionNumber =
      latestPromotion && latestPromotion.promotion_number
        ? latestPromotion.promotion_number + 1
        : 1;

    promotionData.promotion_number = nextPromotionNumber;

    const promotion = new PromotionModel(promotionData);
    return await promotion.save();
  }

  // 게시글 수정
  async update(
    promotion_number: number,
    updateData: UpdatePromotionDTO,
  ): Promise<IPromotion | null> {
    return await PromotionModel.findOneAndUpdate(
      { promotion_number: promotion_number },
      updateData,
      {
        new: true,
      },
    );
  }

  // 게시글 전체 조회 & 페이징 + 게시글 댓글 + 정렬
  async findAll(
    skip: number,
    limit: number,
    sortBy: string,
    sortOrder: "asc" | "desc",
    filter: FilterQuery<IPromotion>,
  ): Promise<{
    promotions: Array<IPromotion & { commentsCount: number }>;
    totalCount: number;
  }> {
    // await this.migrateCategoryField();

    const totalCount = await PromotionModel.countDocuments(filter);

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

    const aggregationResult = await PromotionModel.aggregate([
      {
        $match: {
          deletedAt: { $eq: null },
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "promotion",
          as: "comments",
        },
      },
      {
        $addFields: {
          commentsCount: { $size: "$comments" },
        },
      },
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

    const promotions = aggregationResult.map((promotion) => ({
      ...promotion,
      user: {
        nickname: promotion.user.nickname,
        profile_url: promotion.user.profile_url,
        state: promotion.user.state,
      },
      commentsCount: promotion.commentsCount,
    }));

    return { promotions, totalCount };
  }

  // 게시글 번호로 조회
  async findByPromotionNumber(
    promotionNumber: number,
  ): Promise<IPromotion | null> {
    return await PromotionModel.findOne({ promotion_number: promotionNumber })
      .populate("user_id", "nickname profile_url state")
      .exec();
  }

  // 특정 user의 게시글 조회 + 갯수 count + 정렬
  async findPromotionsByUserId(
    userId: string,
    skip: number,
    limit: number,
    sortBy: string,
    sortOrder: "asc" | "desc",
  ): Promise<{ promotions: IPromotion[]; totalCount: number }> {
    // 게시글 총 갯수를 가져오는 쿼리
    const totalCount = await PromotionModel.countDocuments({
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

    const promotions = await PromotionModel.find({
      user_id: userId,
      deletedAt: null,
    })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate("user_id", "nickname profile_url state")
      .exec();

    return { promotions, totalCount };
  }

  // 게시글 삭제
  async deleteByPromotionNumber(
    promotionNumber: number,
  ): Promise<IPromotion | null> {
    const promotionToDelete = await PromotionModel.findOneAndUpdate(
      { promotion_number: promotionNumber },
      { deletedAt: new Date() },
      { new: true },
    );
    return promotionToDelete;
  }

  // 통합 검색
  async findByQuery(
    query: object,
    skip: number,
    limit: number,
    sortBy: string,
    sortOrder: "asc" | "desc",
  ): Promise<{ promotions: IPromotion[]; totalCount: number }> {
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

    // 기본 정렬이 같을 경우 createdAt으로 추가 정렬
    if (sortField !== "createdAt") {
      sortOptions["createdAt"] = -1; // 최신순
    }

    let promotions = await PromotionModel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "user_id",
        select: "nickname profile_url _id state",
      })
      .exec();

    const totalCount = await PromotionModel.countDocuments(query);

    promotions = promotions.map((promotion) => ({
      ...promotion.toObject(), // Mongoose 문서를 일반 객체로 변환
      user: {
        nickname: promotion.user_id.nickname,
        profile_url: promotion.user_id.profile_url,
        _id: promotion.user_id._id,
        state: promotion.user_id.state,
      },
    }));

    return { promotions, totalCount };
  }

  // 게시글 삭제 전 게시글 일괄 찾기
  async findMany(promotionNumbers: number[]): Promise<IPromotion[]> {
    return await PromotionModel.find({
      promotion_number: { $in: promotionNumbers },
    })
      .populate({ path: "user_id", select: "nickname profile_url _id state" })
      .exec();
  }

  // 게시글 일괄 삭제
  async deleteMany(promotionNumbers: number[]): Promise<void> {
    const updateQuery = {
      $set: {
        deletedAt: new Date(),
      },
    };
    await PromotionModel.updateMany(
      { promotion_number: { $in: promotionNumbers } },
      updateQuery,
    ).exec();
  }

  // 카테고리 필드 마이그레이션 메서드
  // private async migrateCategoryField(): Promise<void> {
  //   try {
  //     // 모든 게시물 중 category 필드가 "공지"인 게시글들을 "기타"로 변경
  //     await PromotionModel.updateMany(
  //       { category: "공지" },
  //       { $set: { category: "기타" } },
  //     );

  //     console.log("Migration completed successfully");
  //   } catch (error) {
  //     console.error(`Migration failed: ${error.message}`);
  //   }
  // }
}

export default new promotionRepository();
