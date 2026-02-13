import { Metadata } from "next";
import { redirect } from "next/navigation";

// Since DebtPipe is a static HTML/JS app in /public/debtpipe,
// we can either redirect or embed. For now, redirect to the static files.
export const metadata: Metadata = {
  title: "DebtPipe - Debt Management Tool",
  description: "Visualize and plan your debt payoff with DebtPipe.",
};

export default function DebtPipePage() {
  // Option 1: redirect to the static files directly
  redirect("/debtpipe/index.html");
}
