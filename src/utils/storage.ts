import { AppData, AccountCategory } from '../types';

const STORAGE_KEY = 'settle-app-data';

// 기본 계정 과목
const DEFAULT_CATEGORIES: AccountCategory[] = [
  { id: '1', name: '식재료비', nature: '변동비', isCustom: false },
  { id: '2', name: '인건비', nature: '고정비', isCustom: false },
  { id: '3', name: '임차료', nature: '고정비', isCustom: false },
  { id: '4', name: '공과금', nature: '고정비', isCustom: false },
  { id: '5', name: '수수료', nature: '변동비', isCustom: false },
  { id: '6', name: '소모품비', nature: '변동비', isCustom: false },
  { id: '7', name: '광고선전비', nature: '변동비', isCustom: false },
];

// 데이터 로드
export function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // 기본 계정 과목이 없으면 추가
      if (!data.accountCategories || data.accountCategories.length === 0) {
        data.accountCategories = DEFAULT_CATEGORIES;
      }
      return data;
    }
  } catch (error) {
    console.error('Failed to load data:', error);
  }
  
  return {
    transactions: [],
    accountCategories: [...DEFAULT_CATEGORIES],
  };
}

// 데이터 저장
export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
}

// 거래 추가
export function addTransaction(transaction: any): void {
  const data = loadData();
  data.transactions.push(transaction);
  saveData(data);
}

// 거래 업데이트
export function updateTransaction(id: string, updates: Partial<any>): void {
  const data = loadData();
  const index = data.transactions.findIndex(t => t.id === id);
  if (index !== -1) {
    data.transactions[index] = { ...data.transactions[index], ...updates };
    saveData(data);
  }
}

// 거래 삭제
export function deleteTransaction(id: string): void {
  const data = loadData();
  data.transactions = data.transactions.filter(t => t.id !== id);
  saveData(data);
}

// 계정 과목 추가
export function addAccountCategory(category: AccountCategory): void {
  const data = loadData();
  data.accountCategories.push(category);
  saveData(data);
}

// 계정 과목 업데이트
export function updateAccountCategory(id: string, updates: Partial<AccountCategory>): void {
  const data = loadData();
  const index = data.accountCategories.findIndex(c => c.id === id);
  if (index !== -1) {
    data.accountCategories[index] = { ...data.accountCategories[index], ...updates };
    saveData(data);
  }
}

// 계정 과목 삭제
export function deleteAccountCategory(id: string): void {
  const data = loadData();
  // 기본 항목은 삭제 불가
  const category = data.accountCategories.find(c => c.id === id);
  if (category && !category.isCustom) {
    return;
  }
  data.accountCategories = data.accountCategories.filter(c => c.id !== id);
  saveData(data);
}

