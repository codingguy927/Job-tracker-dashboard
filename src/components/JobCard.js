"use client";

export default function JobCard({ job }) {
  if (!job) return null;  // Return nothing if job is missing or undefined

  const {
    company,
    position,
    dateApplied,
    status,
    reminderDate,
    tags = [],
  } = job;

  // Helper: Check if reminder is within 3 days
  const isReminderSoon = () => {
    if (!reminderDate) return false;
    const today = new Date();
    const reminder = new Date(reminderDate);
    const diffTime = reminder.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 3;
  };

  const highlightStyle = isReminderSoon()
    ? {
        border: "2px solid #ff9800", // orange highlight
        backgroundColor: "#fff8e1",
      }
    : {
        border: "1px solid #ccc",
        backgroundColor: "#f9f9f9",
      };

  return (
    <div
      style={{
        ...highlightStyle,
        borderRadius: "8px",
        padding: "1rem",
        transition: "background-color 0.3s ease",
      }}
    >
      <h2 style={{ margin: 0 }}>{company}</h2>
      <p style={{ margin: "4px 0" }}>
        <strong>Position:</strong> {position}
      </p>
      <p style={{ margin: "4px 0" }}>
        <strong>Date Applied:</strong> {dateApplied}
      </p>
      <p style={{ margin: "4px 0" }}>
        <strong>Status:</strong> {status}
      </p>

      {reminderDate && (
        <p style={{ margin: "4px 0", color: "#ff5722" }}>
          <strong>Reminder:</strong> {reminderDate}
        </p>
      )}

      {tags.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          <strong>Tags:</strong>{" "}
          {tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                marginRight: "6px",
                backgroundColor: "#e0e0e0",
                padding: "2px 6px",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
