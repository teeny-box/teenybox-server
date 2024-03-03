# 🎬 Teeny Box : 연극 정보 공유 서비스

<img src="https://github.com/teeny-box/teenybox-server/assets/122986061/83b8951d-0393-4ed4-b07c-1e070ce51a88" width=400 />
<br/>

다양한 연극 정보를 둘러보고 싶다면❓<br/>
소규모 연극을 홍보하고 싶다면❓<br/>
연극을 좋아하는 사람들과 소통하고 싶다면❓<br/>

### Teeny Box를 방문하세요!

<br/>

## 🌐 서비스 페이지

<b>[https://teeny-box.com](https://teeny-box.com)</b>

<img width="1266" alt="readme-mainpage" src="https://github.com/teeny-box/teenybox-server/assets/122986061/2037dd9b-3a5f-44c7-a4d9-975abfb2fcfc">

<br/>

## 🖌️ 기획 / 디자인 / api 문서

- [Figma](https://www.figma.com/file/XuChAzwtMnCB4G2Z5Sk5H3/elice-study-2nd?type=design&node-id=0-1&mode=design&t=Wge6Q0gsllflDcvT-0)
- [Swagger](https://teeny-box.com/api-docs/)

<br/>

## 📄 스토리보드

![readme-story-board](https://github.com/teeny-box/teenybox-server/assets/122986061/c64a2582-5f33-432a-9cbf-1aa1731d8652)

<br/>

## 📄 ERD

![TeenyBox_erd](https://github.com/teeny-box/teenybox-server/assets/122986061/948c12bd-b3ec-4ad7-8cf2-7adcc9d9f45d)

<br/>

## 🛠 기술 스택

### Front-end

<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/createreactapp-09D3AC?style=for-the-badge&logo=createreactapp&logoColor=pink"> <img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=Sass&logoColor=pink"> <img src="https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=MUI&logoColor=white"> <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">

### Back-end

<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
<img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
<img src="https://img.shields.io/badge/mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white"> <br/> <img src="https://img.shields.io/badge/jwt-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"> <img src="https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white"> <img src="https://img.shields.io/badge/prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white"> <img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"> <img src="https://img.shields.io/badge/pm2-2B037A?style=for-the-badge&logo=pm2&logoColor=white">

<br/>

## ⚙ 아키텍쳐

![readme-Architecture](https://github.com/teeny-box/teenybox-server/assets/122986061/8e887c34-0b21-4688-8dc1-73e4faa451a8)

<br/>

## 🗂️ 폴더 구조

```
📦
├─ .github
│  └─ workflows     # GitHub Actions 설정
│     ├─ deploy.yml
│     ├─ deploy-dev.yml
│     └─ lint.yml
├─ bin              # 배포 스크립트
│  ├─ deploy-prod.sh
│  └─ deploy.sh
└─ src
   ├─ batch         # 배치 작업
   │  ├─ common
   │  ├─ migration
   │  ├─ types
   │  ├─ utils
   │  └─ index.ts
   ├─ common        # 공통 소스 디렉토리
   │  ├─ enum       # enum 정의
   │  ├─ error      # 커스텀 에러 정의
   │  ├─ query
   │  └─ utils
   ├─ config        # 설정 파일 모음
   │  ├─ s3config.ts
   │  └─ swagger.ts
   ├─ controllers   # 컨트롤러 모듈
   ├─ dtos          # 데이터 전송 객체 모듈
   ├─ interfaces    # 인터페이스 모듈
   ├─ middlewares   # 미들웨어 모듈
   ├─ models        # 모델 모듈
   ├─ repositories  # 레포지토리 모듈
   ├─ routers       # 라우터 모듈
   ├─ services      # 서비스 모듈
   └─ app.ts
```

<br/>

## ✔️ 주요 기능

|                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **메인페이지**                                                                                                                                                                                                           |
| <img width="500" alt="readme-main1" src="https://github.com/teeny-box/teenybox-server/assets/122986061/d8a270af-73eb-4621-b89b-43e997f2ac3b"> <br/> 검색창을 통해 연극과 게시물을 검색할 수 있습니다.                                                                                                                   |
| <img width="500" alt="readme-main2" src="https://github.com/teeny-box/teenybox-server/assets/122986061/6c6a7d2a-353e-4eea-aacf-26ba7b7ea7d5"> <br/> 슬라이드를 넘기면서 연극을 선택하고 클릭하면 연극 상세페이지로 이동할 수 있습니다.                                                                                  |
| <img width="500" alt="readme-main3" src="https://github.com/teeny-box/teenybox-server/assets/122986061/fe6a3d3a-0d52-43fe-aefd-2e09cdf560d0"> <br/> 회원분들의 실시간 리뷰와 지역별 신작을 확인할 수 있습니다.                                                                                                          |
| <img width="500" alt="readme-main4" src="https://github.com/teeny-box/teenybox-server/assets/122986061/c3b7aa3c-db77-4836-8aff-9c25be3949aa"> <br/> 인기 소규모 연극을 볼 수 있으며, 푸터에서는 피드백을 받을 수 있는 구글 폼으로 이동할 수 있습니다.                                                                   |
| **회원가입/로그인**                                                                                                                                                                                                      |
| <img width="500" alt="readme-login" src="https://github.com/teeny-box/teenybox-server/assets/122986061/9729d629-b6e0-442c-9fa7-8722cd919119"> <br/> 카카오, 네이버, 구글 등 소셜로그인을 통해 간편하게 로그인할 수 있습니다.                                                                                            |
| <img width="500" alt="readme-register" src="https://github.com/teeny-box/teenybox-server/assets/122986061/8e63d549-ce3f-474c-9be3-aff9c2a5e852"> <br/> 소셜로그인 후 프로필사진, 닉네임, 선호지역 등의 간단한 추가 정보를 입력하여 복잡한 절차 없이 회원가입할 수 있습니다.                                             |
| **연극 리스트 페이지**                                                                                                                                                                                                   |
| <img width="500" alt="readme-play1" src="https://github.com/teeny-box/teenybox-server/assets/122986061/baac34bb-873a-4b04-9c6d-b7e17be35918"> <br/> 여러 조건을 설정하여 원하는 연극 리스트를 볼 수 있습니다.                                                                                                           |
| <img width="500" alt="readme-play5" src="https://github.com/teeny-box/teenybox-server/assets/122986061/f10c99da-f504-48c0-80f0-5ea1f0bfef5d"> <br/> 외부 API로부터 가져온 연극 목록을 리스트로 표시하고, 페이지 네이션을 통해 사용자에게 보여줍니다.                                                                    |
| **연극 디테일 페이지**                                                                                                                                                                                                   |
| <img width="500" alt="readme-play2" src="https://github.com/teeny-box/teenybox-server/assets/122986061/1adc283a-65fc-4956-8a67-2f9c78111282"> <br/> 해당 연극의 정보를 확인할 수 있고 공유, 찜, 예매사이트로 이동이 가능 합니다.                                                                                        |
| <img width="500" alt="readme-play3" src="https://github.com/teeny-box/teenybox-server/assets/122986061/4d42ab63-6096-4790-bdd0-5f05676b94a8"> <br/> 회원분들의 후기를 확인할 수 있습니다.                                                                                                                               |
| <img width="500" alt="readme-play4" src="https://github.com/teeny-box/teenybox-server/assets/122986061/1f1dca94-a806-40a1-b2c3-43534ee5b737"> <br/> 자신의 후기를 사진과 함께 올릴 수 있고 평점을 줄 수 있습니다.                                                                                                       |
| **홍보**                                                                                                                                                                                                                 |
| <img width="500" alt="readme-promotion" src="https://github.com/teeny-box/teenybox-server/assets/122986061/b8ea1bce-3b9e-4293-98d0-49796d4bbf8c"> <br/> 홍보 게시판으로 사용자들은 다양한 연극 정보를 쉽게 접할 수 있고, 연극 제작진과 지인들은 플랫폼을 통해 자신의 작품이나 관심 있는 연극 작품을 홍보할 수 있습니다. |
| **홍보 게시글 작성**                                                                                                                                                                                                     |
| <img width="500" alt="readme-promotion2" src="https://github.com/teeny-box/teenybox-server/assets/122986061/43701379-a795-4913-ad01-1f386a3eb7f1"> <br/> 각 지역의 연극 정보(장소, 공연 기간, 기타 정보 등)를 자세하게 작성하여 연극 홍보를 할 수 있는 서비스를 제공합니다.                                             |
|                                                                                                                                                                                                                          |
| **커뮤니티**                                                                                                                                                                                                             |
| <img width="500" alt="readme-post" src="https://github.com/teeny-box/teenybox-server/assets/122986061/090000d1-87b3-4452-86f8-9573c5278c1f"> <br/> 연극이나 배우 등의 정보를 공유하고 자신의 경험을 나누는 등 자유롭게 소통할 수 있는 공간을 제공합니다.                                                                |
|                                                                                                                                                                                                                          |
| **커뮤니티 게시글 작성**                                                                                                                                                                                                 |
| <img width="500" alt="readme-post2" src="https://github.com/teeny-box/teenybox-server/assets/122986061/e856032c-9526-4d0d-95ef-9c820ca49b59"> <br/> 사용자들은 자신의 생각이나 경험을 공유하기 위해 커뮤니티에 게시글을 작성할 수 있습니다.                                                                             |
|                                                                                                                                                                                                                          |
| **댓글**                                                                                                                                                                                                                 |
| <img width="500" alt="readme-comment" src="https://github.com/teeny-box/teenybox-server/assets/122986061/4d3e4241-0b99-45a4-9241-f2ad6d2fb98b"> <br/> 게시글에 댓글을 작성하여 다른 사용자들과 의견을 공유하고 소통할 수 있어 더욱 활발한 커뮤니케이션이 이뤄질 수 있습니다.                                            |
| **마이 페이지**                                                                                                                                                                                                          |
| <img width="500" alt="readme-mypage1" src="https://github.com/teeny-box/teenybox-server/assets/122986061/f55b3658-a7c1-412f-9410-c82f216d5ec3"> <br/> 회원 정보를 확인하고 수정할 수 있으며, 필요할 경우 탈퇴도 가능합니다.                                                                                             |
| <img width="500" alt="readme-mypage3" src="https://github.com/teeny-box/teenybox-server/assets/122986061/f0b017f9-fe9d-48ce-8ece-f00aeb3900b5"> <br/> 사용자가 찜한 연극 목록을 확인할 수 있습니다.                                                                                                                     |
| <img width="500" alt="readme-mypage2" src="https://github.com/teeny-box/teenybox-server/assets/122986061/64595d70-253a-4d2b-9063-64b54f74785d"> <br/> 사용자가 작성한 리뷰, 게시글, 댓글 등을 모두 확인하고 선택하여 삭제할 수 있습니다.                                                                                |
| **관리자 페이지**                                                                                                                                                                                                        |
| <img width="500" alt="readme-admin1" src="https://github.com/teeny-box/teenybox-server/assets/122986061/c19c59a6-c259-4213-a28b-7f95e212b838"> <br/> 조회한 회원 정보나 후기, 게시글, 댓글을 원하는 경우 선택하여 삭제할 수 있습니다.                                                                                   |
| <img width="500" alt="readme-admin2" src="https://github.com/teeny-box/teenybox-server/assets/122986061/a340cbc1-3362-47f3-ac73-e2d79fcfe958"> <br/> 조회한 회원 정보나 후기, 게시글, 댓글을 원할 시 선택하여 삭제 가능합니다.                                                                                        |

<br/>

## 💻 팀원 소개

<table>
    <tr align="center">
        <td><B>Leader / Backend<B></td>
        <td><B>Backend<B></td>
        <td><B>Backend<B></td>
        <td><B>Frontend<B></td>
        <td><B>Frontend<B></td>
        <td><B>Frontend<B></td>
    </tr>
    <tr align="center">
        <td><B>이민섭<B></td>
        <td><B>허은리<B></td>
        <td><B>김동현<B></td>
        <td><B>이진이<B></td>
        <td><B>김성재<B></td>
        <td><B>소유빈<B></td>
    </tr>
    <tr align="center">
        <td>
            <img src="https://avatars.githubusercontent.com/u/103021300?size=100">
            <br>
            <a href="https://github.com/lms990108"><I>lms990108</I></a>
        </td>
        <td>
            <img src="https://avatars.githubusercontent.com/u/122986061?size=100">
            <br>
            <a href="https://github.com/eunli"><I>eunli</I></a>
        </td>
        <td>
            <img src="">
            <br>
            <a href="https://github.com/dongjangoon"><I>dongjangoon</I></a>
        </td>
        <td>
            <img src="">
            <br>
            <a href="https://github.com/jin-dooly"><I>jin-dooly</I></a>
        </td>
        <td>
            <img src="https://avatars.githubusercontent.com/u/141702982?size=100">
            <br>
            <a href="https://github.com/JMTcord"><I>JMTcord</I></a>
        </td>
        <td>
            <img src="https://avatars.githubusercontent.com/u/99963066?size=100">
            <br>
            <a href="https://github.com/kanujoa"><I>kanujoa</I></a>
        </td>
    </tr>
</table>
