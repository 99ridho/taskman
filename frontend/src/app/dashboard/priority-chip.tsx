const PriorityChips = ({ priority }: { priority: string }) => {
  const priorityMapping: Record<string, string> = {
    "1": "Low",
    "2": "Medium",
    "3": "High",
    "4": "Critical",
  };

  const priorityLabel = priorityMapping[priority];
  const priorityColors: Record<string, string> = {
    "1": "bg-sky-500",
    "2": "bg-green-500",
    "3": "bg-orange-500",
    "4": "bg-red-500",
  };

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${
        priorityColors[priority] || "bg-gray-500"
      }`}
    >
      {priorityLabel}
    </div>
  );
};

export default PriorityChips;
