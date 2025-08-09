// src/app/jobs/page.jsx
import JobList from "@/components/JobList"; // or ../../components/JobList if no alias

export default function JobsPage() {
  // Avoid ReferenceError during prerender: give sortOrder an explicit value
  const sortOrder = "desc"; // "asc" | "desc"

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <JobList sortOrder={sortOrder} />
    </main>
  );
}
