# Frontend

React 19 single-page application for Guru Finance. Built with Vite, TypeScript, TailwindCSS, and HeroUI. Communicates with the serverless backend via Axios and manages server state with TanStack Query.

---

## Architecture Overview

The frontend is organized around a **feature-sliced** structure. Each feature is a self-contained module under `src/features/` with its own API hooks, components, context, types, and routes. Shared concerns (reusable components, API client, utilities) live at the top level of `src/`.

### State management approach

| Concern | Solution |
|---|---|
| Server state (API data) | TanStack Query (`useQuery` / `useMutation`) |
| UI / dialog state | React Context + `useState` (`TransactionContext`) |
| Form state | Native `FormData` via HTML form elements |

---

## Repository Layout

```
frontend/
├── src/
│   ├── features/
│   │   └── transactions/
│   │       ├── api/            # Query/mutation hooks + raw fetch functions + mappers
│   │       │   ├── mappers/
│   │       │   │   └── transactionMapper.ts
│   │       │   ├── useCreateTransaction.ts
│   │       │   ├── useDeleteTransaction.ts
│   │       │   ├── useGetTransactions.ts
│   │       │   └── useUpdateTransaction.ts
│   │       ├── components/     # Feature-local React components
│   │       │   ├── DeleteTransactionDialog.tsx
│   │       │   ├── Header.tsx              # Overview card: net balance + % change + add button
│   │       │   ├── TableActions.tsx
│   │       │   ├── TransactionDialog.tsx
│   │       │   ├── TransactionForm.tsx
│   │       │   ├── TransactionsTable.tsx
│   │       │   └── TransactionTypeIndicator.tsx  # Chip badge for income / expense
│   │       ├── context/
│   │       │   └── TransactionContext.tsx  # Dialog + selection state
│   │       ├── hooks/
│   │       │   └── useSummary.ts           # Derives netTotal + netChangePercent from transactions
│   │       ├── routes/
│   │       │   └── transactions.tsx        # Top-level route component
│   │       └── types/
│   │           └── transaction.ts          # Transaction interface + TransactionTypes const enum
│   ├── components/
│   │   ├── AppHeader.tsx                   # Sticky app bar with app title + theme toggle
│   │   └── ConfirmationDialog.tsx          # Reusable confirmation modal
│   ├── services/
│   │   ├── api.ts              # Axios instance with base URL + auth interceptor
│   │   └── queryClient.ts      # TanStack Query client singleton
│   ├── utils/
│   │   ├── currency.ts         # formatCurrency (Intl.NumberFormat)
│   │   └── date.ts             # formatDate (date-fns)
│   ├── App.tsx                 # Root component — renders AppHeader + Transactions
│   └── main.tsx                # Entry point — mounts React + ThemeProvider + QueryClientProvider
├── public/
├── index.html
├── vite.config.ts
└── package.json
```

---

## Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool + dev server |
| TypeScript | 5.9 | Language (strict mode) |
| TanStack Query | 5.95 | Server state management |
| Axios | 1.13 | HTTP client |
| HeroUI | 3.x | Component library (Table, Dialog, Spinner, Chip, etc.) |
| Tailwind CSS | 4.x | Utility-first styling (Vite plugin — no config file needed) |
| next-themes | 0.4.x | Dark / light theme management |
| date-fns | 4.x | Date formatting |
| classnames | 2.x | Conditional class merging |
| react-icons | 5.x | Icon set |
| Vercel | — | Hosting and deployment |

---

## Component Hierarchy

```
main.tsx
└── ThemeProvider (next-themes)
    └── QueryClientProvider (TanStack Query)
        └── App.tsx
            ├── AppHeader                       # Sticky bar: app title + dark/light toggle
            └── Transactions (routes/transactions.tsx)
                └── TransactionProvider (context)
                    ├── Header                  # Overview card: net balance, % change, add button
                    ├── TransactionsTable
                    │   └── TableActions (per row)
                    │       ├── [Edit button → opens TransactionDialog]
                    │       └── [Delete button → opens DeleteTransactionDialog]
                    ├── TransactionDialog
                    │   └── TransactionForm
                    └── DeleteTransactionDialog
                        └── ConfirmationDialog
```

---

## State Management

### Server state — TanStack Query

Each API operation has its own file under `features/transactions/api/`. The pattern is:

1. Export a plain async function (testable in isolation).
2. Export a hook wrapping it for use in components.

```typescript
// Plain fetch function
export const getTransactions = async (): Promise<Transaction[]> => {
  return api.get("/transactions").then(res => res.data.map(TransactionMapper.fromDto));
};

// Hook for component use
export const useGetTransactions = () => {
  return useQuery({ queryKey: ["transactions"], queryFn: getTransactions });
};
```

After mutations, related queries are invalidated to keep the UI in sync:

```typescript
export const useCreateTransaction = () => {
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });
};
```

The `queryClient` singleton is imported directly from `src/services/queryClient.ts` when calling `invalidateQueries`.

### UI state — TransactionContext

`TransactionContext` holds dialog open/close state and the currently selected/targeted transaction. It is provided at the route level by `TransactionProvider`, wrapping all transaction components.

```typescript
interface TransactionContextValue {
  dialogState: UseOverlayStateReturn;         // create/edit dialog
  selectedTransaction: Transaction | null;    // transaction being edited
  setSelectedTransaction: (t: Transaction | null) => void;
  deleteDialogState: UseOverlayStateReturn;   // delete confirmation dialog
  transactionToDelete: Transaction | null;
  setTransactionToDelete: (t: Transaction | null) => void;
}
```

