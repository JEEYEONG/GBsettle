import { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import AccountCategoryManager from './components/AccountCategoryManager';

type Tab = 'dashboard' | 'transactions' | 'add' | 'categories';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="app">
      <header className="app-header">
        <h1>가게 정산 관리 시스템</h1>
        <nav className="nav-tabs">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            대시보드
          </button>
          <button
            className={activeTab === 'transactions' ? 'active' : ''}
            onClick={() => setActiveTab('transactions')}
          >
            거래 목록
          </button>
          <button
            className={activeTab === 'add' ? 'active' : ''}
            onClick={() => setActiveTab('add')}
          >
            거래 등록
          </button>
          <button
            className={activeTab === 'categories' ? 'active' : ''}
            onClick={() => setActiveTab('categories')}
          >
            계정 과목 관리
          </button>
        </nav>
      </header>
      
      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'transactions' && <TransactionList />}
        {activeTab === 'add' && <TransactionForm onSuccess={() => setActiveTab('transactions')} />}
        {activeTab === 'categories' && <AccountCategoryManager />}
      </main>
    </div>
  );
}

export default App;

