import { CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: number;
  text: string;
  tone?: 'success' | 'info';
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 sm:bottom-6"
    >
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#C59B4E]/40 bg-[#102538] px-4 py-3 text-sm text-[#FAF7F2] shadow-xl">
        <div className="flex items-center gap-2.5 min-w-0">
          {toast.tone === 'info' ? (
            <Info className="h-4.5 w-4.5 shrink-0 text-[#DFC285]" />
          ) : (
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-[#DFC285]" />
          )}
          <span className="font-medium leading-snug">{toast.text}</span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="ปิดการแจ้งเตือน"
          className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
