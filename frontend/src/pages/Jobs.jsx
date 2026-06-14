import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../utils/permissions';
import { jobs, getCategories, createCategory, updateCategory, deleteCategory, getQuestionsByCategory, createQuestion, updateQuestion, deleteQuestion, getAssessmentsByCategory, getAssessments, getUserById, getResponsesByAssessment } from '../mock-data';
import { formatDate, formatCurrency, capitalizeWords } from '../utils/helpers';
import Header from '../components/layout/Header';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import ConfirmModal from '../components/common/ConfirmModal';
import Tabs from '../components/common/Tabs';
import { Plus, Pencil, Trash2, X, Save, ClipboardCheck, BookOpen, ChevronLeft } from 'lucide-react';
import styles from './Assessments.module.css';

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const QUESTION_TYPES = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'true_false', label: 'True/False' },
  { value: 'descriptive', label: 'Descriptive' },
];

export default function Jobs() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { can } = usePermissions(currentUser?.role);
  const [search, setSearch] = useState('');
  const [fil, setFil] = useState({ type: '', status: '', category: '' });
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', description: '' });
  const [deletingCat, setDeletingCat] = useState(null);

  // Assessment state
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deletingQuestion, setDeletingQuestion] = useState(null);
  const [qTab, setQTab] = useState('questions');
  const [qSearch, setQSearch] = useState('');
  const [qForm, setQForm] = useState({
    question: '', questionType: 'multiple_choice', difficulty: 'beginner',
    points: 10, options: ['', '', '', ''], correctAnswer: '',
  });

  const allCategories = useMemo(() => getCategories(), [refreshKey]);

  // Assessment data
  const allAssessments = useMemo(() => getAssessments(), [refreshKey]);
  const questions = useMemo(() => {
    if (!selectedCategory) return [];
    const qs = getQuestionsByCategory(selectedCategory.id);
    if (qSearch) {
      const q = qSearch.toLowerCase();
      return qs.filter((x) => x.question.toLowerCase().includes(q));
    }
    return qs;
  }, [selectedCategory, refreshKey, qSearch]);
  const categoryAssessments = useMemo(() => {
    if (!selectedCategory) return [];
    return allAssessments.filter((a) => a.categoryId === selectedCategory.id);
  }, [selectedCategory, allAssessments]);
  const activeCategories = useMemo(() => allCategories.filter((c) => c.isActive), [allCategories]);
  const totalPoints = useMemo(() => questions.reduce((sum, q) => sum + q.points, 0), [questions]);

  // Analytics
  const categoryAnalytics = useMemo(() => {
    return activeCategories.map((cat) => {
      const qs = getQuestionsByCategory(cat.id);
      const asmts = allAssessments.filter((a) => a.categoryId === cat.id);
      const totalPts = qs.reduce((s, q) => s + q.points, 0);
      const passed = asmts.filter((a) => a.score / a.totalPoints >= 0.6).length;
      const avgScore = asmts.length > 0 ? Math.round(asmts.reduce((s, a) => s + (a.score / a.totalPoints) * 100, 0) / asmts.length) : 0;
      return { ...cat, questionCount: qs.length, submissionCount: asmts.length, passed, avgScore, totalPoints: totalPts };
    });
  }, [activeCategories, allAssessments, refreshKey]);

  const filters = useMemo(() => [
    { key: 'type', label: 'Type', placeholder: 'All Types', options: [
      { value: 'task-based', label: 'Task-Based' },
      { value: 'contractor-based', label: 'Contractor-Based' },
    ]},
    { key: 'status', label: 'Status', placeholder: 'All Statuses', options: [
      { value: 'active', label: 'Active' },
      { value: 'finished', label: 'Finished' },
      { value: 'completed', label: 'Completed' },
      { value: 'flagged', label: 'Flagged' },
      { value: 'removed', label: 'Removed' },
    ]},
    { key: 'category', label: 'Category', placeholder: 'All Categories', options: allCategories.filter(c => c.isActive).map(c => ({ value: c.name, label: c.name })) },
  ], [allCategories]);

  const filtered = useMemo(() => {
    let data = [...jobs];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((j) => j.title?.toLowerCase().includes(q) || j.clientName?.toLowerCase().includes(q));
    }
    if (fil.type) data = data.filter((j) => j.type === fil.type);
    if (fil.status) data = data.filter((j) => j.status === fil.status);
    if (fil.category) data = data.filter((j) => j.category === fil.category);
    return data;
  }, [search, fil, refreshKey]);

  const columns = [
    { key: 'title', label: 'Job', render: (row) => <span className="cell-link">{row.title}</span> },
    { key: 'type', label: 'Type', render: (row) => <StatusBadge status={row.type} /> },
    { key: 'clientName', label: 'Client' },
    { key: 'category', label: 'Category' },
    { key: 'budget', label: 'Budget', render: (row) => formatCurrency(row.budget) },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'proposalCount', label: 'Proposals' },
    { key: 'createdAt', label: 'Posted', render: (row) => formatDate(row.createdAt) },
    { key: 'flags', label: 'Flags', render: (row) => row.flags > 0 ? <StatusBadge status="flagged" label={row.flags} /> : '-' },
  ];

  const openEditCat = (cat) => {
    setEditingCat(cat);
    setCatForm({ name: cat.name, description: cat.description || '' });
  };

  const handleSaveCat = () => {
    if (!catForm.name.trim()) return;
    if (editingCat) {
      updateCategory(editingCat.id, { name: catForm.name.trim(), description: catForm.description.trim() });
    } else {
      createCategory({ name: catForm.name.trim(), description: catForm.description.trim() });
    }
    setEditingCat(null);
    setCatForm({ name: '', description: '' });
    setRefreshKey((k) => k + 1);
  };

  const handleDeleteCat = () => {
    const ok = deleteCategory(deletingCat.id);
    if (!ok) {
      alert('Cannot delete a category that has active jobs or listings.');
      setDeletingCat(null);
      return;
    }
    setDeletingCat(null);
    setRefreshKey((k) => k + 1);
  };

  // Assessment handlers
  const openNewForm = () => {
    setEditingQuestion(null);
    setQForm({ question: '', questionType: 'multiple_choice', difficulty: 'beginner', points: 10, options: ['', '', '', ''], correctAnswer: '' });
    setShowQuestionForm(true);
  };

  const openEditForm = (q) => {
    setEditingQuestion(q);
    const opts = q.options?.length ? [...q.options] : [''];
    while (opts.length < 4) opts.push('');
    setQForm({
      question: q.question,
      questionType: q.questionType,
      difficulty: q.difficulty,
      points: q.points,
      options: opts,
      correctAnswer: q.correctAnswer || '',
    });
    setShowQuestionForm(true);
  };

  const handleSaveQuestion = () => {
    if (!qForm.question.trim()) return;
    if (qForm.questionType === 'multiple_choice' && qForm.options.filter((o) => o.trim()).length < 2) return;
    if ((qForm.questionType === 'multiple_choice' || qForm.questionType === 'true_false') && !qForm.correctAnswer) return;

    const data = {
      categoryId: selectedCategory.id,
      question: qForm.question.trim(),
      questionType: qForm.questionType,
      difficulty: qForm.difficulty,
      points: Number(qForm.points),
      options: qForm.questionType !== 'descriptive' ? qForm.options.filter((o) => o.trim()) : [],
      correctAnswer: qForm.questionType !== 'descriptive' ? qForm.correctAnswer : null,
    };

    if (editingQuestion) {
      updateQuestion(editingQuestion.id, data);
    } else {
      createQuestion(data);
    }
    setShowQuestionForm(false);
    setEditingQuestion(null);
    setRefreshKey((k) => k + 1);
  };

  const handleDeleteQuestion = () => {
    deleteQuestion(deletingQuestion.id);
    setDeletingQuestion(null);
    setRefreshKey((k) => k + 1);
  };

  const assessmentColumns = [
    { key: 'userName', label: 'Talent', render: (row) => getUserById(row.userId)?.name || 'Unknown' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'score', label: 'Score', render: (row) => `${row.score}/${row.totalPoints}` },
    { key: 'startedAt', label: 'Started', render: (row) => formatDate(row.startedAt) },
    { key: 'completedAt', label: 'Completed', render: (row) => row.completedAt ? formatDate(row.completedAt) : '-' },
  ];

  return (
    <div>
      <Header title="Job Management" onSearch={activeTab === 'jobs' ? setSearch : undefined} />
      <Tabs tabs={[
        { key: 'jobs', label: 'Jobs' },
        { key: 'assessments', label: 'Assessments' },
      ]} activeTab={activeTab} onChange={(t) => { setActiveTab(t); setSelectedCategory(null); }} />

      {activeTab === 'jobs' && (
        <>
          <div className="card">
            <div className="card-header">
              <FilterBar filters={filters} values={fil} onChange={(key, value) => setFil((p) => ({ ...p, [key]: value }))} />
              {can('manageSettings') && (
                <button className="btn btn-outline btn-sm" onClick={() => setShowCatModal(true)}>
                  Manage Categories
                </button>
              )}
            </div>
            <div className="card-body p-0">
              <DataTable columns={columns} data={filtered} onRowClick={(row) => navigate(`/jobs/${row.id}`)} pageSize={10} emptyMessage="No jobs found." />
            </div>
          </div>

          {showCatModal && (
            <div className="modal-overlay" onClick={() => { setShowCatModal(false); setEditingCat(null); setCatForm({ name: '', description: '' }); }}>
              <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
                <div className="modal-header">
                  <h3>Manage Categories</h3>
                  <button className="modal-close" onClick={() => { setShowCatModal(false); setEditingCat(null); setCatForm({ name: '', description: '' }); }}>
                    <X size={16} />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-section" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                    <h4 className="text-sm font-semibold mb-3">
                      {editingCat ? `Edit: ${editingCat.name}` : 'Add New Category'}
                    </h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Name</label>
                        <input className="form-input" placeholder="e.g. Landscaping" value={catForm.name} onChange={(e) => setCatForm((p) => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <input className="form-input" placeholder="Brief description" value={catForm.description} onChange={(e) => setCatForm((p) => ({ ...p, description: e.target.value }))} />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="btn btn-sm btn-primary" onClick={handleSaveCat}>
                        <Save size={14} /> {editingCat ? 'Update' : 'Add'}
                      </button>
                      {editingCat && (
                        <button className="btn btn-sm btn-outline" onClick={() => { setEditingCat(null); setCatForm({ name: '', description: '' }); }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    {allCategories.length === 0 ? (
                      <div className="empty-state"><div className="empty-state-text">No categories configured.</div></div>
                    ) : (
                      allCategories.map((cat) => (
                        <div key={cat.id} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <div>
                            <div className="font-medium text-sm">{cat.name}</div>
                            <div className="text-xs text-muted">
                              {cat.description}{cat.description ? ' · ' : ''}{cat.jobCount} job(s) · {cat.listingCount} listing(s)
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button className="btn btn-sm btn-outline" onClick={() => openEditCat(cat)}><Pencil size={13} /></button>
                            <button className="btn btn-sm btn-danger" onClick={() => setDeletingCat(cat)} disabled={cat.jobCount > 0 || cat.listingCount > 0}><Trash2 size={13} /></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <ConfirmModal
            open={!!deletingCat}
            title="Delete Category"
            message={`Are you sure you want to delete "${deletingCat?.name}"? This cannot be undone.`}
            confirmLabel="Delete"
            variant="danger"
            onConfirm={handleDeleteCat}
            onCancel={() => setDeletingCat(null)}
          />
        </>
      )}

      {activeTab === 'assessments' && (
        <>
          {!selectedCategory ? (
            <>
              <div className={styles.toolbar}>
                <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600 }}>Assessment Overview</h3>
              </div>
              <div className="card">
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                    {categoryAnalytics.map((cat) => (
                      <div key={cat.id} className={styles.categoryCard} onClick={() => setSelectedCategory(cat)}>
                        <div className={styles.categoryCardIcon}><ClipboardCheck size={24} /></div>
                        <div className={styles.categoryCardName}>{cat.name}</div>
                        <div className={styles.categoryCardDesc}>{cat.description}</div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.4375rem', borderRadius: 'var(--radius-full)', background: '#EEF2F6', color: '#475569', fontWeight: 500 }}>
                            {cat.questionCount} questions
                          </span>
                          <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.4375rem', borderRadius: 'var(--radius-full)', background: '#EEF2F6', color: '#475569', fontWeight: 500 }}>
                            {cat.totalPoints} pts
                          </span>
                        </div>
                        <div className={styles.categoryCardMeta}>
                          <span>{cat.submissionCount} taken</span>
                          {cat.submissionCount > 0 && (
                            <>
                              <span>{cat.avgScore}% avg</span>
                              <span>{cat.passed}/{cat.submissionCount} passed</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    {activeCategories.length === 0 && (
                      <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                        <div className="empty-state-text">No categories available</div>
                        <div className="empty-state-sub">Create categories in the Jobs tab first</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.toolbar}>
                <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedCategory(null); setShowQuestionForm(false); setEditingQuestion(null); }}>
                  <ChevronLeft size={16} /> All Categories
                </button>
                <div className={styles.toolbarStats}>
                  <span>{questions.length} questions</span>
                  <span>{totalPoints} total points</span>
                  <span>{categoryAssessments.length} submissions</span>
                  {categoryAssessments.length > 0 && (
                    <span>{Math.round(categoryAssessments.filter(a => a.score / a.totalPoints >= 0.6).length / categoryAssessments.length * 100)}% pass rate</span>
                  )}
                </div>
              </div>

              <Tabs tabs={[
                { key: 'questions', label: 'Questions' },
                { key: 'submissions', label: 'Submissions' },
              ]} activeTab={qTab} onChange={setQTab} />

              <div className="tab-content">
                {qTab === 'questions' && (
                  <div className="card">
                    <div className="card-header">
                      <SearchBar value={qSearch} onChange={setQSearch} placeholder="Search questions..." />
                      {can('manageQuestions') && (
                        <button className="btn btn-accent btn-sm" onClick={openNewForm}>
                          <Plus size={15} /> Add Question
                        </button>
                      )}
                    </div>
                    {showQuestionForm && (
                      <div className={styles.questionForm}>
                        <div className={styles.questionFormHeader}>
                          <h4>{editingQuestion ? 'Edit Question' : 'New Question'}</h4>
                          <button className={styles.questionFormClose} onClick={() => { setShowQuestionForm(false); setEditingQuestion(null); }}>
                            <X size={16} />
                          </button>
                        </div>
                        <div className={styles.questionFormBody}>
                          <div className="form-group">
                            <label className="form-label">Question</label>
                            <textarea className="form-textarea" rows={2} value={qForm.question}
                              onChange={(e) => setQForm((p) => ({ ...p, question: e.target.value }))} />
                          </div>
                          <div className="form-row">
                            <div className="form-group">
                              <label className="form-label">Type</label>
                              <select className="form-select" value={qForm.questionType}
                                onChange={(e) => setQForm((p) => ({ ...p, questionType: e.target.value, correctAnswer: '', options: ['', '', '', ''] }))}>
                                {QUESTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Difficulty</label>
                              <select className="form-select" value={qForm.difficulty}
                                onChange={(e) => setQForm((p) => ({ ...p, difficulty: e.target.value }))}>
                                {DIFFICULTIES.map((d) => <option key={d} value={d}>{capitalizeWords(d)}</option>)}
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Points</label>
                              <input className="form-input" type="number" min={1} max={100} value={qForm.points}
                                onChange={(e) => setQForm((p) => ({ ...p, points: e.target.value }))} />
                            </div>
                          </div>

                          {qForm.questionType === 'multiple_choice' && (
                            <div className="form-group">
                              <label className="form-label">Options (at least 2, mark correct with radio)</label>
                              {qForm.options.map((opt, i) => (
                                <div key={i} className={styles.optionRow}>
                                  <input type="radio" name="correct" checked={qForm.correctAnswer === opt}
                                    onChange={() => setQForm((p) => ({ ...p, correctAnswer: opt }))} />
                                  <input className="form-input" placeholder={`Option ${i + 1}`} value={opt}
                                    onChange={(e) => {
                                      const opts = [...qForm.options];
                                      opts[i] = e.target.value;
                                      setQForm((p) => ({ ...p, options: opts }));
                                    }} />
                                  {opt && qForm.correctAnswer === opt && <span className={styles.correctBadge}>Correct</span>}
                                </div>
                              ))}
                            </div>
                          )}

                          {qForm.questionType === 'true_false' && (
                            <div className="form-group">
                              <label className="form-label">Correct Answer</label>
                              <div className={styles.optionRow}>
                                <input type="radio" name="tf" checked={qForm.correctAnswer === 'True'}
                                  onChange={() => setQForm((p) => ({ ...p, correctAnswer: 'True', options: ['True', 'False'] }))} />
                                <span>True</span>
                              </div>
                              <div className={styles.optionRow}>
                                <input type="radio" name="tf" checked={qForm.correctAnswer === 'False'}
                                  onChange={() => setQForm((p) => ({ ...p, correctAnswer: 'False', options: ['True', 'False'] }))} />
                                <span>False</span>
                              </div>
                            </div>
                          )}

                          {qForm.questionType === 'descriptive' && (
                            <div className="form-group">
                              <label className="form-label text-muted">Descriptive questions require manual grading.</label>
                            </div>
                          )}

                          <div className={styles.formActions}>
                            <button className="btn btn-primary btn-sm" onClick={handleSaveQuestion}>
                              <Save size={14} /> {editingQuestion ? 'Update' : 'Add Question'}
                            </button>
                            <button className="btn btn-outline btn-sm" onClick={() => { setShowQuestionForm(false); setEditingQuestion(null); }}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="card-body p-0">
                      {questions.length === 0 ? (
                        <div className="empty-state">
                          <div className="empty-state-icon"><BookOpen size={36} /></div>
                          <div className="empty-state-text">No questions yet</div>
                          <div className="empty-state-sub">Add assessment questions for {selectedCategory.name}</div>
                        </div>
                      ) : (
                        <div className={styles.questionList}>
                          {questions.map((q) => (
                            <div key={q.id} className={styles.questionItem}>
                              <div className={styles.questionItemTop}>
                                <div className={styles.questionItemText}>{q.question}</div>
                                <div className={styles.questionItemActions}>
                                  {can('manageQuestions') && (
                                    <>
                                      <button className="btn btn-ghost btn-sm" onClick={() => openEditForm(q)}><Pencil size={13} /></button>
                                      <button className="btn btn-ghost btn-sm" onClick={() => setDeletingQuestion(q)}><Trash2 size={13} /></button>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className={styles.questionItemMeta}>
                                <span className={styles.qBadge}>{QUESTION_TYPES.find((t) => t.value === q.questionType)?.label}</span>
                                <span className={styles.qBadge}>{capitalizeWords(q.difficulty)}</span>
                                <span className={styles.qBadge}>{q.points} pts</span>
                                {q.correctAnswer && <span className={styles.qBadge}>Ans: {q.correctAnswer}</span>}
                              </div>
                              {q.options?.length > 0 && q.questionType !== 'true_false' && (
                                <div className={styles.questionItemOptions}>
                                  {q.options.map((o, i) => (
                                    <span key={i} className={`${styles.optionPill} ${o === q.correctAnswer ? styles.optionCorrect : ''}`}>
                                      {o === q.correctAnswer && '✓ '}{o}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {qTab === 'submissions' && (
                  <div className="card">
                    <div className="card-body p-0">
                      {categoryAssessments.length === 0 ? (
                        <div className="empty-state">
                          <div className="empty-state-text">No submissions yet</div>
                          <div className="empty-state-sub">Talents will appear here after they take assessments</div>
                        </div>
                      ) : (
                        <DataTable
                          columns={assessmentColumns}
                          data={categoryAssessments}
                          pageSize={10}
                          emptyMessage="No submissions"
                          onRowClick={(row) => navigate(`/users/${row.userId}`)}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <ConfirmModal
                open={!!deletingQuestion}
                title="Delete Question"
                message={`Remove "${deletingQuestion?.question?.substring(0, 60)}..."? This cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDeleteQuestion}
                onCancel={() => setDeletingQuestion(null)}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
