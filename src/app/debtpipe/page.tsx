import DebtPipe from "@/components/debtpipe/DebtPipe";
import { FinPipeMenu } from "@/components/utilities/FinPipeMenu";

export default function DebtPipePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
          DebtPipe
        </h1>
        <p className="text-gray-400 mb-6">
          Unlimited Debt Payoff Simulator
        </p>
        <FinPipeMenu current="debtpipe" />

        <DebtPipe />
      </div>
    </div>
  );
}
