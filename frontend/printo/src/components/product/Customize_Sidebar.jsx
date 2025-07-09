import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SidebarItem from "./SidebarItem";
import TextSidebarPanel from "./TextSidebarPanel";
import ElementsSidebarPanel from "./ElementsSidebarPanel";

// Sidebar items config
const sidebarItems = [
  {
    label: "Design",
    icon: (
      <img
        src="/design.png"
        alt="Design Icon"
        style={{ width: 22, height: 22 }}
      />
    ),
  },
  {
    label: "Elements",
    icon: (
      <img
        src="/elements.png"
        alt="Elements Icon"
        style={{ width: 22, height: 22 }}
      />
    ),
  },
  {
    label: "Text",
    icon: (
      <img src="/text.png" alt="Text Icon" style={{ width: 22, height: 22 }} />
    ),
  },
  {
    label: "Brand",
    icon: (
      <img
        src="/brand.png"
        alt="Brand Icon"
        style={{ width: 22, height: 22 }}
      />
    ),
  },
  {
    label: "Uploads",
    icon: (
      <img
        src="/uploads.png"
        alt="Uploads Icon"
        style={{ width: 22, height: 22 }}
      />
    ),
  },
  {
    label: "Tools",
    icon: (
      <img
        src="/tools.png"
        alt="Tools Icon"
        style={{ width: 22, height: 22 }}
      />
    ),
  },
];

const Customize_Sidebar = ({
  onAddText,
  expandedText,
  onUpdateTextStyle,
  onAddElement,
  onImageUpload,
}) => {
  // Track which sidebar panel is open: "text", "elements", etc.
  const [activePanel, setActivePanel] = useState(null);

  // Open text panel if a text is selected
  React.useEffect(() => {
    if (expandedText) setActivePanel("text");
  }, [expandedText]);

  return (
    <TooltipProvider>
      <div className="flex flex-row min-h-screen border-r border-slate-200 shadow-sm bg-slate-50 transition-all duration-200">
        {/* Sidebar icons */}
        <div className="flex flex-col items-center pt-5 pb-5 w-20">
          {sidebarItems.map((item, idx) => (
            <SidebarItem
              key={item.label}
              item={item}
              isActive={
                (item.label === "Text" && activePanel === "text") ||
                (item.label === "Elements" && activePanel === "elements")
              }
              onClick={
                item.label === "Text"
                  ? () => setActivePanel("text")
                  : item.label === "Elements"
                  ? () => setActivePanel("elements")
                  : undefined
              }
              onImageUpload={item.label === "Uploads" ? onImageUpload : undefined}
              delay={idx * 0.07}
            />
          ))}
        </div>
        {/* Panels */}
        {activePanel === "text" && (
          <TextSidebarPanel
            expandedText={expandedText}
            onAddText={onAddText}
            onUpdateTextStyle={onUpdateTextStyle}
          />
        )}
        {activePanel === "elements" && (
          <ElementsSidebarPanel onAddElement={onAddElement} />
        )}
      </div>
    </TooltipProvider>
  );
};

export default Customize_Sidebar;
