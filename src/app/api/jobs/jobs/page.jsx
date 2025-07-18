"use client";

import { useEffect, useState } from "react";
import JobForm from "@/components/JobForm";
import JobCard from "@/components/JobCard";

// StatsCard Component to show each status count
function StatsCard({ label, count, bgColor, darkMode }) {
  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "8px",
        backgroundColor: darkMode ? "#1f1f1f" : bgColor,
        textAlign: "center",
      }}
    >
      <strong>{label}</strong>
      <div>{count}</div>
    </div>
  );
}

// TagFilter Component to filter by job tags
function TagFilter({ allTags, selectedTag, setSelectedTag }) {
  if (allTags.length === 0) return null;

  return (
    <div
      style={{
        marginBottom: "1.5rem",
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        alignItems: "center",
      }}
    >
      <strong>Filter by Tag:</strong>
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => setSelectedTag(tag)}
          style={{
            backgroundColor: selectedTag === tag ? "#007bff" : "#e0e0e0",
            color: selectedTag === tag ? "#fff" : "#000",
            padding: "6px 12px",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {tag}
        </button>
      ))}
      {selectedTag && (
        <button
          onClick={() => setSelectedTag(null)}
          style={{
            marginLeft: "10px",
            padding: "6px 12px",
            borderRadius: "20px",
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Clear Filter
        </button>
      )}
    </div>
  );
}

export default function JobsPage() {
  // State hooks
  const [jobs, setJobs] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [jobBeingEdited, setJobBeingEdited] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const savedDarkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
    setJobs(savedJobs);
    setDarkMode(savedDarkMode);
  }, []);

  // Save jobs to localStorage when changed
  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  // Save darkMode to localStorage when changed
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // Add or update a job
  const handleAddOrUpdateJob = (job) => {
    if (jobBeingEdited) {
      setJobs((prevJobs) =>
        prevJobs.map((j) => (j === jobBeingEdited ? { ...job } : j))
      );
      setJobBeingEdited(null);
    } else {
      setJobs((prevJobs) => [...prevJobs, job]);
    }
  };

  // Start editing a job
  const handleEditJob = (job) => setJobBeingEdited(job);

  // Gather all tags from jobs for filtering
  const allTags = Array.from(new Set(jobs.flatMap((job) => job.tags || [])));

  // Filter and sort jobs based on selectedTag and sortOrder
  const filteredJobs = [...(selectedTag
    ? jobs.filter((job) => job.tags?.includes(selectedTag))
    : jobs)].sort((a, b) => {
    if (sortOrder === "newest") return new Date(b.dateApplied) - new Date(a.dateApplied);
    if (sortOrder === "oldest") return new Date(a.dateApplied) - new Date(b.dateApplied);
    if (sortOrder === "reminderSoonest") {
      const aReminder = a.reminderDate ? new Date(a.reminderDate) : Infinity;
      const bReminder = b.reminderDate ? new Date(b.reminderDate) : Infinity;
      return aReminder - bReminder;
    }
    return 0;
  });

  // Notifications for reminders matching today
  useEffect(() => {
    if (Notification.permission !== "granted") return;
    const today = new Date().toISOString().slice(0, 10);
    jobs.forEach((job) => {
      if (job.reminderDate === today) {
        new Notification("Job Reminder", {
          body: `Reminder for ${job.position} at ${job.company}`,
        });
      }
    });
    const interval = setInterval(() => {
      jobs.forEach((job) => {
        if (job.reminderDate === new Date().toISOString().slice(0, 10)) {
          new Notification("Job Reminder", {
            body: `Reminder for ${job.position} at ${job.company}`,
          });
        }
      });
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [jobs]);

  // Calculate stats for dashboard
  const totalJobs = jobs.length;
  const appliedCount = jobs.filter((job) => job.status === "applied").length;
  const interviewingCount = jobs.filter((job) => job.status === "interview").length;
  const offerCount = jobs.filter((job) => job.status === "offer").length;
  const rejectedCount = jobs.filter((job) => job.status === "rejected").length;

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: darkMode ? "#121212" : "#fff",
        color: darkMode ? "#fff" : "#000",
        minHeight: "100vh",
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "1rem" }}>
        Job Tracker
      </h1>

      <button
        onClick={() => setDarkMode((prev) => !prev)}
        style={{
          marginBottom: "1rem",
          padding: "6px 12px",
          borderRadius: "8px",
          backgroundColor: darkMode ? "#333" : "#eee",
          color: darkMode ? "#fff" : "#000",
          border: "1px solid #888",
          cursor: "pointer",
        }}
      >
        Toggle Dark Mode
      </button>

      {/* Stats Dashboard */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <StatsCard label="Total" count={totalJobs} bgColor="#f5f5f5" darkMode={darkMode} />
        <StatsCard label="Applied" count={appliedCount} bgColor="#e0f7fa" darkMode={darkMode} />
        <StatsCard label="Interview" count={interviewingCount} bgColor="#fff3e0" darkMode={darkMode} />
        <StatsCard label="Offer" count={offerCount} bgColor="#e8f5e9" darkMode={darkMode} />
        <StatsCard label="Rejected" count={rejectedCount} bgColor="#ffebee" darkMode={darkMode} />
      </div>

      {/* Job Form */}
      <JobForm onAdd={handleAddOrUpdateJob} editingJob={jobBeingEdited} darkMode={darkMode} />

      {/* Sorting */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Sort by:{" "}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{ padding: "4px 8px" }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="reminderSoonest">Reminder Soonest</option>
          </select>
        </label>
      </div>

      {/* Tag Filter */}
      <TagFilter allTags={allTags} selectedTag={selectedTag} setSelectedTag={setSelectedTag} />

      {/* Job Cards */}
      <div style={{ display: "grid", gap: "1rem" }}>
        {filteredJobs.map((job, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: darkMode ? "#1e1e1e" : "#fff",
            }}
          >
            <JobCard job={job} />
            <button
              onClick={() => handleEditJob(job)}
              style={{ marginTop: "0.5rem", padding: "6px 12px", cursor: "pointer" }}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
