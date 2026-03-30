import { AppHeader } from "@/components/AppHeader";
import { Transactions } from "@/features/transactions/routes/transactions";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="p-4">
        <Transactions />
      </main>
    </div>
  );
}

export default App;
