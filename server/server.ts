import 'dotenv/config'; // 1. dotenv 설정 로드 (CommonJS의 require 대신 import 'dotenv/config' 사용)
import express, { Request, Response } from 'express';
import cors from 'cors'; // 2. CORS 모듈 불러오기

const app = express();

// 환경 변수에서 포트 가져오기 (없으면 3000 사용)
const port = process.env.PORT || 3000;
// 환경 변수에서 프론트엔드 URL 가져오기
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'; 

// 2. 미들웨어 설정
// JSON 요청 본문 파싱
app.use(express.json());

// CORS 미들웨어 적용: 개발 환경에서 프론트엔드 주소만 허용
app.use(cors({
    origin: frontendUrl, 
    credentials: true, // 쿠키/인증 정보 교환 허용
}));

// 3. 기본 라우트 설정
app.get('/', (req: Request, res: Response) => {
    res.send('백엔드 서버가 성공적으로 작동 중입니다! (TypeScript)');
});

app.get('/api/users', (req: Request, res: Response) => {
    // 실제 데이터베이스 로직이 들어갈 곳
    // 프론트엔드에서 이 API (http://localhost:3000/api/users)로 요청하게 됩니다.
    const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
    res.json(users);
});

// 4. 서버 리스닝
app.listen(port, () => {
    console.log(`✅ 서버가 http://localhost:${port} 에서 실행 중입니다.`);
    console.log(`🌎 CORS 허용 출처: ${frontendUrl}`);
});