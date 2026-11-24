import { ClipboardList, Compass, Sparkles } from 'lucide-react';
import { AppMode } from '../types';

interface NavbarProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  overdueCount: number;
  activeCount: number;
}

export function Navbar({ mode, onModeChange, overdueCount, activeCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E0D2]/90 bg-[#102538]/95 text-[#FAF7F2] backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Brand Emblem */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#DFC285] to-[#B68B3C] text-[#102538] shadow-sm">
            <Sparkles className="h-4.5 w-4.5" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="font-display text-lg font-semibold leading-tight tracking-wide text-[#FAF7F2] sm:text-xl truncate">
              Andaman Breeze
            </div>
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#DFC285]/90 truncate">
              {mode === 'guest' ? 'Digital Concierge' : 'Front Office Tracker'}
            </div>
          </div>
        </div>

        {/* Mode Switcher */}
        <nav
          aria-label="สลับโหมดการใช้งาน"
          className="flex shrink-0 items-center rounded-full border border-white/15 bg-[#0B1A28]/80 p-1"
        >
          <button
            type="button"
            onClick={() => onModeChange('guest')}
            aria-pressed={mode === 'guest'}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:text-sm cursor-pointer ${
              mode === 'guest'
                ? 'bg-[#FAF7F2] text-[#102538] shadow-sm'
                : 'text-[#FAF7F2]/75 hover:text-white'
            }`}
          >
            <Compass className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>แขกเข้าพัก</span>
            <span className="hidden md:inline text-[11px] opacity-70">(Guest)</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('staff')}
            aria-pressed={mode === 'staff'}
            className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:text-sm cursor-pointer ${
              mode === 'staff'
                ? 'bg-[#C59B4E] text-[#102538] shadow-sm font-semibold'
                : 'text-[#FAF7F2]/75 hover:text-white'
            }`}
          >
            <ClipboardList className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>พนักงาน</span>
            <span className="hidden md:inline text-[11px] opacity-80">(Staff)</span>
            {overdueCount > 0 ? (
              <span
                title={`${overdueCount} รายการเกินกำหนด`}
                className={`ml-0.5 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                  mode === 'staff'
                    ? 'bg-[#102538] text-[#FAF7F2]'
                    : 'bg-[#D9534F] text-white'
                }`}
              >
                {overdueCount}
              </span>
            ) : activeCount > 0 ? (
              <span
                className={`ml-0.5 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                  mode === 'staff'
                    ? 'bg-[#102538]/15 text-[#102538]'
                    : 'bg-white/15 text-[#DFC285]'
                }`}
              >
                {activeCount}
              </span>
            ) : null}
          </button>
        </nav>
      </div>
    </header>
  );
}
