// src/components/JobList.jsx
"use client";

import { useMemo, useState } from "react";
import JobCard from "./JobCard";

const dummyJobs = [
  { id: 1, company: "Google", position: "Frontend Developer", dateApplied: "2025-04-10", status: "Interviewing" },
  { id: 2, company: "Meta",   position: "UI Engineer",         dateApplied: "2025-04-08", status: "Applied" },
];

export default function JobList({ initialSort = "desc", jobs: incomingJobs }) {
  // "desc" = Newest first, "asc" = Oldest first
  const [sortOrder, setSortOrder] = useState(initialSort);
  const jobs = incomingJobs?.length ? incomingJobs : dummyJobs;

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      const da = new Date(a.dateApplied);
      const db = new Date(b.dateApplied);
      return sortOrder === "asc" ? da - db : db - da;
    });
  }, [jobs, sortOrder]);

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setSortOrder("desc")}
          className={`px-4 py-2 mr-2 rounded ${sortOrder === "desc" ? "bg-blue-600 text-white" : "bg-white border"}`}
        >
          Newest First
        </button>
        <button
          onClick={() => setSortOrder("asc")}
          className={`px-4 py-2 rounded ${sortOrder === "asc" ? "bg-blue-600 text-white" : "bg-white border"}`}
        >
          Oldest First
        </button>
      </div>

      <div className="grid gap-4">
        {sortedJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
