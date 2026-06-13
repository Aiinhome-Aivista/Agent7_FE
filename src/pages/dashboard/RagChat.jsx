import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Bot, User, FileText, BookOpen, CheckCircle2,
  Plus, MessageSquare, Trash2, Clock, ChevronLeft, ChevronRight, Loader2,
  Upload, AlertTriangle, AlertCircle, X, Sparkles, Shield, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CLAIM_TYPE_LABELS = {
  auto_accident: '🚗 Auto Accident',
  property_damage: '🏠 Property Damage',
  theft: '🔒 Theft',
  medical: '🏥 Medical',
  weather: '⛈ Weather Damage',
  other: '📋 Other',
};

const OUTCOME_CONFIG = {
  auto_settled: { icon: CheckCircle2, color: '#10B981', label: 'Auto-Settled ✅', bg: 'rgba(16,185,129,0.1)' },
  adjuster_escalated: { icon: User, color: '#F59E0B', label: 'Sent to Adjuster 📋', bg: 'rgba(245,158,11,0.1)' },
  siu_escalated: { icon: AlertTriangle, color: '#EF4444', label: 'SIU Investigation 🔍', bg: 'rgba(239,68,68,0.1)' },
  rejected: { icon: AlertTriangle, color: '#EF4444', label: 'Coverage Rejected ❌', bg: 'rgba(239,68,68,0.1)' },
};

const AGENT_COLORS = {
  A2_FNOL_Intake: { color: '#06B6D4', label: 'A2 — FNOL Intake' },
  A3_Coverage_Verification: { color: '#4F46E5', label: 'A3 — Coverage Verify' },
  A4_Damage_Assessment: { color: '#10B981', label: 'A4 — Medical Expense Assessment' },
  A5_Fraud_Risk_Scoring: { color: '#F59E0B', label: 'A5 — Fraud Scoring' },
  A6_Settlement: { color: '#10B981', label: 'A6 — Settlement' },
  A7_Adjuster_Handoff: { color: '#EF4444', label: 'A7 — Adjuster Handoff' },
  A8_Chatbot: { color: '#8B5CF6', label: 'A8 — Claimant Notify' },
};
import api from '../../services/api';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import './RagChat.css';

const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

/* ── relative time helper ─────────────────────────────────── */
function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hello! I am your ClaimAI assistant. Ask me anything about your uploaded documents, policies, or knowledge graph.',
  timestamp: new Date(),
  metadata: null,
};

