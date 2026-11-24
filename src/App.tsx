import { useCallback, useEffect, useState } from 'react';
import { GuestView } from './components/GuestView';
import { Navbar } from './components/Navbar';
import { StaffView } from './components/StaffView';
import { Toast, ToastMessage } from './components/Toast';
import { useLoanTracker } from './hooks/useLoanTracker';
import { AppMode } from './types';

export default function App() {
  const [mode, setMode] = useState<AppMode>('guest');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const {
    loans,
    stats,
    nowTick,
    addLoan,
    markAsReturned,
    undoReturn,
    resetDemoData,
  } = useLoanTracker();

  const notify = useCallback((text: string, tone: 'success' | 'info' = 'success') => {
    setToast({ id: Date.now(), text, tone });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleModeChange = (nextMode: AppMode) => {
    setMode(nextMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#102538] flex flex-col">
      <Navbar
        mode={mode}
        onModeChange={handleModeChange}
        overdueCount={stats.overdueRecords}
        activeCount={stats.activeRecords}
      />

      <main className="flex-1">
        {mode === 'guest' ? (
          <GuestView onRequestAmenity={addLoan} onNotify={notify} />
        ) : (
          <StaffView
            loans={loans}
            stats={stats}
            nowTick={nowTick}
            onAddLoan={addLoan}
            onMarkReturned={markAsReturned}
            onUndoReturn={undoReturn}
            onResetDemo={resetDemoData}
            onNotify={notify}
          />
        )}
      </main>

      <footer className="border-t border-[#E8E0D2] bg-white/70 py-5 text-center text-xs text-[#5D6B78]">
        <div className="mx-auto max-w-6xl px-4">
          <span className="font-display text-sm font-semibold text-[#102538]">
            Andaman Breeze Hotel
          </span>{' '}
          • Front Office & Digital Concierge System • 24/7 Reception Ext. 0
        </div>
      </footer>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
