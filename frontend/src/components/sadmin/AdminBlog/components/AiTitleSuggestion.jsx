import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateBlogTitle } from '../hook/Aititle';
import { FaRobot } from 'react-icons/fa';

const AiTitleSuggestion = ({ tags, setTitle }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null); // State for error message

  const handleGenerateTitles = useCallback(async () => {
    if (tags.length === 0) {
      setErrorMessage('Please add at least one tag before generating titles'); // Set error message
      return;
    }
    setIsGenerating(true);
    setErrorMessage(null); // Clear previous error message

    try {
      const rawTitle = await generateBlogTitle(tags);
      const titles = rawTitle
        .replace(/^Here are (?:a few|some) catchy and informative blog titles (?:that cover|covering) the tags .+:\s*/, '')
        .split('*')
        .filter(title => title.trim().length > 0)
        .map(title => title.trim())
        .slice(0, 5);  // Limit to 5 suggestions

      setSuggestions(titles);
    } catch (error) {
      console.error('Error generating titles:', error);
      setErrorMessage('Failed to generate titles. Please try again.'); // Set error message
    } finally {
      setIsGenerating(false);
    }
  }, [tags]);

  const handleSelectTitle = useCallback((title) => {
    setTitle(title);
    toast.success('Title selected and applied');
  }, [setTitle]);

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGenerateTitles}
        disabled={isGenerating || tags.length === 0}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FaRobot className="mr-2 h-4 w-4" />
            Generate AI
          </>
        )}
      </Button>
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Suggested Titles:</h3>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input value={suggestion} readOnly className="flex-grow" />
              <Button onClick={() => handleSelectTitle(suggestion)} className="whitespace-nowrap">
                Select
              </Button>
            </div>
          ))}
        </div>
      )}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Display error message if present */}
    </div>
  );
};

export default React.memo(AiTitleSuggestion);