function ClaimIntakeWidget({
  policies,
  selectedPol,
  setSelectedPol,
  files,
  setFiles,
  extracting,
  setExtracting,
  extracted,
  setExtracted,
  error,
  setError,
  submitting,
  setSubmitting,
  result,
  setResult
}) {
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleFiles = (filesList) => {
    if (!filesList || filesList.length === 0) return;
    const newFiles = Array.from(filesList);
    setFiles(prev => [...prev, ...newFiles]);
    setExtracted(null);
    setError(null);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setExtracted(null);
    setError(null);
  };

  const triggerExtraction = async () => {
    if (files.length === 0) return toast.error('Please upload at least one document');
    if (!selectedPol) return toast.error('Please select a policy first');
    setExtracting(true);
    setExtracted(null);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('policy_id', selectedPol.id);
      files.forEach(f => {
        fd.append('files', f);
      });
      const res = await api.post('/fnol/extract-from-doc', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setExtracted(res.data);
      toast.success('✨ Details extracted from all documents!');
    } catch (err) {
      setError('AI extraction failed. Please try again.');
      toast.error('Extraction failed');
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPol) return toast.error('Please select a policy');
    if (files.length === 0) return toast.error('Please upload a claim document');
    if (!extracted) return toast.error('Waiting for AI extraction…');
    setSubmitting(true);
    try {
      const res = await api.post('/fnol/submit', {
        policy_id: selectedPol.id,
        incident_date: extracted.incident_date,
        claim_type: extracted.claim_type,
        channel: extracted.channel || 'web',
        incident_description: extracted.incident_description,
        incident_location: extracted.incident_location || '',
        contact_phone: '',
        temp_file_path: extracted.temp_file_path || null,
        temp_file_paths: extracted.temp_file_paths || null,
        extracted_data: extracted,
        raw_text: extracted.raw_text || '',
      });
      setResult(res.data);
      toast.success('Claim submitted! AI pipeline running…');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    const outcome = OUTCOME_CONFIG[result.outcome] || OUTCOME_CONFIG.adjuster_escalated;
    const OutcomeIcon = outcome.icon;
    return (
      <div className="claim-result-chat-panel" style={{ marginTop: 12 }}>
        <div style={{
          background: outcome.bg, border: `1px solid ${outcome.color}44`,
          borderRadius: 12, padding: '14px 16px', marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${outcome.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <OutcomeIcon size={18} color={outcome.color} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: outcome.color }}>{outcome.label}</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{result.outcome_msg}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <a 
              href={`/dashboard/claims/${result.claim_id}`} 
              style={{ color: '#818cf8', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'underline' }}
            >
              {result.claim_number}
            </a>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{result.elapsed_ms}ms</div>
          </div>
        </div>

        <div style={{ marginBottom: 10, fontSize: '0.82rem', fontWeight: 600, color: '#818cf8', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={12} /> Agent Pipeline Trace
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '250px', overflowY: 'auto' }}>
          {(result.pipeline_trace || []).map((step, i) => {
            const cfg = AGENT_COLORS[step.step] || { color: '#818CF8', label: step.step };
            const res = step.result || {};
            return (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${step.status === 'error' ? 'rgba(239,68,68,0.2)' : `${cfg.color}22`}`,
                borderLeft: `3px solid ${cfg.color}`,
                borderRadius: 8, padding: '8px 12px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: cfg.color, fontSize: '0.78rem' }}>{cfg.label}</span>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>{step.ms}ms</span>
                    <span className={`badge ${step.status === 'success' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.65rem', padding: '1px 5px' }}>{step.status}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
                  {res.message || res.reason || res.error || '—'}
                  {res.fraud_score !== undefined && <span style={{ marginLeft: 6, color: res.fraud_score > 0.5 ? '#EF4444' : '#10B981' }}>Fraud: {res.fraud_score}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const missingSuggested = extracted?.missing_categories?.filter(c =>
    ['claim_form', 'medical_report', 'test_report', 'id_card'].includes(c)
  ) || [];
  const hasAllSuggested = !extracted || missingSuggested.length === 0;

  return (
    <div className="claim-intake-chat-widget" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Policy Selection */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: '0.8rem', fontWeight: 600, color: '#818cf8' }}>
          <Shield size={12} />
          <span>Step 1: Select Active Policy</span>
        </div>
        {policies.length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>No active policies found.</div>
        ) : (
          <select
            value={selectedPol?.id || ''}
            onChange={(e) => {
              const matched = policies.find(p => String(p.id) === e.target.value);
              setSelectedPol(matched || null);
            }}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              padding: '8px 10px',
              borderRadius: 6,
              fontSize: '0.82rem',
              outline: 'none'
            }}
          >
            <option value="">-- Choose a Policy --</option>
            {policies.map(p => (
              <option key={p.id} value={p.id}>
                {p.policy_number} ({p.plan_name || p.policy_type.toUpperCase()})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Upload zone */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: '0.8rem', fontWeight: 600, color: '#818cf8' }}>
          <Upload size={12} />
          <span>Step 2: Upload Documents</span>
        </div>

        {files.length === 0 ? (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? '#818cf8' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 8, padding: '20px 14px', textAlign: 'center', cursor: 'pointer',
              background: dragOver ? 'rgba(99,102,241,0.05)' : 'rgba(0,0,0,0.2)', transition: 'all 0.2s',
            }}
          >
            <Upload size={20} style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 6 }} />
            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Click to browse or drop files here</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>PDF, DOCX, Images up to 5MB</div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
              {files.map((file, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 6, padding: '6px 10px', fontSize: '0.78rem' }}>
                  <FileText size={14} style={{ color: '#818cf8' }} />
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                  <button onClick={() => removeFile(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 2 }}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6, color: '#fff', padding: '4px 8px', fontSize: '0.72rem', cursor: 'pointer'
                }}
              >
                + Add File
              </button>
              <button
                onClick={() => { setFiles([]); setExtracted(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444', padding: '4px 8px', fontSize: '0.72rem', cursor: 'pointer'
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        )}
        <input ref={fileRef} type="file" multiple hidden accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx" onChange={e => { if (e.target.files) handleFiles(e.target.files); e.target.value = ''; }} />
        
        <div style={{ marginTop: 8, fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Sparkles size={10} style={{ color: '#818cf8' }} />
          <span>Required: CLAIM FORM, MEDICAL REPORT, TEST REPORT, ID CARD.</span>
        </div>
      </div>

      {/* Extract action */}
      {files.length > 0 && !extracted && !extracting && (
        <button
          onClick={triggerExtraction}
          disabled={!selectedPol}
          style={{
            background: selectedPol ? '#10B981' : 'rgba(16,185,129,0.4)',
            border: 'none',
            borderRadius: 8, color: '#fff', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 600,
            cursor: selectedPol ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
          }}
        >
          <Sparkles size={12} /> Extract Claim Details
        </button>
      )}

      {/* Extracting Spinner */}
      {extracting && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.78rem' }}>
          <Loader2 size={14} className="spin-icon" style={{ color: '#818cf8' }} />
          <span>ClaimAI Extracting Details…</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div style={{ padding: '8px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#fca5a5', fontSize: '0.78rem' }}>
          {error}
        </div>
      )}

      {/* Extracted Details Confirmation */}
      {extracted && !extracting && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #10B98144', borderRadius: 10, padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10B981' }}>✓ Extracted Details</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.75rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: 6 }}>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>CLAIM TYPE</div>
              <div style={{ fontWeight: 600 }}>{CLAIM_TYPE_LABELS[extracted.claim_type] || extracted.claim_type}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: 6 }}>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>INCIDENT DATE</div>
              <div style={{ fontWeight: 600 }}>{extracted.incident_date}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: 6, gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>DESCRIPTION</div>
              <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{extracted.incident_description}</div>
            </div>
          </div>

          {/* Categorized Documents list */}
          {extracted.documents && extracted.documents.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>CATEGORIZED DOCUMENTS</div>
              {extracted.documents.map((doc, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.1)', padding: '4px 8px', borderRadius: 4, fontSize: '0.72rem' }}>
                  <span>{doc.filename}</span>
                  <span style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.65rem' }}>{doc.category.replace('_', ' ').toUpperCase()}</span>
                </div>
              ))}
            </div>
          )}

          {/* Missing document list warning */}
          {extracted.missing_categories && extracted.missing_categories.length > 0 && (
            <div style={{ padding: '8px 10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, color: '#fcd34d', fontSize: '0.72rem' }}>
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                <AlertTriangle size={12} /> Missing Suggested Documents
              </div>
              <div>
                We missed: <span style={{ fontWeight: 600 }}>{extracted.missing_categories.map(c => c.toUpperCase()).join(', ')}</span>.
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            {hasAllSuggested ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  flex: 1,
                  background: '#4f46e5',
                  border: 'none',
                  borderRadius: 6, color: '#fff', padding: '6px 12px', fontSize: '0.78rem', fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                }}
              >
                {submitting ? <Loader2 size={12} className="spin-icon" /> : <Send size={12} />}
                <span>Submit Claim</span>
              </button>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  flex: 1,
                  background: '#F59E0B',
                  border: 'none',
                  borderRadius: 6, color: '#fff', padding: '6px 12px', fontSize: '0.78rem', fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                }}
              >
                <Upload size={12} />
                <span>Upload Missing Docs</span>
              </button>
            )}
            <button
              onClick={() => { setExtracted(null); }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6, color: '#fff', padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer'
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


export default function RagChat() {
  /* ── session sidebar state ── */
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  /* ── chat state ── */
  const [messages, setMessages] = useState([WELCOME]);
  const [msgsLoading, setMsgsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  /* ── policy and intake states ── */
  const [policies, setPolicies] = useState([]);
  const [intakePolicy, setIntakePolicy] = useState(null);
  const [intakeFiles, setIntakeFiles] = useState([]);
  const [intakeExtracting, setIntakeExtracting] = useState(false);
  const [intakeExtracted, setIntakeExtracted] = useState(null);
  const [intakeError, setIntakeError] = useState(null);
  const [intakeSubmitting, setIntakeSubmitting] = useState(false);
  const [intakeResult, setIntakeResult] = useState(null);

  /* load policies on mount */
  useEffect(() => {
    api.get('/policies/mine')
      .then(r => setPolicies(r.data || []))
      .catch(() => { });
  }, []);

  const triggerIntakeFlow = () => {
    const intakeMsg = {
      id: 'intake_' + Date.now(),
      role: 'assistant',
      content: 'Sure! I can help you file a new claim. Please select your policy and upload the required documents below to begin.',
      timestamp: new Date(),
      metadata: { action: 'initiate_claim' }
    };
    setMessages(prev => [...prev.filter(m => m.id !== 'welcome'), intakeMsg]);
    setIntakePolicy(null);
    setIntakeFiles([]);
    setIntakeExtracted(null);
    setIntakeError(null);
    setIntakeResult(null);
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  /* ── load sessions on mount ── */
  useEffect(() => {
    api.get('/rag/sessions')
      .then(r => setSessions(r.data))
      .catch(() => { })
      .finally(() => setSessionsLoading(false));
  }, []);

  /* ── select session → load its messages ── */
  const selectSession = useCallback(async (sid) => {
    if (sid === activeSessionId) return;
    setActiveSessionId(sid);
    setMsgsLoading(true);
    setMessages([]);
    try {
      const r = await api.get(`/rag/sessions/${sid}/messages`);
      const fetched = r.data.map(m => ({
        id: String(m.id),
        role: m.role,
        content: m.content,
        timestamp: new Date(m.created_at),
        metadata: null,
      }));
      setMessages(fetched.length ? fetched : [WELCOME]);
    } catch {
      setMessages([WELCOME]);
    } finally {
      setMsgsLoading(false);
    }
  }, [activeSessionId]);

  /* ── create new session ── */
  const newSession = async () => {
    try {
      const r = await api.post('/rag/sessions');
      setSessions(prev => [r.data, ...prev]);
      setActiveSessionId(r.data.id);
      setMessages([WELCOME]);
    } catch {
      toast.error('Could not create session');
    }
  };

  /* ── delete session ── */
  const deleteSession = async (e, sid) => {
    e.stopPropagation();
    try {
      await api.delete(`/rag/sessions/${sid}`);
      setSessions(prev => prev.filter(s => s.id !== sid));
      if (activeSessionId === sid) {
        setActiveSessionId(null);
        setMessages([WELCOME]);
      }
      toast.success('Session deleted');
    } catch {
      toast.error('Could not delete session');
    }
  };

  /* ── send message ── */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = {
      id: String(Date.now()),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      metadata: null,
    };
    setMessages(prev => [...prev.filter(m => m.id !== 'welcome'), userMsg]);
    const sentQuery = input.trim();
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/rag/chat', {
        query: sentQuery,
        session_id: activeSessionId || undefined,
      });

      const { answer, sources = [], confidence = 0, retrieved_chunks = 0, session_id, action } = res.data;

      const assistantMsg = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: answer || 'I could not generate a response. Please try again.',
        timestamp: new Date(),
        metadata: { sources, confidence, retrieved_chunks, action },
      };

      if (action === 'initiate_claim') {
        setIntakePolicy(null);
        setIntakeFiles([]);
        setIntakeExtracted(null);
        setIntakeError(null);
        setIntakeResult(null);
      }

      setLoading(false);
      setMessages(prev => [...prev, assistantMsg]);

      /* update session list */
      if (session_id) {
        setActiveSessionId(session_id);
        setSessions(prev => {
          const exists = prev.find(s => s.id === session_id);
          if (exists) {
            const updated = { ...exists, message_count: (exists.message_count || 0) + 2 };
            return [updated, ...prev.filter(s => s.id !== session_id)];
          }
          /* brand new session — reload list */
          api.get('/rag/sessions').then(r => setSessions(r.data)).catch(() => { });
          return prev;
        });
      }
    } catch {
      toast.error('Failed to get response from backend');
      setLoading(false);
    }
  };

  /* ── start fresh (no session) ── */
  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([WELCOME]);
  };

  /* ══════════════ RENDER ══════════════════════════════════════ */
  return (
    <div className="rag-page-wrapper">

      {/* ═══ LEFT SIDEBAR ══════════════════════════════════════ */}
      <aside className={`chat-history-sidebar ${collapsed ? 'collapsed' : ''}`}>

        {/* collapse toggle */}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(v => !v)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              className="sidebar-inner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* header */}
              <div className="chat-sidebar-header">
                <span className="chat-sidebar-title">
                  <MessageSquare size={13} />
                  Chat History
                </span>
                <button className="new-chat-btn" onClick={newSession} title="New session">
                  <Plus size={13} /> New
                </button>
              </div>

              {/* session list */}
              <div className="session-list">
                {sessionsLoading ? (
                  <div className="session-placeholder">
                    <Loader2 size={16} className="spin-icon" /> Loading…
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="session-placeholder">
                    <MessageSquare size={28} style={{ opacity: 0.25 }} />
                    <span>No history yet.</span>
                    <span>Start a new chat!</span>
                  </div>
                ) : (
                  sessions.map(s => (
                    <div
                      key={s.id}
                      className={`session-item ${activeSessionId === s.id ? 'active' : ''}`}
                      onClick={() => selectSession(s.id)}
                    >
                      <MessageSquare size={13} className="session-icon" />
                      <div className="session-body">
                        <span className="session-title">{s.title}</span>
                        <span className="session-meta">
                          <Clock size={9} />
                          {timeAgo(s.started_at)}
                          {s.message_count > 0 && (
                            <span className="session-count">{s.message_count}</span>
                          )}
                        </span>
                      </div>
                      <button
                        className="session-del-btn"
                        onClick={e => deleteSession(e, s.id)}
                        title="Delete"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* ═══ MAIN CHAT ════════════════════════════════════════= */}
      <motion.div
        className="rag-chat-container"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {/* header */}
        <div className="chat-header">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="text-cyan-400" />
              Speak to ClaimAI
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              {activeSessionId
                ? `Session #${activeSessionId} — ask questions about your policies & documents`
                : 'Ask questions to search through your extracted knowledge base, policies, and claims.'}
            </p>
          </div>
          <button className="clear-chat-btn" onClick={handleNewChat} title="New Chat">
            <Plus size={16} />
            <span>New Chat</span>
          </button>
        </div>

        {/* chat window */}
        <div className="chat-window">
          <div className="messages-area">
            {msgsLoading ? (
              <div className="msgs-loading">
                <Loader2 size={22} className="spin-icon" /> Loading messages…
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -10 }}
                    className={`message-wrapper ${msg.role}`}
                  >
                    <div className="message-avatar">
                      {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                    </div>
                    <div className="message-content">
                      <div className="message-text">
                        {msg.role === 'assistant' ? (
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        ) : (
                          msg.content
                        )}
                      </div>

                      {/* Quick starter button for Welcome message */}
                      {msg.id === 'welcome' && (
                        <div style={{ marginTop: 10 }}>
                          <button
                            onClick={triggerIntakeFlow}
                            style={{
                              background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 8,
                              padding: '8px 14px',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              boxShadow: '0 2px 8px rgba(79,70,229,0.3)'
                            }}
                          >
                            <Sparkles size={13} />
                            File a New Claim
                          </button>
                        </div>
                      )}

                      {/* Interactive Intake Widget */}
                      {msg.metadata?.action === 'initiate_claim' && (
                        <ClaimIntakeWidget
                          policies={policies}
                          selectedPol={intakePolicy}
                          setSelectedPol={setIntakePolicy}
                          files={intakeFiles}
                          setFiles={setIntakeFiles}
                          extracting={intakeExtracting}
                          setExtracting={setIntakeExtracting}
                          extracted={intakeExtracted}
                          setExtracted={setIntakeExtracted}
                          error={intakeError}
                          setError={setIntakeError}
                          submitting={intakeSubmitting}
                          setSubmitting={setIntakeSubmitting}
                          result={intakeResult}
                          setResult={setIntakeResult}
                        />
                      )}
                      {msg.metadata?.sources?.length > 0 && (
                        <div className="message-sources">
                          <div className="sources-header">
                            <BookOpen size={14} />
                            <span>Sources ({msg.metadata.sources.length})</span>
                          </div>
                          <div className="sources-list">
                            {msg.metadata.sources.map((src, idx) => (
                              <div key={idx} className="source-item">
                                <CheckCircle2 size={12} />
                                <span>{src.filename}</span>
                                {src.section && (
                                  <span className="section-info">{src.section}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="message-time">
                        {(msg.timestamp instanceof Date
                          ? msg.timestamp
                          : new Date(msg.timestamp)
                        ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <motion.div
                    key="typing-loader"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -10 }}
                    className="message-wrapper assistant"
                  >
                    <div className="message-avatar"><Bot size={20} /></div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span /><span /><span />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            )}
          </div>

          <form className="chat-input-area" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about your claims, policies, or coverage…"
              disabled={loading || msgsLoading}
              className="chat-input"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading || msgsLoading}
              className="send-button"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}