import { useState } from 'react';
import { CheckCircle, XCircle, Loader2, Trophy } from 'lucide-react';

export function QuizView({ questions, isLoading }) {
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
        <p className="text-slate-400 text-sm">Claude is crafting your quiz...</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return <p className="text-slate-500 text-center py-10">No quiz available.</p>;
  }

  const score = submitted
    ? Object.entries(selected).filter(([qi, ai]) => ai === questions[+qi].correctAnswer).length
    : 0;

  const pct = submitted ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="space-y-5">
      {questions.map((q, qi) => {
        const userAns = selected[qi];
        const isCorrect = submitted && userAns === q.correctAnswer;
        const isWrong = submitted && userAns !== undefined && !isCorrect;

        return (
          <div key={qi} className="glass rounded-xl p-5">
            <div className="flex items-start gap-2 mb-4">
              <span className="text-xs font-mono text-slate-500 mt-0.5 w-5">Q{qi + 1}</span>
              <p className="text-sm font-medium text-slate-200 flex-1">{q.question}</p>
              {submitted && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
              {submitted && isWrong && <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
            </div>

            <div className="space-y-2 ml-7">
              {q.options.map((opt, oi) => {
                const isSelected = userAns === oi;
                const isCorrectOpt = oi === q.correctAnswer;

                let cls = 'w-full text-left px-4 py-2.5 rounded-lg text-sm border transition-all ';
                if (!submitted) {
                  cls += isSelected
                    ? 'border-blue-500 bg-blue-500/10 text-blue-200'
                    : 'border-white/[0.06] text-slate-400 hover:border-slate-500 hover:text-slate-200 cursor-pointer';
                } else {
                  if (isCorrectOpt) cls += 'border-emerald-500 bg-emerald-500/10 text-emerald-200 font-medium';
                  else if (isSelected) cls += 'border-rose-500 bg-rose-500/10 text-rose-300';
                  else cls += 'border-white/[0.04] text-slate-600';
                }

                return (
                  <button key={oi} disabled={submitted} className={cls}
                    onClick={() => !submitted && setSelected(p => ({ ...p, [qi]: oi }))}>
                    <span className="font-mono text-xs opacity-60 mr-2">{String.fromCharCode(65 + oi)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {submitted && q.explanation && (
              <div className="mt-3 ml-7 p-3 bg-white/[0.03] rounded-lg border border-white/[0.05]">
                <p className="text-xs text-slate-400"><span className="text-blue-400 font-medium">Explanation: </span>{q.explanation}</p>
              </div>
            )}
          </div>
        );
      })}

      {submitted && (
        <div className="glass rounded-xl p-6 text-center animate-fadeInUp">
          <Trophy className={`w-10 h-10 mx-auto mb-2 ${pct === 100 ? 'text-yellow-400' : pct >= 70 ? 'text-blue-400' : 'text-slate-500'}`} />
          <p className="text-3xl font-bold text-slate-100 mb-1">{score}/{questions.length}</p>
          <p className="text-slate-400 text-sm">
            {pct === 100 ? 'Perfect! Outstanding work 🎉' : pct >= 70 ? 'Great job! Keep it up!' : 'Keep studying — you got this!'}
          </p>
        </div>
      )}

      <div className="flex justify-center">
        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(selected).length !== questions.length}
            className="px-8 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Submit Quiz ({Object.keys(selected).length}/{questions.length} answered)
          </button>
        ) : (
          <button
            onClick={() => { setSelected({}); setSubmitted(false); }}
            className="px-8 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
