import Chart from "@/widgets/trading-view/chart";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="w-screen h-screen bg-gray-500 grid grid-cols-1">
      <Suspense>
        <Chart />
      </Suspense>
    </main>
  );
}