Consume via `useContext(TransactionContext)` and guard the possibly-undefined value with optional chaining.

### Theme state — next-themes

Dark/light mode is managed by `next-themes`. `ThemeProvider` is mounted in `main.tsx` wrapping the entire app:

```typescript
<ThemeProvider attribute={["class", "data-theme"]} defaultTheme="system" enableSystem>
```

`AppHeader` consumes `useTheme()` to read `resolvedTheme` and call `setTheme()` on toggle. The active theme class is applied to `<html>` automatically.

### Derived state — useSummary

`useSummary` is a custom hook that computes financial summary values from the transactions list. It lives in `features/transactions/hooks/useSummary.ts` and is consumed by the `Header` component.

```typescript
const { netTotal, totalIncome, totalExpense, netChangePercent } = useSummary({ transactions });
```

| Return value | Description |
|---|---|
| `totalIncome` | Sum of all `income` transaction amounts |
| `totalExpense` | Sum of all `expense` transaction amounts |
| `netTotal` | `totalIncome - totalExpense` |
| `netChangePercent` | `(netTotal / totalIncome) * 100` — 0 when no income |

---

## Shared Components

### AppHeader (`src/components/AppHeader.tsx`)

Sticky application bar rendered at the top of every page. Contains:

- The app name ("Guru Finance") as a bold title.
- A dark/light theme toggle button (sun/moon icon, powered by `next-themes`).

```typescript
// Toggling the theme
const { resolvedTheme, setTheme } = useTheme();
setTheme(resolvedTheme === "dark" ? "light" : "dark");
```

### ConfirmationDialog (`src/components/ConfirmationDialog.tsx`)

Generic confirmation modal used by `DeleteTransactionDialog`. Pass a `title`, `description`, and `onConfirm` callback.

---

### Axios instance (`src/services/api.ts`)

- `baseURL` is set from `import.meta.env.VITE_API_URL`
- A request interceptor injects `x-user-id` from `VITE_DUMMY_USER_ID` into every request (simulates authentication until a real auth layer is added)
- Timeout: 10 seconds

```typescript
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
```

### Mapper pattern (`features/transactions/api/mappers/transactionMapper.ts`)

`TransactionMapper` contains only static methods:

| Method | Input → Output | Use case |
|---|---|---|
| `fromDto` | `TransactionDto` → `Transaction` | Parse API response |
| `toDto` | `Transaction` → `TransactionDto` | Prepare data for API |
| `fromFormData` | `FormData` → `TransactionDto` | Convert form submission |

---

## Environment Variables

All variables must be prefixed with `VITE_` to be included in the browser bundle. Copy `.env.template` to `.env` before running locally.

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API Gateway (or `http://localhost:3000` locally) |
| `VITE_DUMMY_USER_ID` | Simulated user ID injected into every request via `x-user-id` header |

---

## Development Guide

### Prerequisites

- Node.js 24 (see root `.nvmrc`)
- Backend running locally or a deployed API URL set in `.env`

### Start the dev server

```bash
npm run dev
```

Starts Vite at **http://localhost:5173** with Hot Module Replacement (HMR).

### Type checking

```bash
npx tsc -b --noEmit
```

### Lint

```bash
npm run lint
```

### Build for production

```bash
npm run build
```

Runs `tsc -b` then `vite build`. Output is written to `dist/`.

### Preview the production build locally

```bash
npm run preview
```

---

## Deployment

The frontend is deployed to **Vercel**. In CI/CD, the build is produced locally (so `VITE_API_URL` can be injected from the backend deploy output) and the pre-built `dist/` folder is uploaded to Vercel.

### Via CI/CD (automatic)

Pushing to `main` or `dev` triggers the GitHub Actions workflow, which:
1. Deploys the backend and extracts the API Gateway URL.
2. Builds the frontend with `VITE_API_URL` set to that URL.
3. Deploys `frontend/dist/` to Vercel.

| Branch | Vercel alias |
|---|---|
| `local`| http://localhost:5173 |
| `dev` | https://preview.guru-finance.calabs.dev |
| `main` | https://guru-finance.calabs.dev |

### Required GitHub secrets for frontend deployment

| Secret | Description |
|---|---|
| `VERCEL_TOKEN` | Vercel personal access token |
| `VERCEL_ORG_ID` | Vercel organisation ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `VITE_DUMMY_USER_ID` | User ID injected at build time |

### Manual deployment via Vercel CLI

```bash
npm run build   # produces dist/
vercel dist/    # deploy preview
vercel dist/ --prod  # deploy to production
```

---

## Responsive Design

Tailwind CSS breakpoint prefixes are used for responsive columns in the transactions table:

| Column | Mobile | Desktop (`md:`) |
|---|---|---|
| Description | visible | visible |
| Type | hidden | visible |
| Category | visible | visible |
| Source Account | hidden | visible |
| Amount | visible | visible |
| Date | hidden | visible |
| Actions | visible | visible |

The app uses a mobile-first approach — base styles target small screens and `md:` prefixes progressively enhance larger viewports.

---

### Styling guidelines

- Use **Tailwind utility classes** directly in `className` props.
- Use **HeroUI component variants** before writing custom Tailwind overrides.
- Do not create per-component CSS files; use `src/index.css` only for global base styles and Tailwind directives.
- Use the `classnames` (`cn`) helper for conditional class merging.
