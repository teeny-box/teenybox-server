import { UserModel, IUser } from "../models/userModel";
import { ShowModel } from "../models/showModel";
import { UserRequestDTO } from "../dtos/userDto";
import { ROLE } from "../common/enum/user-role.enum";
import { STATE } from "../common/enum/user-state.enum";
import { Order } from "../common/enum/order.enum";

class UserRepository {
  // 사용자 생성
  async createUser(userData: UserRequestDTO): Promise<void> {
    const createUserData = {
      ...userData,
      role: ROLE.USER,
      state: STATE.JOINED,
    };

    const existingUser = await UserModel.findOne({ user_id: userData.user_id });
    if (existingUser) {
      Object.assign(existingUser, createUserData);
      existingUser.deletedAt === null;
      await existingUser.save();
    } else {
      const user = new UserModel(createUserData);
      await user.save();
    }
  }

  // 닉네임 중복 확인
  async getUserByNickname(nickname: string): Promise<IUser | null> {
    return await UserModel.findOne({ nickname });
  }

  // 회원정보 조회 (소셜 고유 ID)
  async getUserById(userId: string): Promise<IUser | null> {
    return await UserModel.findOne({ user_id: userId });
  }

  // 회원정보 수정
  async updateUser(
    userId: string,
    updateUserData: UserRequestDTO,
  ): Promise<void> {
    return await UserModel.findByIdAndUpdate(userId, updateUserData);
  }

  // 회원정보 삭제 (state '탈퇴'로 변경, 탈퇴일 추가)
  async deleteUser(userId: string): Promise<void> {
    return await UserModel.findByIdAndUpdate(userId, {
      state: STATE.WITHDRAWN,
      deletedAt: new Date(),
    });
  }

  // 유저 찜 목록
  async getBookmarks(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ validShows: Array<object>; totalCount: number }> {
    const user = await UserModel.findById(userId);
    const showIds = user.dibs.reverse();
    const totalCount = showIds.length;

    const paginatedShowIds = showIds.slice((page - 1) * limit, page * limit);

    const validShows = [];
    for (const showId of paginatedShowIds) {
      const show = await ShowModel.findOne({ showId });
      if (show) {
        validShows.push({
          showId: show.showId,
          title: show.title,
          poster: show.poster,
          location: show.location,
          startDate: show.start_date,
          endDate: show.end_date,
          price: show.price,
          state: show.state,
        });
      } else {
        await UserModel.findByIdAndUpdate(userId, { $pull: { dibs: showId } });
      }
    }

    return { validShows, totalCount };
  }

  // 찜 여부
  async isBookmarked(userId: string, showId: string): Promise<boolean> {
    const user = await UserModel.findById(userId);

    const isBookmarked = user.dibs.includes(showId);

    return isBookmarked;
  }

  // 찜 추가(공연 상세 페이지)
  async saveShow(userId: string, showId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { $addToSet: { dibs: showId } });
  }

  // 찜 취소(공연 상세 페이지)
  async cancelShow(userId: string, showId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { $pull: { dibs: showId } });
  }

  // 찜 취소(유저 찜 목록)
  async cancelBookmarks(userId: string, showIds: string[]): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { dibs: { $in: showIds } },
    });
  }

  /* 관리자 페이지 */

  // 전체 회원 목록 조회
  async getUsers(
    skip: number,
    limit: number,
    order: Order,
  ): Promise<{ users: IUser[]; totalUsers: number }> {
    const users = await UserModel.find()
      .sort({ createdAt: order })
      .skip(skip)
      .limit(limit)
      .select(
        "_id user_id social_provider nickname role state createdAt deletedAt",
      );
    const totalUsers = await UserModel.countDocuments();

    return { users, totalUsers };
  }

  // 유저 권한 변경
  async changeUserRole(user: IUser, newRole: ROLE): Promise<void> {
    await UserModel.findByIdAndUpdate(user._id, {
      role: newRole,
    });
  }

  // 선택한 회원 탈퇴
  async deleteUsers(userIds: string[]): Promise<void> {
    await Promise.all(
      userIds.map(async (userId) => {
        const user = await UserModel.findById(userId);
        if (user) {
          await UserModel.findByIdAndUpdate(userId, {
            state: STATE.WITHDRAWN,
            deletedAt: new Date(),
          });
        }
      }),
    );
  }
}

export default new UserRepository();
