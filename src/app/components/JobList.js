<div className="mb-6">
  <button
    onClick={() => setSortOrder("Newest")}
    className={`px-4 py-2 mr-2 rounded ${
      sortOrder === "Newest" ? "bg-blue-600 text-white" : "bg-white border"
    }`}
  >
    Newest First
  </button>
  <button
    onClick={() => setSortOrder("Oldest")}
    className={`px-4 py-2 rounded ${
      sortOrder === "Oldest" ? "bg-blue-600 text-white" : "bg-white border"
    }`}
  >
    Oldest First
  </button>
</div>











import JobCard from "./JobCard";

const dummyJobs = [
    {
        id: 1,
        company: "Google",
        position: "Frontend Developer",
        dateApplied: "2025-04-10",
        status: "Interviewing",
    },
    {
        id:2,
        company:"Meta",
        position: "UI Engineer",
        dateApplied: "2025-04-08",
        status: "Applied",
    },
];

export default function JobList() {
    return (
        <div className="grid gap-4">
            {dummyJobs.map((job) => (
                <JobCard key={job.id} job={job} />

            ))}
        </div>
    );
}