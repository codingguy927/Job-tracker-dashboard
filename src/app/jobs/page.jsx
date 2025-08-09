// src/app/jobs/page.jsx
import JobList from "@/components/JobList"; // or ../../components/JobList if no alias

// Ensure no module-scope usage of sortOrder in exports below.
export const revalidate = 0; // keep static prerender stable

export default function JobsPage({ searchParams }) {
  // Safe: computed at render time, not at module scope
  const sortParam = typeof searchParams?.sort === "string" ? searchParams.sort : undefined;
  const sortOrder = sortParam === "asc" || sortParam === "desc" ? sortParam : "desc";

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <JobList sortOrder={sortOrder} />
    </main>
  );
}
