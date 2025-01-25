"use client"
import React, { useState, useCallback } from 'react';
import { FileText, Check, Download } from 'lucide-react';

const TranscriptionEditor = () => {
  const [originalText, setOriginalText] = useState('');
  const [transcriptionFile, setTranscriptionFile] = useState(null);
  const [transcriptionData, setTranscriptionData] = useState(null);
  const [comparedSegments, setComparedSegments] = useState([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);

  // Handle file upload for JSON transcription
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result.toString());
          setTranscriptionFile(file);
          setTranscriptionData(jsonData);
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  // Split original text into lines
  const splitOriginalText = useCallback(() => {
    return originalText.split('\n').filter(line => line.trim() !== '');
  }, [originalText]);

  // Compare transcription with original text
  const compareTranscription = () => {
    if (!transcriptionData || !originalText) {
      alert('Please upload a transcription file and enter original text');
      return;
    }

    const originalLines = splitOriginalText();
    const compared = transcriptionData.segments.map((segment, index) => ({
      segmentId: segment.id,
      start: segment.start,
      end: segment.end,
      transcribedText: segment.text.trim(),
      originalText: originalLines[index] || '',
      editedText: segment.text.trim()
    }));

    setComparedSegments(compared);
    setCurrentSegmentIndex(0);
  };

  // Update edited text
  const handleEditText = (editedText) => {
    const updatedSegments = [...comparedSegments];
    updatedSegments[currentSegmentIndex].editedText = editedText;
    setComparedSegments(updatedSegments);
  };

  // Generate SRT file
  const generateSRTFile = () => {
    if (!comparedSegments.length) return;

    const srtContent = comparedSegments.map((segment, index) => {
      const startTime = formatTime(segment.start);
      const endTime = formatTime(segment.end);

      return `${index + 1}\n${startTime} --> ${endTime}\n${segment.editedText}\n`;
    }).join('\n');

    const blob = new Blob([srtContent], { type: 'text/srt' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'corrected_transcription.srt';
    link.click();
  };

  // Format time for SRT
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = (seconds % 60).toFixed(3);
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`.replace('.', ',');
  };

  // Pad numbers
  const pad = (num) => num.toString().padStart(2, '0');

  // Navigate between segments
  const goToPreviousSegment = () => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(currentSegmentIndex - 1);
    }
  };

  const goToNextSegment = () => {
    if (currentSegmentIndex < comparedSegments.length - 1) {
      setCurrentSegmentIndex(currentSegmentIndex + 1);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Transcription Editor
        </h1>

        {/* File Upload Section */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Upload Whisper JSON Transcription
          </label>
          <input 
            type="file" 
            accept=".json"
            onChange={handleFileUpload}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Original Text Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Original Text
          </label>
          <textarea 
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Paste the original text here"
            className="w-full p-2 border rounded-md h-32"
          />
        </div>

        {/* Compare Button */}
        <button 
          onClick={compareTranscription}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center mb-4"
        >
          <Check className="mr-2" /> Compare Transcriptions
        </button>

        {/* Segment Comparison and Editing */}
        {comparedSegments.length > 0 && (
          <div className="mt-4 border rounded p-4">
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={goToPreviousSegment}
                disabled={currentSegmentIndex === 0}
                className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <div className="text-center">
                <span className="font-bold">Segment {currentSegmentIndex + 1}</span>
                <span className="text-gray-500 ml-2">
                  ({comparedSegments[currentSegmentIndex].start.toFixed(2)} - {comparedSegments[currentSegmentIndex].end.toFixed(2)} sec)
                </span>
              </div>
              <button 
                onClick={goToNextSegment}
                disabled={currentSegmentIndex === comparedSegments.length - 1}
                className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-green-600 mb-2">Original Text</h3>
                <div className="p-2 border rounded bg-green-50">
                  {comparedSegments[currentSegmentIndex].originalText}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-blue-600 mb-2">Transcribed Text</h3>
                <textarea 
                  value={comparedSegments[currentSegmentIndex].editedText}
                  onChange={(e) => handleEditText(e.target.value)}
                  className="w-full p-2 border rounded h-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Download SRT Button */}
        {comparedSegments.length > 0 && (
          <button 
            onClick={generateSRTFile}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
          >
            <Download className="mr-2" /> Download Corrected SRT
          </button>
        )}
      </div>
    </div>
  );
};

export default TranscriptionEditor;