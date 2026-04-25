import { Loader2 } from 'lucide-react';

export function SummaryView({ summary, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
        <p className="text-slate-400 text-sm">Claude is reading your document...</p>
      </div>
    );
  }

  if (!summary) {
    return <p className="text-slate-500 text-center py-10">No summary available.</p>;
  }

  // Render markdown-ish headings
  const lines = summary.split('\n');
  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return <h3 key={i} className="text-base font-semibold text-blue-300 mt-4 mb-1">{line.replace('## ', '')}</h3>;
        }
        if (line.startsWith('# ')) {
          return <h2 key={i} className="text-lg font-bold text-blue-200 mt-2 mb-1">{line.replace('# ', '')}</h2>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-semibold text-slate-200">{line.replace(/\*\*/g, '')}</p>;
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        return <p key={i} className="text-slate-300 text-sm leading-relaxed">{line}</p>;
      })}
    </div>
  );
}
