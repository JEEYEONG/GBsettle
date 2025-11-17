import { Transaction, IncomeTransaction, ExpenseTransaction, CostNature } from '../types';
import { format, parse, startOfMonth, endOfMonth, subMonths, subYears } from 'date-fns';

// 월별 수익 합계
export function getMonthlyIncome(year: number, month: number): number {
  const data = JSON.parse(localStorage.getItem('settle-app-data') || '{"transactions":[]}');
  const transactions = data.transactions as Transaction[];
  
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(new Date(year, month - 1));
  
  return transactions
    .filter((t): t is IncomeTransaction => 'incomeType' in t)
    .filter(t => {
      const date = parse(t.date, 'yyyy-MM-dd', new Date());
      return date >= monthStart && date <= monthEnd;
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

// 월별 비용 합계
export function getMonthlyExpense(year: number, month: number): number {
  const data = JSON.parse(localStorage.getItem('settle-app-data') || '{"transactions":[]}');
  const transactions = data.transactions as Transaction[];
  
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(new Date(year, month - 1));
  
  return transactions
    .filter((t): t is ExpenseTransaction => 'category' in t)
    .filter(t => {
      const date = parse(t.date, 'yyyy-MM-dd', new Date());
      return date >= monthStart && date <= monthEnd;
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

// 월별 순수익
export function getMonthlyNetIncome(year: number, month: number): number {
  return getMonthlyIncome(year, month) - getMonthlyExpense(year, month);
}

// 월별 고정비/변동비 분석
export function getMonthlyCostBreakdown(year: number, month: number): {
  fixed: number;
  variable: number;
} {
  const data = JSON.parse(localStorage.getItem('settle-app-data') || '{"transactions":[],"accountCategories":[]}');
  const transactions = data.transactions as Transaction[];
  const categories = data.accountCategories;
  
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(new Date(year, month - 1));
  
  let fixed = 0;
  let variable = 0;
  
  transactions
    .filter((t): t is ExpenseTransaction => 'category' in t)
    .filter(t => {
      const date = parse(t.date, 'yyyy-MM-dd', new Date());
      return date >= monthStart && date <= monthEnd;
    })
    .forEach(t => {
      if (t.nature === '고정비') {
        fixed += t.amount;
      } else {
        variable += t.amount;
      }
    });
  
  return { fixed, variable };
}

// 전월 대비 변화율 계산
export function getMonthOverMonthChange(year: number, month: number, type: 'income' | 'expense' | 'net'): number {
  const prevMonth = subMonths(new Date(year, month - 1), 1);
  const prevYear = prevMonth.getFullYear();
  const prevMonthNum = prevMonth.getMonth() + 1;
  
  let current: number;
  let previous: number;
  
  if (type === 'income') {
    current = getMonthlyIncome(year, month);
    previous = getMonthlyIncome(prevYear, prevMonthNum);
  } else if (type === 'expense') {
    current = getMonthlyExpense(year, month);
    previous = getMonthlyExpense(prevYear, prevMonthNum);
  } else {
    current = getMonthlyNetIncome(year, month);
    previous = getMonthlyNetIncome(prevYear, prevMonthNum);
  }
  
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// 전년 동월 대비 변화율 계산
export function getYearOverYearChange(year: number, month: number, type: 'income' | 'expense' | 'net'): number {
  const prevYearDate = subYears(new Date(year, month - 1), 1);
  const prevYear = prevYearDate.getFullYear();
  
  let current: number;
  let previous: number;
  
  if (type === 'income') {
    current = getMonthlyIncome(year, month);
    previous = getMonthlyIncome(prevYear, month);
  } else if (type === 'expense') {
    current = getMonthlyExpense(year, month);
    previous = getMonthlyExpense(prevYear, month);
  } else {
    current = getMonthlyNetIncome(year, month);
    previous = getMonthlyNetIncome(prevYear, month);
  }
  
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

