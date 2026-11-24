import { useCallback, useEffect, useMemo, useState } from 'react';
import { createInitialMockLoans } from '../data/hotelData';
import { LoanRecord, LoanStatus } from '../types';

const STORAGE_KEY = 'andaman_breeze_loans_v1';

export function getLoanStatus(record: LoanRecord, nowMs = Date.now()): LoanStatus {
  if (record.returnedAt) return 'returned';
  const dueMs = new Date(record.dueAt).getTime();
  if (!Number.isNaN(dueMs) && nowMs > dueMs) return 'overdue';
  return 'active';
}

export function isSameLocalDay(isoDate: string, compareDate = new Date()): boolean {
  const d = new Date(isoDate);
  return (
    d.getFullYear() === compareDate.getFullYear() &&
    d.getMonth() === compareDate.getMonth() &&
    d.getDate() === compareDate.getDate()
  );
}

function loadLoansFromStorage(): LoanRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialMockLoans();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as LoanRecord[];
    }
    const initial = createInitialMockLoans();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch {
    return createInitialMockLoans();
  }
}

export interface AddLoanInput {
  roomNumber: string;
  guestName: string;
  amenityId: string;
  amenityName: string;
  quantity: number;
  dueAt: string;
  source?: 'staff' | 'guest-request';
  notes?: string;
}

export function useLoanTracker() {
  const [loans, setLoans] = useState<LoanRecord[]>(() => loadLoansFromStorage());
  const [nowTick, setNowTick] = useState<number>(() => Date.now());

  // Persist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
    } catch {
      // Ignore storage quota errors
    }
  }, [loans]);

  // Refresh overdue checks every 30 seconds
  useEffect(() => {
    const timer = window.setInterval(() => setNowTick(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const addLoan = useCallback((input: AddLoanInput) => {
    const newRecord: LoanRecord = {
      id: `LN-${Date.now().toString().slice(-6)}`,
      roomNumber: input.roomNumber.trim().toUpperCase(),
      guestName: input.guestName.trim() || `Guest Room ${input.roomNumber.trim()}`,
      amenityId: input.amenityId,
      amenityName: input.amenityName,
      quantity: Math.max(1, input.quantity),
      borrowedAt: new Date().toISOString(),
      dueAt: input.dueAt,
      source: input.source ?? 'staff',
      notes: input.notes?.trim() || undefined,
    };
    setLoans((prev) => [newRecord, ...prev]);
    return newRecord;
  }, []);

  const markAsReturned = useCallback((id: string) => {
    setLoans((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, returnedAt: new Date().toISOString() } : item
      )
    );
  }, []);

  const undoReturn = useCallback((id: string) => {
    setLoans((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, returnedAt: undefined } : item
      )
    );
  }, []);

  const resetDemoData = useCallback(() => {
    const fresh = createInitialMockLoans();
    setLoans(fresh);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // Ignore
    }
  }, []);

  const stats = useMemo(() => {
    let activeRecords = 0;
    let activePieces = 0;
    let overdueRecords = 0;
    let returnedToday = 0;

    for (const loan of loans) {
      const status = getLoanStatus(loan, nowTick);
      if (status === 'returned') {
        if (loan.returnedAt && isSameLocalDay(loan.returnedAt)) {
          returnedToday += 1;
        }
      } else {
        activeRecords += 1;
        activePieces += loan.quantity;
        if (status === 'overdue') {
          overdueRecords += 1;
        }
      }
    }

    return {
      activeRecords,
      activePieces,
      overdueRecords,
      returnedToday,
    };
  }, [loans, nowTick]);

  return {
    loans,
    stats,
    nowTick,
    addLoan,
    markAsReturned,
    undoReturn,
    resetDemoData,
  };
}
