import { useState, useEffect } from 'react';
import { AccountCategory, CostNature } from '../types';
import { loadData, addAccountCategory, updateAccountCategory, deleteAccountCategory } from '../utils/storage';

function AccountCategoryManager() {
  const [categories, setCategories] = useState<AccountCategory[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    nature: '변동비' as CostNature,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState<AccountCategory | null>(null);

  useEffect(() => {
    refreshCategories();
  }, []);

  const refreshCategories = () => {
    const data = loadData();
    setCategories(data.accountCategories);
  };

  const handleAdd = () => {
    if (!newCategory.name.trim()) {
      alert('계정 과목명을 입력해주세요.');
      return;
    }

    const category: AccountCategory = {
      id: Date.now().toString(),
      name: newCategory.name.trim(),
      nature: newCategory.nature,
      isCustom: true,
    };

    addAccountCategory(category);
    setNewCategory({ name: '', nature: '변동비' });
    setIsAdding(false);
    refreshCategories();
  };

  const handleEdit = (category: AccountCategory) => {
    setEditingId(category.id);
    setEditCategory({ ...category });
  };

  const handleSaveEdit = () => {
    if (!editCategory || !editCategory.name.trim()) {
      alert('계정 과목명을 입력해주세요.');
      return;
    }

    updateAccountCategory(editCategory.id, {
      name: editCategory.name.trim(),
      nature: editCategory.nature,
    });
    setEditingId(null);
    setEditCategory(null);
    refreshCategories();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditCategory(null);
  };

  const handleDelete = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category && !category.isCustom) {
      alert('기본 계정 과목은 삭제할 수 없습니다.');
      return;
    }
    if (confirm('정말 이 계정 과목을 삭제하시겠습니까?')) {
      deleteAccountCategory(id);
      refreshCategories();
    }
  };

  return (
    <div className="card">
      <h2>계정 과목 관리</h2>
      <p style={{ marginBottom: '1rem', color: '#7f8c8d' }}>
        계정 과목을 추가, 수정, 삭제할 수 있습니다. 기본 계정 과목은 삭제할 수 없습니다.
      </p>

      <div style={{ marginBottom: '2rem' }}>
        {!isAdding ? (
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
            계정 과목 추가
          </button>
        ) : (
          <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
            <div className="form-row">
              <div className="form-group">
                <label>계정 과목명 *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="예: 교통비"
                />
              </div>
              <div className="form-group">
                <label>비용 성격 *</label>
                <select
                  value={newCategory.nature}
                  onChange={(e) => setNewCategory({ ...newCategory, nature: e.target.value as CostNature })}
                >
                  <option value="고정비">고정비</option>
                  <option value="변동비">변동비</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-primary" onClick={handleAdd}>
                추가
              </button>
              <button className="btn btn-secondary" onClick={() => setIsAdding(false)}>
                취소
              </button>
            </div>
          </div>
        )}
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>계정 과목명</th>
            <th>비용 성격</th>
            <th>유형</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>
                {editingId === category.id && editCategory ? (
                  <input
                    type="text"
                    value={editCategory.name}
                    onChange={(e) =>
                      setEditCategory({ ...editCategory, name: e.target.value })
                    }
                    style={{ width: '100%', padding: '0.25rem' }}
                  />
                ) : (
                  category.name
                )}
              </td>
              <td>
                {editingId === category.id && editCategory ? (
                  <select
                    value={editCategory.nature}
                    onChange={(e) =>
                      setEditCategory({ ...editCategory, nature: e.target.value as CostNature })
                    }
                    style={{ width: '100%', padding: '0.25rem' }}
                  >
                    <option value="고정비">고정비</option>
                    <option value="변동비">변동비</option>
                  </select>
                ) : (
                  category.nature
                )}
              </td>
              <td>{category.isCustom ? '사용자 정의' : '기본'}</td>
              <td>
                {editingId === category.id ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-primary"
                      style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                      onClick={handleSaveEdit}
                    >
                      저장
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                      onClick={handleCancelEdit}
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-primary"
                      style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                      onClick={() => handleEdit(category)}
                    >
                      수정
                    </button>
                    {category.isCustom && (
                      <button
                        className="btn btn-danger"
                        style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                        onClick={() => handleDelete(category.id)}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AccountCategoryManager;

