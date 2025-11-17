import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  getMonthlyIncome,
  getMonthlyExpense,
  getMonthlyNetIncome,
  getMonthlyCostBreakdown,
  getMonthOverMonthChange,
  getYearOverYearChange,
} from '../utils/calculations';

const COLORS = ['#3498db', '#e74c3c'];

function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);

  const monthlyIncome = getMonthlyIncome(year, month);
  const monthlyExpense = getMonthlyExpense(year, month);
  const monthlyNetIncome = getMonthlyNetIncome(year, month);
  const costBreakdown = getMonthlyCostBreakdown(year, month);

  const momIncomeChange = getMonthOverMonthChange(year, month, 'income');
  const momExpenseChange = getMonthOverMonthChange(year, month, 'expense');
  const momNetChange = getMonthOverMonthChange(year, month, 'net');

  const yoyIncomeChange = getYearOverYearChange(year, month, 'income');
  const yoyExpenseChange = getYearOverYearChange(year, month, 'expense');
  const yoyNetChange = getYearOverYearChange(year, month, 'net');

  const costData = [
    { name: '고정비', value: costBreakdown.fixed },
    { name: '변동비', value: costBreakdown.variable },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // 최근 6개월 데이터
  const recentMonths = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(year, month - 1 - i, 1);
    return {
      month: format(date, 'yyyy-MM'),
      label: format(date, 'M월'),
      income: getMonthlyIncome(date.getFullYear(), date.getMonth() + 1),
      expense: getMonthlyExpense(date.getFullYear(), date.getMonth() + 1),
      net: getMonthlyNetIncome(date.getFullYear(), date.getMonth() + 1),
    };
  }).reverse();

  return (
    <div className="dashboard">
      <div className="card">
        <h2>월별 핵심 지표</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label>조회 기간: </label>
          <input
            type="month"
            value={`${year}-${String(month).padStart(2, '0')}`}
            onChange={(e) => {
              const [y, m] = e.target.value.split('-').map(Number);
              setYear(y);
              setMonth(m);
            }}
            style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
          />
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>당월 총수익</h3>
            <div className="value">{formatCurrency(monthlyIncome)}</div>
            <div className="change">
              <span>전월 대비:</span>
              <span className={momIncomeChange >= 0 ? 'positive' : 'negative'}>
                {formatPercent(momIncomeChange)}
              </span>
            </div>
            <div className="change">
              <span>전년 동월 대비:</span>
              <span className={yoyIncomeChange >= 0 ? 'positive' : 'negative'}>
                {formatPercent(yoyIncomeChange)}
              </span>
            </div>
          </div>
          <div className="stat-card">
            <h3>당월 총비용</h3>
            <div className="value">{formatCurrency(monthlyExpense)}</div>
            <div className="change">
              <span>전월 대비:</span>
              <span className={momExpenseChange <= 0 ? 'positive' : 'negative'}>
                {formatPercent(momExpenseChange)}
              </span>
            </div>
            <div className="change">
              <span>전년 동월 대비:</span>
              <span className={yoyExpenseChange <= 0 ? 'positive' : 'negative'}>
                {formatPercent(yoyExpenseChange)}
              </span>
            </div>
          </div>
          <div className="stat-card">
            <h3>당월 순수익</h3>
            <div className="value" style={{ color: monthlyNetIncome >= 0 ? '#27ae60' : '#e74c3c' }}>
              {formatCurrency(monthlyNetIncome)}
            </div>
            <div className="change">
              <span>전월 대비:</span>
              <span className={momNetChange >= 0 ? 'positive' : 'negative'}>
                {formatPercent(momNetChange)}
              </span>
            </div>
            <div className="change">
              <span>전년 동월 대비:</span>
              <span className={yoyNetChange >= 0 ? 'positive' : 'negative'}>
                {formatPercent(yoyNetChange)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h3>비용 구조 분석</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>
              <strong>고정비:</strong> {formatCurrency(costBreakdown.fixed)}
            </div>
            <div>
              <strong>변동비:</strong> {formatCurrency(costBreakdown.variable)}
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h3>매출 추이 분석 (최근 6개월)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={recentMonths}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis tickFormatter={(value) => `${(value / 10000).toFixed(0)}만원`} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelStyle={{ color: '#2c3e50' }}
            />
            <Legend />
            <Bar dataKey="income" fill="#3498db" name="수익" />
            <Bar dataKey="expense" fill="#e74c3c" name="비용" />
            <Bar dataKey="net" fill="#27ae60" name="순수익" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;

