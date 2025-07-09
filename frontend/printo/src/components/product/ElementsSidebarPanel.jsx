import React from "react";

const elements = [
  {
    type: "shape",
    label: "Circle",
    icon: <div className="w-8 h-8 rounded-full bg-indigo-500 mx-auto" />,
    data: { shape: "circle", color: "#6366f1" },
  },
  {
    type: "shape",
    label: "Square",
    icon: <div className="w-8 h-8 rounded-lg bg-orange-400 mx-auto" />,
    data: { shape: "square", color: "#f59e42" },
  },
  {
    type: "shape",
    label: "Triangle",
    icon: (
      <svg width="32" height="32" className="block mx-auto">
        <polygon points="16,4 28,28 4,28" fill="#10b981" />
      </svg>
    ),
    data: { shape: "triangle", color: "#10b981" },
  },
  {
    type: "sticker",
    label: "Star",
    icon: (
      <svg width="32" height="32" className="block mx-auto">
        <polygon points="16,4 20,24 4,12 28,12 12,24" fill="#fbbf24" />
      </svg>
    ),
    data: { shape: "star", color: "#fbbf24" },
  },
  {
    type: "sticker",
    label: "Heart",
    icon: (
      <svg width="32" height="32" className="block mx-auto">
        <path
          d="M16 29s-13-8.35-13-16.5S8.5 2 16 9.5 29 2 29 12.5 16 29 16 29z"
          fill="#ef4444"
        />
      </svg>
    ),
    data: { shape: "heart", color: "#ef4444" },
  },
];

const ElementsSidebarPanel = ({ onAddElement }) => (
  <div className="w-60 px-4 mt-2 flex flex-col gap-4 border-l border-slate-200 bg-white min-h-screen">
    <div className="mb-2">
      <div className="text-xs text-slate-500 mb-2">Shapes & Stickers</div>
      <div className="grid grid-cols-3 gap-3">
        {elements.map((el, idx) => (
          <button
            key={el.label}
            className="flex flex-col items-center justify-center border border-slate-200 rounded p-2 bg-white hover:bg-slate-100"
            onClick={() => onAddElement && onAddElement(el.data)}
            type="button"
            title={el.label}
          >
            {el.icon}
            <span className="text-xs mt-1">{el.label}</span>
          </button>
        ))}
      </div>
    </div>
    <div className="text-xs text-slate-400 mt-6">
      More elements coming soon...
    </div>
  </div>
);

export default ElementsSidebarPanel;
