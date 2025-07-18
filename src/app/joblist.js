{jobs.map((job) => (
  <div key={job.id}>
    {<div
  key={job.id}
  className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
>
  <div className="flex justify-between items-start mb-2">
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {job.position}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{job.company}</p>
    </div>
    <span
      className={`px-3 py-1 text-sm rounded-full font-medium ${
        job.status === "applied"
          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          : job.status === "interview"
          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          : job.status === "offer"
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      }`}
    >
      {job.status}
    </span>
  </div>
  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
    Applied on: {job.dateApplied}
  </p>
  {job.reminderDate && (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Reminder: {job.reminderDate}
    </p>
  )}
  {job.tags && job.tags.length > 0 && (
    <div className="mt-2 flex flex-wrap gap-2">
      {job.tags.map((tag, index) => (
        <span
          key={index}
          className="bg-gray-100 dark:bg-gray-700 text-sm px-2 py-1 rounded-xl text-gray-700 dark:text-gray-200"
        >
          {tag}
        </span>
      ))}
    </div>
  )}
</div>
}
  </div>
))}
