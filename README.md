# Andaman Breeze Hotel — Front Office & Digital Concierge Web App

A mobile-first Hotel Front Office & Concierge web application designed with a warm boutique hotel aesthetic (**Warm White**, **Deep Navy**, and **Soft Gold**).

## Features

### 1. Guest View — Digital Welcome Book & Local Guide
- **Hero & Instant Access**: Hotel welcome card, one-tap **Wi-Fi Password Copy**, **Call Front Desk** button, and hotel Google Maps pin.
- **Hotel Info Cards**: Check-in/Check-out times, Breakfast Terrace hours, Saltwater Pool & Fitness schedule, and house etiquette.
- **Curated Local Guide**: Category filtering (*All*, *Dining & Cafe*, *Beach & Views*, *Essentials*), editorial photos, distance & opening hours, concierge tips, and direct **Open in Google Maps** links.
- **Complimentary Amenity Requests**: Guests can browse free borrowable items (Universal Adapter, Umbrella, Steam Iron, Ionic Hair Dryer, Extra Pillow, Beach Set) and submit room requests directly into the Front Office tracker.

### 2. Staff View — Guest Amenity Loan Tracker
- **Live KPI Summary Dashboard**: Active loans & piece count, Overdue items alert, and Returned Today summary.
- **Quick Loan Form**: Fast entry for room number, guest name, amenity dropdown, quantity, and return deadline presets (`+2h`, `20:00`, `Tomorrow 12:00`).
- **Active Loans Table & Mobile Cards**: Search by room number or guest name, filter by status (*Active*, *Overdue*, *Returned*), one-click **Mark as Returned** (with Undo), and full `localStorage` persistence with realistic Thai/English demo data.

## Tech Stack
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4**
- **Lucide Icons** (`lucide-react`)

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser and toggle between **แขกเข้าพัก (Guest)** and **พนักงาน (Staff)** in the top navigation bar.
