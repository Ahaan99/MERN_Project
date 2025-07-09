import React from "react";
// shadcn Tabs and Button
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
// framer-motion for animation (optional, not needed for shadcn Tabs)
// react-icons
import { FaTshirt, FaUndo, FaRegImage } from "react-icons/fa";

const Customize_Header = ({ side, setSide }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <Tabs value={side} onValueChange={setSide} className="w-full max-w-md">
        <TabsList className="flex gap-2 bg-white rounded-lg shadow p-2 w-full">
          <TabsTrigger value="front" className="flex items-center gap-2">
            <FaTshirt className="w-4 h-4" />
            Front
          </TabsTrigger>
          <TabsTrigger value="back" className="flex items-center gap-2">
            <FaTshirt className="w-4 h-4 scale-y-[-1]" />
            Back
          </TabsTrigger>
          <Button
            variant="ghost"
            className="flex items-center gap-2 ml-auto"
            onClick={() => {
              // handle reset logic here
            }}
          >
            <FaUndo className="w-4 h-4" />
            Reset
          </Button>
        </TabsList>
        <TabsContent value="front">{/* Front content goes here */}</TabsContent>
        <TabsContent value="back">{/* Back content goes here */}</TabsContent>
      </Tabs>
    </div>
  );
};

export default Customize_Header;
