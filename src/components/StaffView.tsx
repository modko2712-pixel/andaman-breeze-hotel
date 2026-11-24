import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Package,
  PlusCircle,
  RotateCcw,
  Search,
  Sparkles,
  Undo2,
  User,
} from 'lucide-react';
import { AMENITIES_CATALOG } from '../data/hotelData';
import { AddLoanInput, getLoanStatus } from '../hooks/useLoanTracker';
import { LoanRecord, LoanStatus } from '../types';

interface StaffViewProps {
  loans: LoanRecord[];
  stats: {
    activeRecords: number;
    activePieces: number;
    overdueRecords: number;
    returnedToday: number;
  };
  nowTick: number;
  onAddLoan: (input: AddLoanInput) => void;
  onMarkReturned: (id: string) => void;
  onUndoReturn: (id: string) => void;
  onResetDemo: () => void;
  onNotify: (text: string, tone?: 'success' | 'info') => void;
}

function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function formatThaiDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear();

  const timeStr = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

  if (isToday) return `วันนี้ ${timeStr} น.`;
  if (isTomorrow) return `พรุ่งนี้ ${timeStr} น.`;
  return `${d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} ${timeStr} น.`;
}

function StatusBadge({ status }: { status: LoanStatus }) {
  if (status === 'overdue') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[#F3C5BE] bg-[#FDF0EE] px-2.5 py-0.5 text-[11px] font-semibold text-[#B43C2F]">
        <AlertTriangle className="h-3 w-3" />
        เกินกำหนด (Overdue)
      </span>
    );
  }
  if (status === 'returned') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[#BBE0CB] bg-[#EDF7F1] px-2.5 py-0.5 text-[11px] font-semibold text-[#1F6E4A]">
        <CheckCircle2 className="h-3 w-3" />
        คืนแล้ว (Returned)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#F0D9A3] bg-[#FEF6E4] px-2.5 py-0.5 text-[11px] font-semibold text-[#9A6B16]">
      <Clock className="h-3 w-3" />
      กำลังยืม (Active)
    </span>
  );
}

