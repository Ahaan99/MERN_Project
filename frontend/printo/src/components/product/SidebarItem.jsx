import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const SidebarItem = ({ item, isActive, onClick, delay, onImageUpload }) => {
  const fileInputRef = useRef(null);

  const handleClick = (e) => {
    if (item.label === "Uploads" && onImageUpload) {
      fileInputRef.current?.click();
    } else if (onClick) {
      onClick(e);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload(file);
      // Reset the input so the same file can be selected again
      e.target.value = '';
    }
  };

  return (
    <motion.div
      className={`flex flex-col items-center mb-7 ${
        isActive ? "text-blue-600" : ""
      }`}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 300,
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`w-11 h-11 rounded-xl text-slate-700 bg-transparent transition-colors hover:bg-slate-100 hover:text-blue-600 ${
              isActive ? "bg-blue-100" : ""
            }`}
            aria-label={item.label}
            onClick={handleClick}
          >
            {item.icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs font-medium">
          {item.label}
        </TooltipContent>
      </Tooltip>
      {item.label === "Uploads" && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      )}
    </motion.div>
  );
};

export default SidebarItem;
