import { DataSource } from "typeorm";
import { User } from "./entity/User"; // (TODO: 사용자 엔티티 경로를 확인하고 필요 시 수정하세요)

/**
 * TypeORM 데이터베이스 연결 설정 객체 (DataSource)
 * .env 파일의 환경 변수를 사용하여 PostgreSQL에 연결합니다.
 */
export const AppDataSource = new DataSource({
    // 1. 드라이버 타입: PostgreSQL
    type: "postgres",

    // 2. 접속 호스트, 포트, 사용자, 비밀번호, 데이터베이스 이름 설정
    host: process.env.DB_HOST,
    // 환경 변수는 문자열이므로 숫자로 변환합니다. 기본값은 5432입니다.
    port: parseInt(process.env.DB_PORT || "5432"), 
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    
    // 3. 엔티티 목록: TypeORM이 데이터베이스 테이블로 매핑할 클래스 목록
    // (TODO: 프로젝트의 모든 엔티티를 여기에 추가해야 합니다.)
    entities: [User], 
    
    // 4. 스키마 동기화 (개발 환경에서만 사용)
    // 서버가 시작될 때 엔티티를 기반으로 테이블을 자동 생성/수정합니다.
    synchronize: true, 

    // 5. 로깅: TypeORM이 실행하는 SQL 쿼리를 콘솔에 출력할지 설정합니다.
    logging: false, // 개발 시 디버깅을 위해 true로 설정할 수 있습니다.
});

/**
 * 데이터베이스 연결을 초기화하고 성공/실패를 처리하는 비동기 함수
 */
export async function initializeDatabase() {
    try {
        await AppDataSource.initialize();
        console.log("🚀 PostgreSQL 데이터베이스 연결에 성공했습니다.");
        return AppDataSource;
    } catch (error) {
        console.error("❌ PostgreSQL 데이터베이스 연결 오류:", error);
        // 연결에 실패하면 서버를 시작하지 않고 프로세스를 종료합니다.
        process.exit(1);
    }
}