export function StaffView({
  loans,
  stats,
  nowTick,
  onAddLoan,
  onMarkReturned,
  onUndoReturn,
  onResetDemo,
  onNotify,
}: StaffViewProps) {
  // Quick Loan Form state
  const [roomNumber, setRoomNumber] = useState('');
  const [guestName, setGuestName] = useState('');
  const [amenityId, setAmenityId] = useState(AMENITIES_CATALOG[0].id);
  const [quantity, setQuantity] = useState(1);
  const [dueLocal, setDueLocal] = useState(() =>
    toDatetimeLocalValue(new Date(Date.now() + 4 * 60 * 60 * 1000))
  );
  const [notes, setNotes] = useState('');

  // Table filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LoanStatus>('all');

  const applyPresetDue = (mode: '2h' | 'tonight' | 'checkout') => {
    const d = new Date();
    if (mode === '2h') {
      d.setHours(d.getHours() + 2);
    } else if (mode === 'tonight') {
      d.setHours(20, 0, 0, 0);
      if (d.getTime() < Date.now()) {
        d.setDate(d.getDate() + 1);
      }
    } else {
      d.setDate(d.getDate() + 1);
      d.setHours(12, 0, 0, 0);
    }
    setDueLocal(toDatetimeLocalValue(d));
  };

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim()) return;

    const selected = AMENITIES_CATALOG.find((a) => a.id === amenityId) ?? AMENITIES_CATALOG[0];
    const parsedDue = new Date(dueLocal);
    const dueIso = Number.isNaN(parsedDue.getTime())
      ? new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
      : parsedDue.toISOString();

    onAddLoan({
      roomNumber: roomNumber.trim(),
      guestName: guestName.trim() || `Guest Room ${roomNumber.trim()}`,
      amenityId: selected.id,
      amenityName: `${selected.nameTh} (${selected.nameEn})`,
      quantity,
      dueAt: dueIso,
      source: 'staff',
      notes: notes.trim() || undefined,
    });

    onNotify(`บันทึกการยืม "${selected.nameTh}" ห้อง ${roomNumber.trim()} เรียบร้อยแล้ว`);
    setRoomNumber('');
    setGuestName('');
    setQuantity(1);
    setNotes('');
    setStatusFilter('all');
  };

  const filteredLoans = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return loans
      .map((loan) => ({ loan, status: getLoanStatus(loan, nowTick) }))
      .filter(({ loan, status }) => {
        if (statusFilter !== 'all' && status !== statusFilter) return false;
        if (!q) return true;
        return (
          loan.roomNumber.toLowerCase().includes(q) ||
          loan.guestName.toLowerCase().includes(q) ||
          loan.amenityName.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        // Priority order: overdue -> active -> returned
        const rank: Record<LoanStatus, number> = { overdue: 0, active: 1, returned: 2 };
        if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
        return new Date(b.loan.borrowedAt).getTime() - new Date(a.loan.borrowedAt).getTime();
      });
  }, [loans, nowTick, searchQuery, statusFilter]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-16 sm:px-6 sm:py-8">
      {/* Header Title Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9F762D]">
            Front Office Operations
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[#102538] sm:text-3xl">
            ระบบติดตามการยืม-คืนอุปกรณ์แขก
          </h1>
          <p className="mt-0.5 text-xs text-[#5D6B78] sm:text-sm">
            Guest Amenity Loan Tracker • บันทึกและตรวจสอบสถานะอุปกรณ์แบบเรียลไทม์ (บันทึกอัตโนมัติลงเครื่อง)
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            onResetDemo();
            onNotify('รีเซ็ตข้อมูลจำลองกลับเป็นค่าเริ่มต้นแล้ว', 'info');
          }}
          className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-[#DDD3C3] bg-white px-3.5 py-2 text-xs font-semibold text-[#5D6B78] transition hover:border-[#C59B4E] hover:text-[#102538] cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>รีเซ็ตข้อมูลตัวอย่าง</span>
        </button>
      </div>

      {/* 1. TOP SUMMARY DASHBOARD */}
      <section className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {/* Card 1: Active Loans */}
        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'active' ? 'all' : 'active')}
          className={`flex items-center justify-between rounded-2xl border p-4.5 text-left transition cursor-pointer ${
            statusFilter === 'active'
              ? 'border-[#102538] bg-[#102538] text-[#FAF7F2] shadow-md'
              : 'border-[#E8E0D2] bg-white text-[#102538] hover:border-[#C59B4E]'
          }`}
        >
          <div>
            <p
              className={`text-xs font-semibold ${
                statusFilter === 'active' ? 'text-[#DFC285]' : 'text-[#5D6B78]'
              }`}
            >
              กำลังยืมอยู่ทั้งหมด (Active Loans)
            </p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-3xl font-bold">{stats.activeRecords}</span>
              <span
                className={`text-xs font-medium ${
                  statusFilter === 'active' ? 'text-white/75' : 'text-[#5D6B78]'
                }`}
              >
                รายการ ({stats.activePieces} ชิ้น)
              </span>
            </div>
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              statusFilter === 'active'
                ? 'bg-white/10 text-[#DFC285]'
                : 'bg-[#F7F0E1] text-[#9F762D]'
            }`}
          >
            <Package className="h-6 w-6" />
          </div>
        </button>

        {/* Card 2: Overdue */}
        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'overdue' ? 'all' : 'overdue')}
          className={`flex items-center justify-between rounded-2xl border p-4.5 text-left transition cursor-pointer ${
            statusFilter === 'overdue'
              ? 'border-[#B43C2F] bg-[#B43C2F] text-white shadow-md'
              : stats.overdueRecords > 0
                ? 'border-[#F3C5BE] bg-[#FFF8F7] text-[#102538] hover:border-[#B43C2F]'
                : 'border-[#E8E0D2] bg-white text-[#102538] hover:border-[#C59B4E]'
          }`}
        >
          <div>
            <p
              className={`text-xs font-semibold ${
                statusFilter === 'overdue'
                  ? 'text-white/90'
                  : stats.overdueRecords > 0
                    ? 'text-[#B43C2F]'
                    : 'text-[#5D6B78]'
              }`}
            >
              เลยกำหนดคืน (Overdue)
            </p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span
                className={`text-3xl font-bold ${
                  statusFilter !== 'overdue' && stats.overdueRecords > 0 ? 'text-[#B43C2F]' : ''
                }`}
              >
                {stats.overdueRecords}
              </span>
              <span
                className={`text-xs font-medium ${
                  statusFilter === 'overdue' ? 'text-white/80' : 'text-[#5D6B78]'
                }`}
              >
                รายการต้องติดตาม
              </span>
            </div>
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              statusFilter === 'overdue'
                ? 'bg-white/15 text-white'
                : 'bg-[#FDF0EE] text-[#B43C2F]'
            }`}
          >
            <AlertTriangle className="h-6 w-6" />
          </div>
        </button>

        {/* Card 3: Returned Today */}
        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'returned' ? 'all' : 'returned')}
          className={`flex items-center justify-between rounded-2xl border p-4.5 text-left transition cursor-pointer ${
            statusFilter === 'returned'
              ? 'border-[#1F6E4A] bg-[#1F6E4A] text-white shadow-md'
              : 'border-[#E8E0D2] bg-white text-[#102538] hover:border-[#1F6E4A]/60'
          }`}
        >
          <div>
            <p
              className={`text-xs font-semibold ${
                statusFilter === 'returned' ? 'text-white/90' : 'text-[#5D6B78]'
              }`}
            >
              คืนแล้ววันนี้ (Returned Today)
            </p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span
                className={`text-3xl font-bold ${
                  statusFilter !== 'returned' ? 'text-[#1F6E4A]' : ''
                }`}
              >
                {stats.returnedToday}
              </span>
              <span
                className={`text-xs font-medium ${
                  statusFilter === 'returned' ? 'text-white/80' : 'text-[#5D6B78]'
                }`}
              >
                รายการสำเร็จ
              </span>
            </div>
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              statusFilter === 'returned'
                ? 'bg-white/15 text-white'
                : 'bg-[#EDF7F1] text-[#1F6E4A]'
            }`}
          >
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </button>
      </section>

      {/* Main Content Grid: Quick Loan Form + Active Loans Table */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* 2. QUICK LOAN FORM */}
        <section className="rounded-3xl border border-[#E8E0D2] bg-white p-5 shadow-xs lg:col-span-4 lg:sticky lg:top-20">
          <div className="flex items-center gap-2.5 border-b border-[#EFE7D9] pb-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#102538] text-[#DFC285]">
              <PlusCircle className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#102538]">ฟอร์มบันทึกการยืมอุปกรณ์</h2>
              <p className="text-[11px] text-[#5D6B78]">Quick Loan Form</p>
            </div>
          </div>

          <form onSubmit={handleCreateLoan} className="mt-4 space-y-3.5">
            <div className="grid grid-cols-5 gap-2.5">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#102538]">
                  เลขห้องพัก <span className="text-[#B43C2F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="101, 205"
                  className="mt-1 w-full rounded-xl border border-[#DDD3C3] bg-[#FAF7F2]/60 px-3 py-2.5 text-sm font-bold text-[#102538] placeholder:font-normal placeholder:text-[#9AA5B1] focus:border-[#C59B4E] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="col-span-3">
                <label className="block text-xs font-semibold text-[#102538]">
                  ชื่อแขก (Guest Name)
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="คุณสมชาย / Mr. John"
                  className="mt-1 w-full rounded-xl border border-[#DDD3C3] bg-[#FAF7F2]/60 px-3 py-2.5 text-sm text-[#102538] placeholder:text-[#9AA5B1] focus:border-[#C59B4E] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              <div className="col-span-3">
                <label className="block text-xs font-semibold text-[#102538]">
                  อุปกรณ์ที่ยืม (Amenity)
                </label>
                <select
                  value={amenityId}
                  onChange={(e) => setAmenityId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#DDD3C3] bg-[#FAF7F2]/60 px-3 py-2.5 text-sm font-medium text-[#102538] focus:border-[#C59B4E] focus:bg-white focus:outline-none"
                >
                  {AMENITIES_CATALOG.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nameTh} ({item.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-xs font-semibold text-[#102538]">จำนวน</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-[#DDD3C3] bg-[#FAF7F2]/60 px-2.5 py-2.5 text-sm font-semibold text-[#102538] focus:border-[#C59B4E] focus:bg-white focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#102538]">
                  กำหนดเวลาคืน (Due Time)
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => applyPresetDue('2h')}
                    className="rounded-md bg-[#F3ECE0] px-2 py-0.5 text-[10px] font-semibold text-[#102538] hover:bg-[#E7D8BE] cursor-pointer"
                  >
                    +2 ชม.
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetDue('tonight')}
                    className="rounded-md bg-[#F3ECE0] px-2 py-0.5 text-[10px] font-semibold text-[#102538] hover:bg-[#E7D8BE] cursor-pointer"
                  >
                    20:00
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetDue('checkout')}
                    className="rounded-md bg-[#F3ECE0] px-2 py-0.5 text-[10px] font-semibold text-[#102538] hover:bg-[#E7D8BE] cursor-pointer"
                  >
                    พรุ่งนี้ 12:00
                  </button>
                </div>
              </div>
              <input
                type="datetime-local"
                required
                value={dueLocal}
                onChange={(e) => setDueLocal(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#DDD3C3] bg-[#FAF7F2]/60 px-3 py-2.5 text-sm font-medium text-[#102538] focus:border-[#C59B4E] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102538]">
                หมายเหตุ (Optional Note)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="เช่น ส่งให้แม่บ้านนำไปส่ง / หัวปลั๊ก UK"
                className="mt-1 w-full rounded-xl border border-[#DDD3C3] bg-[#FAF7F2]/60 px-3 py-2 text-sm text-[#102538] placeholder:text-[#9AA5B1] focus:border-[#C59B4E] focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#102538] px-4 py-3 text-sm font-semibold text-[#FAF7F2] shadow-sm transition hover:bg-[#1B3A54] active:scale-[0.99] cursor-pointer"
            >
              <PlusCircle className="h-4 w-4 text-[#DFC285]" />
              <span>บันทึกการยืมอุปกรณ์ (Record Loan)</span>
            </button>
          </form>
        </section>

        {/* 3. ACTIVE LOANS TABLE / LIST */}
        <section className="rounded-3xl border border-[#E8E0D2] bg-white p-5 shadow-xs lg:col-span-8">
          <div className="flex flex-col gap-3 border-b border-[#EFE7D9] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-[#102538] sm:text-lg">
                ตารางรายการยืม-คืน (Active Loans Table)
              </h2>
              <p className="text-xs text-[#5D6B78]">
                แสดง {filteredLoans.length} จากทั้งหมด {loans.length} รายการ
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8C99A6]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาเลขห้อง, ชื่อแขก..."
                className="w-full rounded-xl border border-[#DDD3C3] bg-[#FAF7F2] py-2 pr-3 pl-9 text-sm text-[#102538] placeholder:text-[#8C99A6] focus:border-[#C59B4E] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="no-scrollbar mt-3.5 flex items-center gap-2 overflow-x-auto pb-1">
            {(
              [
                { id: 'all', label: 'ทั้งหมด' },
                { id: 'overdue', label: 'เกินกำหนด' },
                { id: 'active', label: 'กำลังยืม' },
                { id: 'returned', label: 'คืนแล้ว' },
              ] as const
            ).map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    active
                      ? 'border-[#102538] bg-[#102538] text-[#FAF7F2]'
                      : 'border-[#E2D8C7] bg-[#FAF7F2] text-[#5D6B78] hover:border-[#C59B4E] hover:text-[#102538]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {filteredLoans.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#DDD3C3] bg-[#FAF7F2]/60 py-10 text-center">
              <Package className="mx-auto h-8 w-8 text-[#C59B4E]" />
              <p className="mt-2 text-sm font-semibold text-[#102538]">ไม่พบรายการที่ตรงกับเงื่อนไข</p>
              <p className="mt-1 text-xs text-[#5D6B78]">
                ลองล้างคำค้นหาหรือเลือกดูสถานะ "ทั้งหมด"
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Card View (< md) */}
              <div className="mt-4 space-y-3 md:hidden">
                {filteredLoans.map(({ loan, status }) => (
                  <div
                    key={loan.id}
                    className={`rounded-2xl border p-4 transition ${
                      status === 'overdue'
                        ? 'border-[#F3C5BE] bg-[#FFFDFC]'
                        : status === 'returned'
                          ? 'border-[#E8E0D2] bg-[#FAF7F2]/60 opacity-90'
                          : 'border-[#E8E0D2] bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex h-10 min-w-12 items-center justify-center rounded-xl bg-[#102538] px-2.5 text-sm font-bold text-[#DFC285]">
                          {loan.roomNumber}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5 text-sm font-bold text-[#102538]">
                            <span>{loan.guestName}</span>
                            {loan.source === 'guest-request' && (
                              <span
                                title="แขกขอยืมผ่าน Digital Welcome Book"
                                className="inline-flex items-center gap-0.5 rounded-md bg-[#F7F0E1] px-1.5 py-0.5 text-[10px] font-semibold text-[#9F762D]"
                              >
                                <Sparkles className="h-2.5 w-2.5" />
                                App
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-medium text-[#465564]">
                            {loan.amenityName}{' '}
                            <span className="font-bold text-[#102538]">×{loan.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={status} />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-[#FAF7F2] p-2.5 text-[11px] text-[#5D6B78]">
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider opacity-75">
                          เวลายืม
                        </span>
                        <span className="font-semibold text-[#102538]">
                          {formatThaiDateTime(loan.borrowedAt)}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider opacity-75">
                          {status === 'returned' ? 'เวลาคืนจริง' : 'กำหนดคืน'}
                        </span>
                        <span
                          className={`font-semibold ${
                            status === 'overdue'
                              ? 'text-[#B43C2F]'
                              : status === 'returned'
                                ? 'text-[#1F6E4A]'
                                : 'text-[#102538]'
                          }`}
                        >
                          {status === 'returned' && loan.returnedAt
                            ? formatThaiDateTime(loan.returnedAt)
                            : formatThaiDateTime(loan.dueAt)}
                        </span>
                      </div>
                    </div>

                    {loan.notes && (
                      <p className="mt-2 text-xs text-[#5D6B78]">หมายเหตุ: {loan.notes}</p>
                    )}

                    <div className="mt-3 flex justify-end">
                      {status !== 'returned' ? (
                        <button
                          type="button"
                          onClick={() => {
                            onMarkReturned(loan.id);
                            onNotify(`ยืนยันรับคืนอุปกรณ์ห้อง ${loan.roomNumber} เรียบร้อยแล้ว`);
                          }}
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#1F6E4A] px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#195A3C] cursor-pointer"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>ยืนยันรับคืน (Mark as Returned)</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onUndoReturn(loan.id);
                            onNotify(`เปลี่ยนสถานะห้อง ${loan.roomNumber} กลับเป็นกำลังยืมแล้ว`, 'info');
                          }}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#5D6B78] hover:bg-[#EFE7D9] hover:text-[#102538] cursor-pointer"
                        >
                          <Undo2 className="h-3.5 w-3.5" />
                          <span>ยกเลิกการคืน</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (>= md) */}
              <div className="mt-4 hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#EFE7D9] text-[11px] font-semibold uppercase tracking-wider text-[#5D6B78]">
                      <th className="py-3 pr-3">ห้อง / แขก</th>
                      <th className="px-3 py-3">อุปกรณ์</th>
                      <th className="px-3 py-3">เวลายืม / กำหนดคืน</th>
                      <th className="px-3 py-3">สถานะ</th>
                      <th className="py-3 pl-3 text-right">ดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2ECE0]">
                    {filteredLoans.map(({ loan, status }) => (
                      <tr
                        key={loan.id}
                        className={`transition ${
                          status === 'overdue'
                            ? 'bg-[#FFF9F8] hover:bg-[#FFF3F1]'
                            : status === 'returned'
                              ? 'bg-[#FAF7F2]/40 text-[#5D6B78]'
                              : 'hover:bg-[#FAF7F2]/70'
                        }`}
                      >
                        <td className="py-3.5 pr-3 align-top">
                          <div className="flex items-center gap-2.5">
                            <span className="inline-flex h-9 min-w-11 shrink-0 items-center justify-center rounded-xl bg-[#102538] px-2 text-xs font-bold text-[#DFC285]">
                              {loan.roomNumber}
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5 font-semibold text-[#102538]">
                                <User className="h-3.5 w-3.5 text-[#9F762D]" />
                                <span>{loan.guestName}</span>
                              </div>
                              {loan.source === 'guest-request' && (
                                <span className="mt-0.5 inline-flex items-center gap-0.5 rounded bg-[#F7F0E1] px-1.5 py-0.5 text-[10px] font-semibold text-[#9F762D]">
                                  <Sparkles className="h-2.5 w-2.5" />
                                  ขอยืมจาก Guest App
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-3.5 align-top">
                          <div className="font-semibold text-[#102538]">
                            {loan.amenityName}{' '}
                            <span className="ml-1 rounded-md bg-[#F3ECE0] px-1.5 py-0.5 text-xs font-bold text-[#102538]">
                              ×{loan.quantity}
                            </span>
                          </div>
                          {loan.notes && (
                            <p className="mt-0.5 text-xs text-[#5D6B78]">{loan.notes}</p>
                          )}
                        </td>

                        <td className="px-3 py-3.5 align-top text-xs whitespace-nowrap">
                          <div className="text-[#5D6B78]">
                            ยืม: <span className="font-medium text-[#102538]">{formatThaiDateTime(loan.borrowedAt)}</span>
                          </div>
                          <div
                            className={`mt-0.5 ${
                              status === 'overdue'
                                ? 'font-semibold text-[#B43C2F]'
                                : status === 'returned'
                                  ? 'text-[#1F6E4A]'
                                  : 'text-[#5D6B78]'
                            }`}
                          >
                            {status === 'returned' && loan.returnedAt
                              ? `คืน: ${formatThaiDateTime(loan.returnedAt)}`
                              : `กำหนดคืน: ${formatThaiDateTime(loan.dueAt)}`}
                          </div>
                        </td>

                        <td className="px-3 py-3.5 align-top whitespace-nowrap">
                          <StatusBadge status={status} />
                        </td>

                        <td className="py-3.5 pl-3 align-top text-right whitespace-nowrap">
                          {status !== 'returned' ? (
                            <button
                              type="button"
                              onClick={() => {
                                onMarkReturned(loan.id);
                                onNotify(`ยืนยันรับคืนอุปกรณ์ห้อง ${loan.roomNumber} เรียบร้อยแล้ว`);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F6E4A] px-3 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#195A3C] cursor-pointer"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>ยืนยันรับคืน</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                onUndoReturn(loan.id);
                                onNotify(
                                  `เปลี่ยนสถานะห้อง ${loan.roomNumber} กลับเป็นกำลังยืมแล้ว`,
                                  'info'
                                );
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#E2D8C7] bg-white px-2.5 py-1.5 text-xs font-medium text-[#5D6B78] hover:border-[#C59B4E] hover:text-[#102538] cursor-pointer"
                            >
                              <Undo2 className="h-3.5 w-3.5" />
                              <span>ย้อนกลับ</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
