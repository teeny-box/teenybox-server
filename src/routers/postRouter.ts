import express from "express";
import asyncHandler from "../common/utils/asyncHandler";
import postController from "../controllers/postController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import * as postDto from "../dtos/postDto";
import { authenticateUser } from "../middlewares/authUserMiddlewares";

const router = express.Router();

// 게시글 작성
router.post(
  "/",
  authenticateUser,
  validationMiddleware(postDto.CreatePostDTO),
  asyncHandler(postController.createPost),
);

// 게시글 수정
router.put(
  "/:postNumber",
  authenticateUser,
  validationMiddleware(postDto.UpdatePostDTO),
  asyncHandler(postController.updatePost),
);

// 모든 게시글 조회
router.get("/", asyncHandler(postController.getAllPosts));

// 통합검색
router.get("/search", asyncHandler(postController.searchPosts));

// 게시글 상세 조회
router.get("/:postNumber", asyncHandler(postController.getPostByNumber));

// 사용자별 게시글 조회
router.get("/user/:userId", asyncHandler(postController.getPostsByUserId));

// 게시글 일괄 삭제
router.delete(
  "/bulk",
  authenticateUser,
  asyncHandler(postController.deleteMultiplePosts),
);

// 게시글 삭제
router.delete(
  "/:postNumber",
  authenticateUser,
  asyncHandler(postController.deletePostByNumber),
);

// 게시글 추천
router.post(
  "/:postNumber/like",
  authenticateUser,
  asyncHandler(postController.likePost),
);

// 게시글 추천 취소
router.delete(
  "/:postNumber/like",
  authenticateUser,
  asyncHandler(postController.cancelLikePost),
);

export default router;

