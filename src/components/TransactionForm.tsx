import { useState } from 'react';
import { format } from 'date-fns';
import { IncomeTransaction, ExpenseTransaction, IncomeType, SalesChannel, ReceiptType, TransactionType } from '../types';
import { loadData, saveData } from '../utils/storage';

interface TransactionFormProps {
  onSuccess?: () => void;
}

function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [description, setDescription] = useState('');
  const [vendor, setVendor] = useState('');
  const [receiptType, setReceiptType] = useState<ReceiptType>('');
  const [note, setNote] = useState('');

  // Income fields
  const [amount, setAmount] = useState('');
  const [incomeType, setIncomeType] = useState<IncomeType>('현금');
  const [salesChannel, setSalesChannel] = useState<SalesChannel>('홀');
  const [supplyAmount, setSupplyAmount] = useState('');
  const [vat, setVat] = useState('');

  // Expense fields
  const [expenseAmount, setExpenseAmount] = useState('');
  const [category, setCategory] = useState('');

  const data = loadData();
  const categories = data.accountCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !date) {
      alert('일자와 거래 내용은 필수 항목입니다.');
      return;
    }

    if (transactionType === 'income') {
      if (!amount) {
        alert('수입 금액을 입력해주세요.');
        return;
      }
      const income: IncomeTransaction = {
        id: Date.now().toString(),
        date,
        description,
        vendor: vendor || undefined,
        receiptType: receiptType || undefined,
        note: note || undefined,
        amount: Number(amount),
        incomeType,
        salesChannel: salesChannel || undefined,
        supplyAmount: supplyAmount ? Number(supplyAmount) : undefined,
        vat: vat ? Number(vat) : undefined,
      };

      const newData = loadData();
      newData.transactions.push(income);
      saveData(newData);
    } else {
      if (!expenseAmount || !category) {
        alert('비용 금액과 계정 과목을 입력해주세요.');
        return;
      }
      const selectedCategory = categories.find(c => c.id === category);
      const expense: ExpenseTransaction = {
        id: Date.now().toString(),
        date,
        description,
        vendor: vendor || undefined,
        receiptType: receiptType || undefined,
        note: note || undefined,
        amount: Number(expenseAmount),
        category,
        nature: selectedCategory?.nature || '변동비',
      };

      const newData = loadData();
      newData.transactions.push(expense);
      saveData(newData);
    }

    // Reset form
    setDescription('');
    setVendor('');
    setReceiptType('');
    setNote('');
    setAmount('');
    setSupplyAmount('');
    setVat('');
    setExpenseAmount('');
    setCategory('');

    alert('거래가 등록되었습니다.');
    onSuccess?.();
  };

  return (
    <div className="card">
      <h2>거래 등록</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>거래 유형 *</label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value as TransactionType)}
            required
          >
            <option value="income">수익 (매출)</option>
            <option value="expense">비용 (지출)</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>일자 *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>거래 내용 *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 김치찌개 재료 구입, 포스기 결제대금 입금"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>거래처</label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="예: OO 마트, OO 카드사"
            />
          </div>
          <div className="form-group">
            <label>증빙 유형</label>
            <select
              value={receiptType}
              onChange={(e) => setReceiptType(e.target.value as ReceiptType)}
            >
              <option value="">선택 안 함</option>
              <option value="카드매출전표">카드매출전표</option>
              <option value="세금계산서">세금계산서</option>
              <option value="현금영수증">현금영수증</option>
              <option value="간이영수증">간이영수증</option>
            </select>
          </div>
        </div>

        {transactionType === 'income' ? (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>수입 금액 (부가세 포함) *</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  required
                  min="0"
                  step="100"
                />
              </div>
              <div className="form-group">
                <label>수입 유형 *</label>
                <select
                  value={incomeType}
                  onChange={(e) => setIncomeType(e.target.value as IncomeType)}
                  required
                >
                  <option value="현금">현금</option>
                  <option value="카드">카드</option>
                  <option value="배달앱(플랫폼)">배달앱(플랫폼)</option>
                  <option value="계좌이체">계좌이체</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>매출 채널</label>
                <select
                  value={salesChannel}
                  onChange={(e) => setSalesChannel(e.target.value as SalesChannel)}
                >
                  <option value="홀">홀</option>
                  <option value="포장">포장</option>
                  <option value="배달앱A">배달앱A</option>
                  <option value="배달앱B">배달앱B</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>공급가액 (선택)</label>
                <input
                  type="number"
                  value={supplyAmount}
                  onChange={(e) => setSupplyAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="100"
                />
              </div>
              <div className="form-group">
                <label>VAT (선택)</label>
                <input
                  type="number"
                  value={vat}
                  onChange={(e) => setVat(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="100"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>비용 금액 (부가세 포함) *</label>
                <input
                  type="number"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="0"
                  required
                  min="0"
                  step="100"
                />
              </div>
              <div className="form-group">
                <label>계정 과목 *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">선택하세요</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.nature})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        <div className="form-group">
          <label>비고</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="예: 외상 결제분, 특판 할인 적용"
          />
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary">
            등록
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setDescription('');
              setVendor('');
              setReceiptType('');
              setNote('');
              setAmount('');
              setSupplyAmount('');
              setVat('');
              setExpenseAmount('');
              setCategory('');
            }}
          >
            초기화
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;

