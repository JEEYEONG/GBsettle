// 증빙 유형
export type ReceiptType = '카드매출전표' | '세금계산서' | '현금영수증' | '간이영수증' | '';

// 수입 유형
export type IncomeType = '현금' | '카드' | '배달앱(플랫폼)' | '계좌이체';

// 매출 채널
export type SalesChannel = '홀' | '포장' | '배달앱A' | '배달앱B';

// 비용 성격
export type CostNature = '고정비' | '변동비';

// 계정 과목 (기본값, 사용자가 추가/편집 가능)
export interface AccountCategory {
  id: string;
  name: string;
  nature: CostNature; // 고정비 또는 변동비
  isCustom: boolean; // 사용자가 추가한 항목인지
}

// 수익(매출) 거래
export interface IncomeTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  vendor?: string;
  receiptType?: ReceiptType;
  note?: string;
  amount: number; // 총 수입 금액 (부가세 포함)
  incomeType: IncomeType;
  salesChannel?: SalesChannel;
  supplyAmount?: number; // 공급가액
  vat?: number; // VAT
}

// 비용(지출) 거래
export interface ExpenseTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  vendor?: string;
  receiptType?: ReceiptType;
  note?: string;
  amount: number; // 총 비용 금액 (부가세 포함)
  category: string; // 계정 과목 ID
  nature: CostNature; // 계정 과목에 따라 자동 설정
}

// 모든 거래 타입
export type Transaction = IncomeTransaction | ExpenseTransaction;
export type TransactionType = 'income' | 'expense';

// 저장소에 저장되는 데이터 구조
export interface AppData {
  transactions: Transaction[];
  accountCategories: AccountCategory[];
}

