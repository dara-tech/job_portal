import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Code, X, Plus } from "lucide-react"

const SkillsInput = ({ skills, onAddSkill, onRemoveSkill }) => {
    const [newSkill, setNewSkill] = useState('');
  
    const handleAddSkill = () => {
      if (newSkill.trim()) {
        onAddSkill(newSkill.trim());
        setNewSkill('');
      }
    };
  
    return (
    
      <div className="space-y-4 p-6  rounded-lg shadow-sm ring-1 ring-gray-100 dark:ring-gray-800 ">
        <Label htmlFor="skills" className="flex items-center gap-2 text-primary text-lg font-semibold">
          <Code size={20} className="text-blue-400" />
          Skills
        </Label>
        <div className="flex flex-wrap gap-3 mb-4">
          {skills.map((skill, index) => (
            <span key={index} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-md transition-all duration-300 hover:shadow-lg">
              {skill}
              <button
                type="button"
                onClick={() => onRemoveSkill(skill)}
                className="ml-2 text-white hover:text-red-300 focus:outline-none transition-colors duration-300"
                aria-label={`Remove ${skill}`}
              >
                <X size={16} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          <Input
            id="newSkill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            className=""
          />
          <Button 
            type="button" 
            onClick={handleAddSkill} 
            className="dark:text-white shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <Plus size={18} className="mr-2" />
            Add
          </Button>
        </div>
      </div>
    );
  };

  export default SkillsInput;
  