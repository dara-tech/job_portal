import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Code, X, Plus } from "lucide-react"
import { Slider } from "@/components/ui/slider"

const SkillsInput = ({ skills, onAddSkill, onRemoveSkill }) => {
const [newSkill, setNewSkill] = useState('');
const [newRating, setNewRating] = useState(3);

const handleAddSkill = () => {
  if (newSkill.trim()) {
    onAddSkill({ name: newSkill.trim(), rating: newRating });
    setNewSkill('');
    setNewRating(3);
  }
};

return (
  <div className="space-y-6 p-6 rounded-lg shadow-md bg-white dark:bg-transparent ring-1 ring-gray-300 dark:ring-gray-800">
    <Label htmlFor="skills" className="flex items-center gap-2 text-primary text-xl font-semibold">
      <Code size={24} className="text-blue-500" />
      Skills
    </Label>
    <div className="flex flex-wrap gap-3 mb-6">
      {skills.map((skill, index) => (
        <span key={index} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
          {skill.name}
          <div className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded-full">
            {skill.rating}/5
          </div>
          <button
            type="button"
            onClick={() => onRemoveSkill(skill.name)}
            className="ml-2 text-white hover:text-red-300 focus:outline-none transition-colors duration-300"
            aria-label={`Remove ${skill.name}`}
          >
            <X size={16} />
          </button>
        </span>
      ))}
    </div>
    <div className="space-y-4">
      <Input
        id="newSkill"
        value={newSkill}
        onChange={(e) => setNewSkill(e.target.value)}
        placeholder="Add a skill"
        className="w-full"
      />
      <div className="space-y-2">
        <Label htmlFor="rating" className="text-sm font-medium">
          Skill proficiency: {newRating}
        </Label>
        <Slider
          id="rating"
          min={1}
          max={5}
          step={0.1}
          value={[newRating]}
          onValueChange={(value) => setNewRating(parseFloat(value[0].toFixed(1)))}
          className="w-full"
        />
      </div>
      <div className="flex gap-2">
        <Button 
          type="button" 
          onClick={handleAddSkill} 
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          <Plus size={18} className="mr-2" />
          Add Skill
        </Button>
      </div>
    </div>
  </div>
);
};

export default SkillsInput;