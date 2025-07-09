import React from "react";

const fontFamilies = [
  "inherit",
  "Arial",
  "Georgia",
  "Courier New",
  "Times New Roman",
  "Comic Sans MS",
  "Verdana",
];

const colorSwatches = [
  "#222222",
  "#ffffff",
  "#e11d48",
  "#f59e42",
  "#fbbf24",
  "#10b981",
  "#2563eb",
  "#6366f1",
  "#a21caf",
];

const TextSidebarPanel = ({ expandedText, onAddText, onUpdateTextStyle }) => (
  <div className="w-60 px-4 mt-2 flex flex-col gap-4 border-l border-slate-200 bg-white min-h-screen">
    {/* Search bar */}
    <input
      type="text"
      placeholder="Search fonts and combinations"
      className="w-full border rounded px-3 py-2 text-sm mb-2"
      style={{ marginTop: 8 }}
      disabled
    />
    {/* Add a text box button */}
    <button
      className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded mb-2"
      onClick={onAddText}
      type="button"
    >
      T Add a text box
    </button>
    {/* Default text styles */}
    <div className="mb-2">
      <div className="text-xs text-slate-500 mb-1">Default text styles</div>
      <button
        type="button"
        className="w-full border border-slate-200 rounded px-3 py-2 mb-2 text-left font-bold text-xl bg-white"
        onClick={() =>
          onAddText &&
          onAddText({
            value: "Add a heading",
            fontSize: 32,
            fontWeight: "bold",
          })
        }
      >
        Add a heading
      </button>
      <button
        type="button"
        className="w-full border border-slate-200 rounded px-3 py-2 mb-2 text-left font-semibold text-lg bg-white"
        onClick={() =>
          onAddText &&
          onAddText({
            value: "Add a subheading",
            fontSize: 24,
            fontWeight: "600",
          })
        }
      >
        Add a subheading
      </button>
      <button
        type="button"
        className="w-full border border-slate-200 rounded px-3 py-2 text-left text-base bg-white"
        onClick={() =>
          onAddText &&
          onAddText({
            value: "Add a little bit of body text",
            fontSize: 16,
            fontWeight: "normal",
          })
        }
      >
        Add a little bit of body text
      </button>
    </div>
    {/* Controls for selected text */}
    {expandedText && (
      <>
        {/* Font Size Slider */}
        <div>
          <label className="block text-xs mb-1 text-slate-600">Font Size</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={10}
              max={120}
              value={expandedText.fontSize || 22}
              onChange={(e) =>
                onUpdateTextStyle &&
                onUpdateTextStyle(expandedText.id, {
                  fontSize: parseInt(e.target.value, 10),
                })
              }
              className="flex-1 accent-violet-600"
              style={{ width: "100%" }}
            />
            <span className="w-8 text-xs text-right text-slate-700">
              {expandedText.fontSize || 22}
            </span>
          </div>
        </div>
        {/* Color Swatches + Picker */}
        <div>
          <label className="block text-xs mb-1 text-slate-600">Color</label>
          <div className="flex flex-wrap gap-1 mb-2">
            {colorSwatches.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-6 h-6 rounded border ${
                  expandedText.color === color
                    ? "border-violet-600 ring-2 ring-violet-300"
                    : "border-slate-200"
                }`}
                style={{ background: color }}
                onClick={() =>
                  onUpdateTextStyle &&
                  onUpdateTextStyle(expandedText.id, { color })
                }
                aria-label={color}
              />
            ))}
            {/* Custom color picker */}
            <input
              type="color"
              value={expandedText.color || "#222222"}
              onChange={(e) =>
                onUpdateTextStyle &&
                onUpdateTextStyle(expandedText.id, { color: e.target.value })
              }
              className="w-6 h-6 border border-slate-200 rounded cursor-pointer"
              style={{ padding: 0 }}
              aria-label="Custom color"
            />
          </div>
        </div>
        {/* Font Family Dropdown with Preview */}
        <div>
          <label className="block text-xs mb-1 text-slate-600">
            Font Family
          </label>
          <select
            value={expandedText.fontFamily || "inherit"}
            onChange={(e) =>
              onUpdateTextStyle &&
              onUpdateTextStyle(expandedText.id, {
                fontFamily: e.target.value,
              })
            }
            className="w-full border rounded px-2 py-1 text-sm"
            style={{
              fontFamily: expandedText.fontFamily || "inherit",
            }}
          >
            {fontFamilies.map((f) => (
              <option key={f} value={f} style={{ fontFamily: f }}>
                {f}
              </option>
            ))}
          </select>
          {/* Preview */}
          <div
            className="mt-1 text-xs text-slate-600"
            style={{
              fontFamily: expandedText.fontFamily || "inherit",
              border: "1px dashed #e5e7eb",
              borderRadius: 4,
              padding: "2px 6px",
              background: "#f9fafb",
            }}
          >
            {expandedText.value || "Sample Text"}
          </div>
        </div>
      </>
    )}
  </div>
);

export default TextSidebarPanel;
