import JobList from "@/components/JobList"; // if this fails, use: ../../components/JobList

export default function JobsPage() {
  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <JobList />
    </main>
  );
}
