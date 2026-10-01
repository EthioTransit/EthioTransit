# EthioTransit (ኢትዮ-ትራንዚት)
### Modern Ethiopian Intercity Transportation Booking & Management Platform

EthioTransit is a full-stack, enterprise-grade digital transportation platform designed for Ethiopian intercity passenger transport. It connects passengers, bus operators, drivers, and platform administrators into a unified, transparent ecosystem.

---

## 🌟 Key Highlights & Engineering Features

- **100% Dynamic & Database-Driven**:
  - No hardcoded cities, routes, or operators. Administrators and operators can dynamically register new cities (with Amharic/English names, codes, terminals), create intercity routes, schedule trips, and assign fleets.
- **Atomic 10-Minute Seat Locking**:
  - Eliminates double-booking races through atomic MongoDB reservation locks and client-side real-time countdown timers.
  - Automatically cleans up and releases expired locks so other passengers can select them.
- **Server-Side Official Fare Transparency**:
  - Exact breakdown of Base Operator Fare + Platform Service Fee.
  - Drivers cannot alter fares; collections are strictly tracked and audited.
- **Tamper-Proof Digital QR Boarding**:
  - QR codes embedded with cryptographically secure verification tokens (`ETH-VERIFY-TK-...`).
  - Driver QR Scanner with anti-reuse protection: first scan validates boarding and marks the ticket as `USED`; duplicate scans are rejected with `ALREADY_USED`.
- **Role-Based Access Control (RBAC)**:
  - `SUPER_ADMIN` & `ADMIN`: Full platform governance, audit logs, revenue analytics, dynamic city/route creation.
  - `OPERATOR`: Scoped fleet management, vehicle/driver assignment, trip scheduling, passenger manifests.
  - `DRIVER`: Assigned trip manifests, mobile-friendly boarding scanner terminal.
  - `PASSENGER`: Trip discovery, interactive seat selection, payment checkout, digital ticket wallet.
- **Bilingual Internationalization (i18n)**:
  - English is the default UI language on initial load.
  - Full Amharic translation dictionary with seamless language dropdown switching without page refreshes.
- **Zero-Dependency Dual-Mode Database Execution**:
  - Automatically spins up an embedded in-memory MongoDB server with seed data out-of-the-box if no external database URI is configured.
  - Seamlessly switches to production MongoDB Atlas when `MONGODB_URI` is provided.

---

## 🏗️ Architecture & Technology Stack

```
EthioTransit/
├── backend/
│   ├── src/
│   │   ├── config/          # Brand config, database dual-mode setup, environment
│   │   ├── controllers/     # Express REST controllers (Auth, Trip, Booking, etc.)
│   │   ├── jobs/            # Database seed script (11 Ethiopian cities, 4 operators, 10 routes)
│   │   ├── middleware/      # Auth (JWT), RBAC guard, input validation (Zod)
│   │   ├── models/          # Mongoose schemas (User, City, Route, Trip, Seat, Ticket, etc.)
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic (Seat locking, Boarding verification, Payments)
│   │   ├── utils/           # JWT, QR Code generation, Response formatters
│   │   ├── validators/      # Zod validation schemas
│   │   └── __tests__/       # Comprehensive concurrency and lifecycle test suite
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API client and endpoint definitions
│   │   ├── components/      # Common UI components (Navbar, Footer, Modal, Skeleton)
│   │   ├── config/          # Centralized brand configuration
│   │   ├── context/         # AuthContext and state management
│   │   ├── features/        # Feature modules:
│   │   │   ├── search/      # CitySelector, SearchCard, QuickDateCards
│   │   │   ├── seats/       # SeatMap (2x2 layout, aisle, driver cabin), SeatLockTimer
│   │   │   ├── booking/     # PassengerForm, PriceBreakdown
│   │   │   ├── tickets/     # DigitalTicketCard, BoardingScanner
│   │   │   └── dashboard/   # CityManagementModal, RouteManagementModal, ManifestModal
│   │   ├── i18n/            # English & Amharic translations
│   │   ├── pages/           # Application views (Home, Search, Checkout, Ticket, Dashboards)
│   │   ├── types/           # TypeScript domain definitions
│   │   └── index.css        # Tailwind CSS design system tokens
│   ├── package.json
│   └── vite.config.ts
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher; v22 recommended)
- npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*The backend API will start on `http://localhost:5000`. If `MONGODB_URI` is not set in `.env`, it will automatically launch `MongoMemoryServer` and run the Ethiopian seed data generator.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The frontend client will start on `http://localhost:5173`.*

---

## 🔑 Demo Role Accounts

All demo accounts use the standard password: `EthioTransit@2026`

| Role | Email | Capabilities |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@ethiotransit.et` | Full system audit logs, metrics, global management |
| **Admin** | `admin@ethiotransit.et` | Dynamic City creation, Route creation, Trip oversight |
| **Operator** | `selam.operator@ethiotransit.et` | Selam Bus fleet management, scheduled trips, manifests |
| **Driver** | `driver.abebe@ethiotransit.et` | Assigned trips, passenger manifest, live QR boarding scanner |
| **Passenger** | `passenger.almaz@ethiotransit.et` | Search, seat booking, ticket wallet, booking history |

*Tip: The Login page features 1-click Quick-Fill buttons for instant role switching without manual typing.*

---

## 🧪 Automated Integration & Concurrency Test Suite

EthioTransit includes an automated integration test verifying critical business rules and concurrency race conditions:

```bash
cd backend
npm test
```

### Verified Test Cases:
1. **Health Check**: Validates API liveness.
2. **RBAC Authentication**: Generates signed JWTs for Super Admin, Driver, and Passenger.
3. **RBAC Enforcement**: Confirms that non-privileged roles (Drivers, Passengers) receive `403 Forbidden` when attempting unauthorized administrative actions.
4. **Dynamic City Creation**: Successfully creates new cities via the API and validates unique city codes.
5. **Dynamic Route Creation**: Links origin and destination cities into active routes with pickup/drop-off points.
6. **Trip Discovery**: Searches scheduled trips and inspects real-time seat availability.
7. **Simultaneous Seat Reservation Race (Atomic Concurrency)**: Dispatches two simultaneous requests for the exact same seat; asserts that exactly one racer receives `200 OK` with a 10-minute hold and the competing racer is rejected with `409 Conflict`.
8. **Checkout & Fare Calculation**: Validates base operator fare + platform service fee breakdown.
9. **Payment Processing**: Executes server-side verification and confirms booking status transition to `CONFIRMED`.
10. **Digital Ticket & QR Token**: Generates SVG QR codes and cryptographically verified tokens.
11. **Anti-Fraud Boarding Verification**:
    - 1st scan: Validates ticket and marks status as `USED`.
    - 2nd duplicate scan: Rejects boarding attempt with `ALREADY_USED` and alerts of previous usage timestamp.
    - Forged token scan: Rejects invalid tokens with `INVALID_TICKET`.

---

## 💳 Supported Payment Integrations
EthioTransit includes a mock payment sandbox with provider adapters for Ethiopian financial gateways:
- **Telebirr** (Ethio Telecom)
- **CBE Birr** (Commercial Bank of Ethiopia)
- **Chapa** (Local Payment Gateway)
- **Instant Birr Sandbox** (Automated zero-friction testing)

---

## 🌍 Language Support
- **English**: Default locale for all visitors.
- **Amharic (አማርኛ)**: Full localization accessible via the language toggle in the header navbar. No page refresh required.