/**
 * @swagger
 * tags:
 *   - name: Post
 *
 * /posts:
 *   post:
 *     tags:
 *       - Post
 *     summary: 새 게시물 추가
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *     responses:
 *       '201':
 *         description: 게시물이 성공적으로 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post_number:
 *                   type: integer
 *                   description: 게시물 고유 식별자
 *                 user_id:
 *                   type: string
 *                   description: 사용자 ID
 *                 title:
 *                   type: string
 *                   description: 게시물 제목
 *                 content:
 *                   type: string
 *                   description: 게시물 내용
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: 게시글에 사용될 태그 배열
 *                 _id:
 *                   type: string
 *                   description: 게시물의 고유 MongoDB ID
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: 게시물 생성 시간
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: 게시물 마지막 수정 시간
 *                 __v:
 *                   type: integer
 *                   description: 버전
 *               example:
 *                 post_number: 37
 *                 user_id: "654a4cfc2a8ed874281b68b1"
 *                 title: "응답 확인 예시용 제목"
 *                 content: "응답 확인 예시용 내용"
 *                 _id: "65a89e82c3180cd22b2fdf2c"
 *                 createdAt: "2024-01-18T03:44:02.952Z"
 *                 updatedAt: "2024-01-18T03:44:02.952Z"
 *                 __v: 0
 *       '401':
 *         description: 사용자 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "사용자 인증이 필요합니다."
 *       '500':
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글 생성에 실패했습니다."
 *
 *   get:
 *     tags:
 *       - Post
 *     summary: 모든 게시물 조회
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: post_number
 *           description: 정렬 기준
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           default: desc
 *           description: asc = 오름차순, desc = 내림차순
 *       - in: query
 *         name: isFixed
 *         schema:
 *           type: string
 *           default: 일반게시글, 고정게시글 구분 없음
 *           description: 일반또는 고정 입력
 *     responses:
 *       '200':
 *         description: 게시물 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostResponse'
 *       '404':
 *         description: 게시물 리스트를 조회할 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "입력이 잘못되었습니다."
 *
 * /posts/{postNumber}:
 *   put:
 *     tags:
 *       - Post
 *     summary: 기존 게시물 업데이트
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postNumber
 *         required: true
 *         schema:
 *           type: integer
 *           description: 게시물 고유 식별자
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePostRequest'
 *     responses:
 *       '200':
 *         description: 게시물이 성공적으로 업데이트됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post_number:
 *                   type: integer
 *                   description: 게시물 고유 식별자
 *                 user_id:
 *                   type: string
 *                   description: 사용자 ID
 *                 title:
 *                   type: string
 *                   description: 게시물 제목
 *                 content:
 *                   type: string
 *                   description: 게시물 내용
 *                 _id:
 *                   type: string
 *                   description: 게시물의 고유 MongoDB ID
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: 게시물 생성 시간
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: 게시물 마지막 수정 시간
 *                 __v:
 *                   type: integer
 *                   description: 버전
 *               example:
 *                 post_number: 37
 *                 user_id: "654a4cfc2a8ed874281b68b1"
 *                 title: "업데이트된 게시물 제목"
 *                 content: "업데이트된 게시물 내용"
 *                 tags: ["태그1", "태그2"]
 *                 _id: "65a89e82c3180cd22b2fdf2c"
 *                 createdAt: "2024-01-18T03:44:02.952Z"
 *                 updatedAt: "2024-01-18T04:00:00.000Z"
 *                 __v: 1
 *       '401':
 *         description: 사용자 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글 수정/고정 권한이 없습니다."
 *       '402':
 *         description: 로그인 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인된 사용자만 가능합니다."
 *       '404':
 *         description: 게시글을 찾을 수 없습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글을 찾을 수 없습니다."
 *   get:
 *     tags:
 *       - Post
 *     summary: 특정 게시물 조회
 *     parameters:
 *       - in: path
 *         name: postNumber
 *         required: true
 *         schema:
 *           type: integer
 *           description: 조회할 게시물 번호
 *       - in: query
 *         name: usage
 *         schema:
 *           type: string
 *           default: not-view
 *           description: 수정을 위해서는 fix 등의 값을 사용. (뭘 넣어도 상관은 없음)
 *     responses:
 *       '200':
 *         description: 게시물 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post_number:
 *                   type: integer
 *                   description: 게시물 고유 식별자
 *                 user_id:
 *                   type: string
 *                   description: 사용자 ID
 *                 title:
 *                   type: string
 *                   description: 게시물 제목
 *                 content:
 *                   type: string
 *                   description: 게시물 내용
 *                 _id:
 *                   type: string
 *                   description: 게시물의 고유 MongoDB ID
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: 게시물 생성 시간
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: 게시물 마지막 수정 시간
 *                 __v:
 *                   type: integer
 *                   description: 버전
 *               example:
 *                 post_number: 37
 *                 user_id: "654a4cfc2a8ed874281b68b1"
 *                 title: "업데이트된 게시물 제목"
 *                 content: "업데이트된 게시물 내용"
 *                 tags: ["태그1", "태그2"]
 *                 _id: "65a89e82c3180cd22b2fdf2c"
 *                 createdAt: "2024-01-18T03:44:02.952Z"
 *                 updatedAt: "2024-01-18T04:00:00.000Z"
 *                 __v: 1
 *       '404':
 *         description: 게시글을 찾을 수 없습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글을 찾을 수 없습니다."
 *
 *   delete:
 *     tags:
 *       - Post
 *     summary: 특정 게시물 삭제
 *     parameters:
 *       - in: path
 *         name: postNumber
 *         required: true
 *         schema:
 *           type: integer
 *           description: 삭제할 게시물 번호
 *     responses:
 *       '200':
 *         description: 게시물 삭제 성공
 *       '401':
 *         description: 사용자 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글 삭제 권한이 없습니다."
 *       '404':
 *         description: 게시글을 찾을 수 없습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글을 찾을 수 없습니다."
 *
 * /posts/bulk:
 *   delete:
 *     tags:
 *       - Post
 *     summary: 여러 게시물 일괄 삭제
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postNumbers:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 삭제할 게시물 번호들
 *             example:
 *               postNumbers: [1, 2, 3]
 *     responses:
 *       '200':
 *         description: 게시물들이 성공적으로 삭제됨
 *       '401':
 *         description: 사용자 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글 삭제 권한이 없습니다."
 *
 * /posts/user/{userId}:
 *   get:
 *     tags:
 *       - Post
 *     summary: 특정 사용자의 게시물 모두 조회, 이제 totalCount도 제공
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           description: 조회할 사용자의 ID
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           description: 조회할 페이지 번호
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           description: 페이지 당 표시할 게시물 수
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           default: 'time'
 *           enum: ['time', 'view', 'like']
 *           description: 정렬 기준
 *       - in: query
 *         name: sortOrder
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: 'desc'
 *           description: 정렬 순서 (오름차순 'asc' 혹은 내림차순 'desc')
 *     responses:
 *       '200':
 *         description: 사용자의 게시물 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PostResponse'
 *                 totalCount:
 *                   type: integer
 *                   description: 전체 게시물 수
 *       '404':
 *         description: 사용자를 찾을 수 없음
 *
 * /posts/search:
 *   get:
 *     tags:
 *       - Post
 *     summary: 게시글을 제목또는 태그로 검색
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: ['title', 'tag']
 *         description: 검색할 유형
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: 검색어
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 게시글 수
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: 'time'
 *           enum: ['time', 'view', 'like']
 *         description: 결과를 정렬할 기준 ('time', 'view', 'like')
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           default: 'desc'
 *           enum: ['asc', 'desc']
 *         description: asc - 오름차순, desc - 내림차순
 *     responses:
 *       200:
 *         description: 검색 결과 반환
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   - promotion_number: 1
 *                     title: "검색된 게시글 제목"
 *                     content: "검색된 게시글 내용"
 *                     tags: ["태그1", "태그2"]
 *                     createdAt: "2023-01-01T00:00:00.000Z"
 *                     updatedAt: "2023-01-01T00:00:00.000Z"
 *       '400':
 *         description: 검색이 제대로 이루어지지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "타입과 검색어를 입력하세요."
 *
 * /posts/{postNumber}/like:
 *   post:
 *     tags:
 *       - Post
 *     summary: 게시글 추천
 *     description: 지정된 게시글에 대한 추천을 추가합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postNumber
 *         required: true
 *         schema:
 *           type: integer
 *         description: 추천할 게시글의 고유 식별자
 *     responses:
 *       200:
 *         description: 게시글 추천 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 성공 메시지
 *                 post_number:
 *                   type: integer
 *                   description: 게시글 고유 식별자
 *                 likes:
 *                   type: integer
 *                   description: 현재 추천 수
 *               example:
 *                 message: 게시글이 성공적으로 추천되었습니다.
 *                 post_number: 37
 *                 likes: 10
 *       '404':
 *         description: 게시글을 찾을 수 없습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글을 찾을 수 없습니다."
 *       '405':
 *         description: 이미 추천한 게시글
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이미 추천한 게시글입니다."
 *
 *   delete:
 *     tags:
 *       - Post
 *     summary: 게시글 추천 취소
 *     description: 지정된 게시글에 대한 추천을 취소합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postNumber
 *         required: true
 *         schema:
 *           type: integer
 *         description: 추천할 게시글의 고유 식별자
 *     responses:
 *       200:
 *         description: 게시글 추천 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 성공 메시지
 *                 post_number:
 *                   type: integer
 *                   description: 게시글 고유 식별자
 *                 likes:
 *                   type: integer
 *                   description: 현재 추천 수
 *               example:
 *                 message: 게시글 추천이 성공적으로 취소되었습니다.
 *                 post_number: 37
 *                 likes: 10
 *       '404':
 *         description: 게시글을 찾을 수 없습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글을 찾을 수 없습니다."
 *       '405':
 *         description: 추천되지 않은 게시글
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "아직 추천하지 않은 게시글 입니다."
 * components:
 *   schemas:
 *     CreatePostRequest:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           description: 게시물 제목
 *         content:
 *           type: string
 *           description: 게시물 내용
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 게시글에 사용될 태그 배열
 *         is_fixed:
 *           type: string
 *           enum: ["일반", "고정"]
 *           description: 게시글 고정 여부
 *     UpdatePostRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: 업데이트된 게시물 제목
 *           maxLength: 100
 *         content:
 *           type: string
 *           description: 업데이트된 게시물 내용
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 게시글에 사용될 태그 배열
 *         is_fixed:
 *           type: string
 *           enum: ["고정", "일반"]
 *           description: 게시글 고정 여부
 *     PostResponse:
 *       type: object
 *       properties:
 *         post_number:
 *           type: integer
 *           description: 게시물 고유 식별자
 *         title:
 *           type: string
 *           description: 게시물 제목
 *         content:
 *           type: string
 *           description: 게시물 내용
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성 일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 최종 수정 일시
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 게시글에 사용될 태그 배열
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
