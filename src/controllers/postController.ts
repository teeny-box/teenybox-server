import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authUserMiddlewares";
import PostService from "../services/postService";

class PostController {
  async createPost(req: AuthRequest, res: Response): Promise<void> {
    // 인증된 사용자의 정보가 있는지 확인합니다.
    if (!req.user) {
      res.status(402).json({ message: "로그인된 사용자만 가능합니다." });
      return;
    }

    try {
      const post = await PostService.create(req.body, req.user._id);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 게시글 수정
  async updatePost(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(402).json({ message: "로그인된 사용자만 가능합니다." });
      return;
    }

    const postNumber = Number(req.params.postNumber);
    const post = await PostService.update(postNumber, req.body, req.user._id);
    res.status(200).json(post);
  }

  // 게시글 전체 조회
  async getAllPosts(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || -1);
    const sortBy = String(req.query.sortBy) || "post_number";
    const sortOrder = String(req.query.sortOrder) === "desc" ? "desc" : "asc";
    const category = String(req.query.category);
    const is_fixed = String(req.query.isFixed);

    const posts = await PostService.getAllPosts(
      page,
      limit,
      sortBy,
      sortOrder,
      category,
      is_fixed,
    );
    res.status(200).json(posts);
  }

  // 게시글 번호로 상세조회
  async getPostByNumber(req: Request, res: Response): Promise<void> {
    const postnumber = Number(req.params.postNumber);
    const usage = String(req.query.usage) || "not-view";

    const post = await PostService.findByPostNumber(postnumber, usage);
    res.status(200).json(post);
  }

  // 유저 id로 게시글 검색 (리스트반환)
  async getPostsByUserId(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 0);
    const sortBy = (req.query.sortBy as string) || "time";
    const sortOrderParam = req.query.sortOrder as string | undefined;
    const sortOrder: "asc" | "desc" = sortOrderParam === "asc" ? "asc" : "desc"; // 유효하지 않은 값은 'desc'로 처리
    const { posts, totalCount } = await PostService.findPostsByUserId(
      req.params.userId,
      page,
      limit,
      sortBy,
      sortOrder,
    );

    res.status(200).json({ posts, totalCount });
  }

  // 통합 검색
  async searchPosts(req: Request, res: Response): Promise<void> {
    try {
      const type = req.query.type as string; // 'title' 또는 'tag'
      const query = req.query.query as string; // 검색어
      const page = Number(req.query.page || 1); // 페이지 번호, 기본값은 1
      const limit = Number(req.query.limit || 10); // 페이지 당 항목 수, 기본값은 10

      // 유효한 정렬 기준과 정렬 방향 확인
      const sortBy = (req.query.sortBy as string) || "time";
      const sortOrderParam = req.query.sortOrder as string | undefined;
      const sortOrder: "asc" | "desc" =
        sortOrderParam === "asc" ? "asc" : "desc"; // 유효하지 않은 값은 'desc'로 처리

      // 검색 유형과 검색어가 모두 제공되었는지 확인
      if (!type || !query) {
        res.status(400).json({ message: "타입과 검색어를 입력하세요." });
        return;
      }

      // 서비스 로직을 호출하여 검색 수행
      const searchResults = await PostService.searchPosts(
        type,
        query,
        page,
        limit,
        sortBy,
        sortOrder,
      );

      res.status(200).json(searchResults);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 게시글 삭제
  async deletePostByNumber(req: AuthRequest, res: Response): Promise<void> {
    const user = req.user;

    const post = await PostService.deleteByPostNumber(
      Number(req.params.postNumber),
      user,
    );
    res.status(200).json(post);
  }

  // 게시글 일괄 삭제
  async deleteMultiplePosts(req: AuthRequest, res: Response): Promise<void> {
    const user = req.user;
    const postNumbers = req.body.postNumbers;
    await PostService.deleteMany(postNumbers, user);
    res.status(200).json({ message: "게시글이 일괄 삭제 되었습니다." });
  }

  // 게시글 추천
  async likePost(req: AuthRequest, res: Response): Promise<void> {
    const postNumber = Number(req.params.postNumber);

    try {
      const updatedPost = await PostService.likePost(postNumber, req.user._id);
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 게시글 추천 취소
  async cancelLikePost(req: AuthRequest, res: Response): Promise<void> {
    const postNumber = Number(req.params.postNumber);

    try {
      const updatedPost = await PostService.cancelLikePost(
        postNumber,
        req.user._id,
      );
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new PostController();
