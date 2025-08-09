"use client";

// src/components/JobForm.jsx
// Minimal, framework-agnostic styling; adjust classes to your design system.
import { useEffect, useState } from "react";

/**
 * JobForm
 * - Works for both create and edit via the optional `editingJob` prop.
 * - Validates required fields and surfaces simple error messages.
 * - Normalizes comma-separated tags to an array on submit.
 */
export default function JobForm({ editingJob = null, onSubmit }) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("applied");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState(""); // stored as string in the input
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  // Sync when editingJob changes (e.g., opening the form prefilled)
  useEffect(() => {
    setCompany(editingJob?.company ?? "");
    setPosition(editingJob?.position ?? "");
    setStatus(editingJob?.status ?? "applied");
    setLink(editingJob?.link ?? "");
    // accept either array or string for tags coming in
    const incomingTags = Array.isArray(editingJob?.tags)
      ? editingJob?.tags.join(", ")
      : editingJob?.tags ?? "";
    setTags(incomingTags);
    setNotes(editingJob?.notes ?? "");
  }, [editingJob]);

  // Keep this outside of conditional blocks so it always compiles and stays in scope.
  const validate = () => {
    const nextErrors = {};
    if (!company.trim()) nextErrors.company = "Company is required.";
    if (!position.trim()) nextErrors.position = "Position is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Parse a comma-separated tags string into a de-duped array.
  // Why: ensures backend gets a normalized list.
  const parseTags = (value) => {
    if (typeof value !== "string") return [];
    const normalized = value
      .split(",")
      .map((t) => t.trim()) // <-- replaces the broken `.map()` with an actual callback
      .filter(Boolean);
    return [...new Set(normalized)];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      id: editingJob?.id,
      company: company.trim(),
      position: position.trim(),
      status,
      link: link.trim(),
      tags: parseTags(tags),
      notes: notes.trim(),
    };

    onSubmit?.(payload);
  };

  // If you truly need to guard behavior when *not* editing, do it with braces.
  // (Leaving here as a pattern to avoid the previous `if` without braces issue.)
  // if (!editingJob) {
  //   // e.g. set defaults or disable fields
  // }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="flex flex-col gap-1">
        <label htmlFor="company" className="font-medium">Company</label>
        <input
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border rounded-md px-3 py-2"
          placeholder="Acme Inc."
        />
        {errors.company && (
          <p className="text-red-600 text-sm" role="alert">{errors.company}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="position" className="font-medium">Position</label>
        <input
          id="position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="border rounded-md px-3 py-2"
          placeholder="Frontend Engineer"
        />
        {errors.position && (
          <p className="text-red-600 text-sm" role="alert">{errors.position}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="status" className="font-medium">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="link" className="font-medium">Job Link</label>
        <input
          id="link"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border rounded-md px-3 py-2"
          placeholder="https://..."
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="tags" className="font-medium">Tags (comma-separated)</label>
        <input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border rounded-md px-3 py-2"
          placeholder="remote, react, referral"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="font-medium">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border rounded-md px-3 py-2 min-h-24"
          placeholder="Anything noteworthy about this application..."
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="px-4 py-2 rounded-md border font-medium hover:opacity-90"
        >
          {editingJob ? "Update Job" : "Add Job"}
        </button>
      </div>
    </form>
  );
}
