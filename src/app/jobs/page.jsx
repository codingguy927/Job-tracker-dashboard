// src/app/jobs/page.jsx
import JobList from "@/components/JobList";

export const revalidate = 0;

export default function JobsPage({ searchParams }) {
  const sortParam = typeof searchParams?.sort === "string" ? searchParams.sort : undefined;
  const initialSort = sortParam === "asc" || sortParam === "desc" ? sortParam : "desc";

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <JobList initialSort={initialSort} />
    </main>
  );
}
