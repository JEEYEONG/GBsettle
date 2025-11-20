import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

/**
 * 사용자 정보를 저장하는 데이터베이스 엔티티
 * TypeORM은 이 클래스를 기반으로 PostgreSQL 테이블을 생성합니다.
 */
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({ default: true })
    isActive: boolean;
}