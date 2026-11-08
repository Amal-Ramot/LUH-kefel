import { notFound } from "next/navigation";
import { NUMBERS } from "@/lib/data";
import LearnTable from "./LearnTable";

export const dynamicParams = false;

export function generateStaticParams() {
  return NUMBERS.map((n) => ({ n: String(n) }));
}

export default async function Page({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const num = Number(n);
  if (!NUMBERS.includes(num)) notFound();
  return <LearnTable n={num} />;
}
