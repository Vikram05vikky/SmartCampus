import { useState } from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { FileList } from './components/FileList';
import { ChatInterface } from './components/ChatInterface';
import { Modal } from './components/Modal';
import { SummaryView } from './components/SummaryView';
import { QuizView } from './components/QuizView';
import { ApiKeyBanner } from './components/ApiKeyBanner';
import {
  setGroqApiKey,
  summarizeDocument,
  generateQuiz,
  askQuestionWithHistory,
} from './claude.js';
import { extractFileContent } from './fileReader.js';

// ── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(false);

  const [modal, setModal] = useState({
    type: null, isOpen: false, isLoading: false, content: null, title: '',
  });

  // ── Upload ──────────────────────────────────────────────────────────────

  const handleUpload = async (file) => {
    setIsUploading(true);
    const id = crypto.randomUUID();
    setDocuments(prev => [...prev, { id, filename: file.name, content: '', status: 'loading' }]);

    try {
      const content = await extractFileContent(file);
      setDocuments(prev =>
        prev.map(d => d.id === id ? { ...d, content, status: 'ready' } : d)
      );
    } catch (err) {
      alert(`Error reading file: ${err.message}`);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } finally {
      setIsUploading(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────

  const handleDelete = (id) => {
    if (!confirm('Delete this document?')) return;
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // ── Summarize ───────────────────────────────────────────────────────────

  const handleSummarize = async (doc) => {
    setModal({ type: 'summary', isOpen: true, isLoading: true, content: null, title: `Summary: ${doc.filename}` });
    try {
      const summary = await summarizeDocument(doc.content, doc.filename);
      setModal(prev => ({ ...prev, isLoading: false, content: summary }));
    } catch (err) {
      setModal(prev => ({ ...prev, isLoading: false, content: `Error: ${err.message}` }));
    }
  };

  // ── Quiz ────────────────────────────────────────────────────────────────

  const handleGenerateQuiz = async (doc) => {
    setModal({ type: 'quiz', isOpen: true, isLoading: true, content: [], title: `Quiz: ${doc.filename}` });
    try {
      const questions = await generateQuiz(doc.content, doc.filename);
      setModal(prev => ({ ...prev, isLoading: false, content: questions }));
    } catch (err) {
      alert(`Failed to generate quiz: ${err.message}`);
      setModal(prev => ({ ...prev, isOpen: false }));
    }
  };

  // ── Chat ────────────────────────────────────────────────────────────────

  const handleSendQuestion = async (messages) => {
    return askQuestionWithHistory(messages, documents);
  };

  // ── UI ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Smart Campus Assistant</h1>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Powered by LLaMA 3 via Groq (Free)
              </p>
            </div>
          </div>
        </header>

        {/* API Key Banner */}
        {!apiKeySet && (
          <ApiKeyBanner onSave={(key) => { setGroqApiKey(key); setApiKeySet(true); }} />
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-5">
            <FileUpload onUpload={handleUpload} isUploading={isUploading} />

            <div className="glass rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
                Your Documents
              </h2>
              <FileList
                documents={documents}
                onDelete={handleDelete}
                onSummarize={handleSummarize}
                onGenerateQuiz={handleGenerateQuiz}
              />
            </div>

            {/* Quick tips */}
            <div className="glass rounded-2xl p-5 text-xs text-slate-500 space-y-1.5">
              <p className="text-slate-400 font-medium mb-2">Tips for best results</p>
              <p>📄 <strong className="text-slate-400">TXT files work best</strong> — copy text from PDFs into a .txt file</p>
              <p>📚 Upload multiple documents — the chat searches across all of them</p>
              <p>🧠 Use the quiz feature to test your understanding after reading</p>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <ChatInterface onSendQuestion={handleSendQuestion} />
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modal.isOpen} onClose={() => setModal(m => ({ ...m, isOpen: false }))} title={modal.title}>
        {modal.type === 'summary' && (
          <SummaryView summary={modal.content} isLoading={modal.isLoading} />
        )}
        {modal.type === 'quiz' && (
          <QuizView questions={modal.content} isLoading={modal.isLoading} />
        )}
      </Modal>
    </div>
  );
}
