import { useState, useEffect } from 'react';
import { parse } from 'date-fns';
import { Transaction, IncomeTransaction, ExpenseTransaction } from '../types';
import { loadData, deleteTransaction } from '../utils/storage';

function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'all' as 'all' | 'income' | 'expense',
    incomeType: '',
    category: '',
    search: '',
  });

  const data = loadData();
  const categories = data.accountCategories;

  useEffect(() => {
    refreshTransactions();
  }, []);

  const refreshTransactions = () => {
    const data = loadData();
    const sorted = [...data.transactions].sort((a, b) => {
      const dateA = parse(a.date, 'yyyy-MM-dd', new Date());
      const dateB = parse(b.date, 'yyyy-MM-dd', new Date());
      return dateB.getTime() - dateA.getTime();
    });
    setTransactions(sorted);
  };

  useEffect(() => {
    let filtered = [...transactions];

    if (filters.startDate) {
      filtered = filtered.filter((t) => t.date >= filters.startDate);
    }
    if (filters.endDate) {
      filtered = filtered.filter((t) => t.date <= filters.endDate);
    }
    if (filters.type === 'income') {
      filtered = filtered.filter((t): t is IncomeTransaction => 'incomeType' in t);
    } else if (filters.type === 'expense') {
      filtered = filtered.filter((t): t is ExpenseTransaction => 'category' in t);
    }
    if (filters.incomeType) {
      filtered = filtered.filter((t): t is IncomeTransaction =>
        'incomeType' in t && t.incomeType === filters.incomeType
      );
    }
    if (filters.category) {
      filtered = filtered.filter((t): t is ExpenseTransaction =>
        'category' in t && t.category === filters.category
      );
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchLower) ||
          (t.vendor && t.vendor.toLowerCase().includes(searchLower))
      );
    }

    setFilteredTransactions(filtered);
  }, [filters, transactions]);

  const handleDelete = (id: string) => {
    if (confirm('정말 이 거래를 삭제하시겠습니까?')) {
      deleteTransaction(id);
      refreshTransactions();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  return (
    <div>
      <div className="card">
        <h2>거래 목록</h2>
        <div className="filter-bar">
          <div>
            <label>시작일: </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>
          <div>
            <label>종료일: </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
          <div>
            <label>거래 유형: </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
            >
              <option value="all">전체</option>
              <option value="income">수익</option>
              <option value="expense">비용</option>
            </select>
          </div>
          {filters.type === 'income' && (
            <div>
              <label>수입 유형: </label>
              <select
                value={filters.incomeType}
                onChange={(e) => setFilters({ ...filters, incomeType: e.target.value })}
              >
                <option value="">전체</option>
                <option value="현금">현금</option>
                <option value="카드">카드</option>
                <option value="배달앱(플랫폼)">배달앱(플랫폼)</option>
                <option value="계좌이체">계좌이체</option>
              </select>
            </div>
          )}
          {filters.type === 'expense' && (
            <div>
              <label>계정 과목: </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">전체</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div style={{ flex: 1 }}>
            <label>검색: </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="거래 내용, 거래처로 검색"
              style={{ width: '200px' }}
            />
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setFilters({
                startDate: '',
                endDate: '',
                type: 'all',
                incomeType: '',
                category: '',
                search: '',
              });
            }}
          >
            필터 초기화
          </button>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <p>조회된 거래가 없습니다.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>일자</th>
                <th>거래 내용</th>
                <th>거래처</th>
                <th>금액</th>
                <th>유형</th>
                <th>증빙</th>
                <th>비고</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => {
                const isIncome = 'incomeType' in transaction;
                return (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.vendor || '-'}</td>
                    <td style={{ color: isIncome ? '#27ae60' : '#e74c3c' }}>
                      {isIncome ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td>
                      {isIncome ? (
                        <>
                          <div>{transaction.incomeType}</div>
                          {transaction.salesChannel && (
                            <div style={{ fontSize: '0.875rem', color: '#7f8c8d' }}>
                              {transaction.salesChannel}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div>
                            {categories.find((c) => c.id === transaction.category)?.name || '-'}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#7f8c8d' }}>
                            {transaction.nature}
                          </div>
                        </>
                      )}
                    </td>
                    <td>{transaction.receiptType || '-'}</td>
                    <td>{transaction.note || '-'}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                        onClick={() => handleDelete(transaction.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TransactionList;

