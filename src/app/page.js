"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import JobForm from "./components/JobForm";
import JobCard from "./components/JobCard";
// only load the chart in the browser
const StatusChart = dynamic(() => import("./components/StatusChart"), {
  ssr: false,
});

export default function Home() {
  // ─── App State ─────────────────────────────────────────────────────────────
  const [jobs, setJobs] = useState([]);             // start empty, then fetch
  const [filterStatus, setFilterStatus] = useState("All");
  const [editingIndex, setEditingIndex] = useState(null);

  // form fields
  const [company, setCompany]       = useState("");
  const [position, setPosition]     = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [status, setStatus]         = useState("Applied");

  // UI controls
  const [sortOrder, setSortOrder]   = useState("Newest");
  const [darkMode, setDarkMode]     = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // guard against SSR/class mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // ─── Persist darkMode ────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setDarkMode(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // ─── Fetch persisted jobs on load ────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("jobs");
    if (stored) {
      setJobs(JSON.parse(stored));
    } else {
      // first-time: hit your API
      fetch("/api/jobs")
        .then((res) => res.json())
        .then((data) => {
          setJobs(data);
          localStorage.setItem("jobs", JSON.stringify(data));
        })
        .catch(console.error);
    }
  }, []);

  // ─── Sync jobs → localStorage whenever they change ──────────────────────────
  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  // ─── Create/update via your API ──────────────────────────────────────────────
  async function handleAddJob(newJob) {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    });
    const created = await res.json();
    if (editingIndex !== null) {
      const u = [...jobs];
      u[editingIndex] = created;
      setJobs(u);
      setEditingIndex(null);
    } else {
      setJobs((prev) => [created, ...prev]);
    }
    setCompany(""); setPosition(""); setDateApplied(""); setStatus("Applied");
  }

  // ─── Edit & delete handlers ────────────────────────────────────────────────
  function handleEditClick(i) {
    const job = jobs[i];
    setCompany(job.company);
    setPosition(job.position);
    setDateApplied(job.dateApplied);
    setStatus(job.status);
    setEditingIndex(i);
  }
  function handleDeleteJob(i) {
    const u = [...jobs];
    u.splice(i, 1);
    setJobs(u);
  }

  // ─── CSV export ─────────────────────────────────────────────────────────────
  function handleExportCSV() {
    const rows = [
      ["Company","Position","Date Applied","Status"],
      ...jobs.map((j) => [j.company, j.position, j.dateApplied, j.status]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "job_applications.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ─── Filter → Search → Sort pipeline ───────────────────────────────────────
  const statusTypes = ["Applied", "Interviewing", "Rejected", "Offer"];
  const statusCounts = statusTypes.reduce((acc, t) => {
    acc[t] = jobs.filter((j) => j.status === t).length;
    return acc;
  }, {});

  let filtered =
    filterStatus === "All"
      ? jobs
      : jobs.filter((j) => j.status === filterStatus);

  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.company.toLowerCase().includes(term) ||
        j.position.toLowerCase().includes(term)
    );
  }

  const sorted = [...filtered].sort((a, b) => {
    const da = new Date(a.dateApplied).getTime(),
          db = new Date(b.dateApplied).getTime();
    return sortOrder === "Newest" ? db - da : da - db;
  });

  // ─── Wait for client hydrate ────────────────────────────────────────────────
  if (!mounted) return null;

  return (
    <main className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white p-8">

        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Visual Status Breakdown */}
        <div className="mb-6">
          <StatusChart statusCounts={statusCounts} />
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {statusTypes.map((type) => (
            <div
              key={type}
              className={`p-4 rounded shadow text-center ${
                type === "Applied"
                  ? "bg-blue-100 text-blue-800"
                  : type === "Interviewing"
                  ? "bg-yellow-100 text-yellow-800"
                  : type === "Rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              <div className="text-lg font-semibold">{type}</div>
              <div className="text-2xl font-bold">{statusCounts[type]}</div>
            </div>
          ))}
        </div>

        <h1 className="text-4xl font-bold mb-6">Job Tracker Dashboard</h1>

        {/* Live Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by company or position"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border rounded focus:outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="mb-4">
          {["All", ...statusTypes].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 mr-2 rounded ${
                filterStatus === st
                  ? "bg-blue-600 text-white"
                  : "bg-white border dark:bg-gray-800 dark:border-gray-600"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Sort & Export */}
        <div className="mb-6">
          <button
            onClick={() => setSortOrder("Newest")}
            className={`px-4 py-2 mr-2 rounded ${
              sortOrder === "Newest"
                ? "bg-blue-600 text-white"
                : "bg-white border dark:bg-gray-800 dark:border-gray-600"
            }`}
          >
            Newest First
          </button>
          <button
            onClick={() => setSortOrder("Oldest")}
            className={`px-4 py-2 rounded ${
              sortOrder === "Oldest"
                ? "bg-blue-600 text-white"
                : "bg-white border dark:bg-gray-800 dark:border-gray-600"
            }`}
          >
            Oldest First
          </button>
          <button
            onClick={handleExportCSV}
            className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>

        {/* Job Form */}
        <JobForm
          onAdd={handleAddJob}
          company={company}
          setCompany={setCompany}
          position={position}
          setPosition={setPosition}
          dateApplied={dateApplied}
          setDateApplied={setDateApplied}
          status={status}
          setStatus={setStatus}
          editingIndex={editingIndex}
        />

        {/* Job Cards */}
        <div>
          {sorted.map((job, i) => (
            <JobCard
              key={i}
              company={job.company}
              position={job.position}
              dateApplied={job.dateApplied}
              status={job.status}
              onEdit={() => handleEditClick(i)}
              onDelete={() => handleDeleteJob(i)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
