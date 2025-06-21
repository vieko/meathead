import { checkDbConnection } from "@/lib/db";

export default async function Home() {
  const result = await checkDbConnection();
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Project Meathead</h1>
      <span
        className={`mt-3 rounded-full border px-3 py-1.5 text-xs font-semibold ${
          result === "Database connected"
            ? "border-[#00E599]/20 bg-[#00E599]/10 text-[#1a8c66] dark:bg-[#00E599]/10 dark:text-[#00E599]"
            : "border-red-500/20 bg-red-500/10 text-red-500 dark:text-red-500"
        }`}
      >
        {result}
      </span>
    </div>
  );
}
