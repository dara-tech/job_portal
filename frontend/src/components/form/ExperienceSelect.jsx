import React from 'react';
import { Briefcase } from 'lucide-react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

const ExperienceSelect = ({ value, onChange }) => (
  <motion.div
    className="space-y-4 p-6  rounded-lg shadow-md ring-1 ring-gray-200 dark:ring-gray-800"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Label htmlFor="experience" className="flex items-center gap-3 text-primary text-lg font-semibold">
      <Briefcase size={20} className="text-blue-400" />
      Years of Experience
    </Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-700">
        <SelectValue placeholder="Select your experience" />
      </SelectTrigger>
      <SelectContent className="bg-white border-gray-200 rounded-md shadow-lg">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "10+"].map((year) => (
          <SelectItem 
            key={year} 
            value={year.toString()} 
            className="dark:text-white hover:bg-gradient-to-r from-primary-500 to-primary-600 hover:text-white transition-colors duration-200"
          >
            {year} {year === 1 ? "year" : "years"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </motion.div>
);

export default ExperienceSelect;