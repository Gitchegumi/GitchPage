import BudgetTool from "@/components/budget/BudgetTool";

export default function BudgetPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Financial Hub
        </h1>
        <p className="text-gray-400 mb-8">Track income, expenses, and build your monthly budget.</p>
        
        <BudgetTool />
      </div>
    </div>
  );
}
