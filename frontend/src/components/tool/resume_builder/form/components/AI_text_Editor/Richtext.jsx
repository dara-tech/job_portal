import React, { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Brain } from "lucide-react";
import  AIChatSession  from "../../../hook/AiModel";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Modal from "../../../Modal";
import { toast } from "sonner";
import { Tooltip } from "@/components/ui/tooltip";

const PROMPT =
  'Position Title: {positionTitle} Company: {company}, Based on the Position title and Company, provide me with a list of 3 summary levels: Beginner Level, Pro Level, and Advanced Level. Each summary should be 3-4 lines long. Format the response as a JSON array with "summary" and "position_level" fields for each entry.';

const RichTextEditor = ({ onRichTextEditorChange, index, defaultValue, resumeInfo }) => {
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummaryList, setAiGeneratedSummaryList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const generateSummaryFromAI = async () => {
    setLoading(true);
    const positionTitle = resumeInfo?.Experience[index]?.title || '';
    const company = resumeInfo?.Experience[index]?.companyName || '';
    const prompt = PROMPT.replace('{positionTitle}', positionTitle).replace('{company}', company);
    
    try {
      const result = await AIChatSession.sendMessage(prompt);
      const response = await result.response.text();
      const parsedResponse = JSON.parse(response);
      setAiGeneratedSummaryList(parsedResponse);
      setIsModalOpen(true);
    } catch (error) {
      toast.error(`Failed to generate summary: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarySelection = (selectedSummary) => {
    setValue(selectedSummary.summary);
    onRichTextEditorChange({ target: { value: selectedSummary.summary } });
    setIsModalOpen(false);
  };

  const handleChange = (content) => {
    setValue(content);
    onRichTextEditorChange({ target: { value: content } });
  };

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-2xl font-bold">Summary</label>
        <div className="flex gap-2">
          <Tooltip content="Generate AI Summary">
            <Button
              variant="outline"
              size="sm"
              onClick={generateSummaryFromAI}
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <>
                  <Brain className="h-4 w-4 mx-1" /> Generate from AI
                </>
              )}
            </Button>
          </Tooltip>
        </div>
      </div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link'],
            ['clean']
          ],
        }}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="AI Generated Summaries">
        {aiGeneratedSummaryList.length > 0 ? (
          <div className="space-y-4">
            {aiGeneratedSummaryList.map((item, index) => (
              <div key={index} className="border p-4 rounded-md">
                <h3 className="font-bold text-lg mb-2">Level: {item.position_level}</h3>
                <p className="mb-2 text-sm">{item.summary}</p>
                <Button
                  onClick={() => handleSummarySelection(item)}
                >
                  Use this summary
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p>No summaries generated. Try again.</p>
        )}
      </Modal>
    </div>
  );
};

export default RichTextEditor;
