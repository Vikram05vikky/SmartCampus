import { FileText, Trash2, FileQuestion, BookOpen, Loader2 } from 'lucide-react';

export function FileList({ documents, onDelete, onSummarize, onGenerateQuiz }) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-10 text-slate-600">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p className="text-sm">No documents yet — upload one above</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div key={doc.id} className="glass rounded-xl p-4 flex items-center justify-between gap-3 hover:bg-white/[0.06] transition-all animate-fadeInUp">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{doc.filename}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {doc.status === 'ready'
                  ? `${(doc.content.length / 1000).toFixed(1)}k chars`
                  : <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Reading...</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <ActionBtn
              onClick={() => onSummarize(doc)}
              disabled={doc.status !== 'ready'}
              title="Summarize"
              color="green"
              icon={<BookOpen className="w-4 h-4" />}
            />
            <ActionBtn
              onClick={() => onGenerateQuiz(doc)}
              disabled={doc.status !== 'ready'}
              title="Generate Quiz"
              color="purple"
              icon={<FileQuestion className="w-4 h-4" />}
            />
            <ActionBtn
              onClick={() => onDelete(doc.id)}
              title="Delete"
              color="red"
              icon={<Trash2 className="w-4 h-4" />}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ActionBtn({ onClick, disabled, title, color, icon }) {
  const colors = {
    green: 'text-emerald-400 hover:bg-emerald-500/10 disabled:text-slate-600',
    purple: 'text-violet-400 hover:bg-violet-500/10 disabled:text-slate-600',
    red: 'text-rose-400 hover:bg-rose-500/10',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-colors disabled:cursor-not-allowed ${colors[color]}`}
    >
      {icon}
    </button>
  );
}
