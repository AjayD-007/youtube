'use client'
import { useState } from 'react';
import { diffWords } from 'diff';

export default function JsonToSrtCorrector() {
  const [originalText, setOriginalText] = useState('');
  const [jsonData, setJsonData] = useState<any>(null);
  const [correctedSegments, setCorrectedSegments] = useState<any[]>([]);
  const [changeHistory, setChangeHistory] = useState<any[]>([]);

  // Process JSON file upload
  const handleJsonUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileContent = await file.text();
    const parsedData = JSON.parse(fileContent);
    setJsonData(parsedData);
    setCorrectedSegments(parsedData.segments);
  };

  // Process original text and align with JSON segments
  const processCorrections = () => {
    if (!originalText || !jsonData?.segments) return;

    const originalWords = originalText.toLowerCase().split(/\s+/);
    let originalIndex = 0;
    const newSegments = [];
    const changes = [];

    for (const segment of jsonData.segments) {
      const segmentText = segment.text;
      const diff = diffWords(segmentText, originalText.slice(originalIndex));
      let correctedText = '';

      for (const part of diff) {
        if (part.added) {
          // Track additions from original text
          correctedText += part.value;
          changes.push({
            id: segment.id,
            original: part.removed || '',
            corrected: part.value,
          });
        } else if (!part.removed) {
          correctedText += part.value;
        }
      }

      // Update segment with corrections
      newSegments.push({ ...segment, text: correctedText.trim() });
      originalIndex += correctedText.length;
    }

    setChangeHistory(changes);
    setCorrectedSegments(newSegments);
  };

  // Revert changes for a specific segment
  const revertSegment = (segmentId: number) => {
    setCorrectedSegments((prev) =>
      prev.map((segment) =>
        segment.id === segmentId
          ? jsonData.segments.find((s: any) => s.id === segmentId)
          : segment
      )
    );
  };

  // Convert corrected segments to SRT format
  const convertToSrt = (segments: any[]) => {
    return segments
      .map((segment, index) => {
        const startTime = formatTime(segment.start);
        const endTime = formatTime(segment.end);
        return `${index + 1}\n${startTime} --> ${endTime}\n${segment.text}\n`;
      })
      .join('\n');
  };

  // Helper function to format time (seconds to SRT time format)
  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 12).replace('.', ',');
  };

  // Download corrected SRT
  const downloadCorrectedSrt = () => {
    const srtContent = convertToSrt(correctedSegments);
    const blob = new Blob([srtContent], { type: 'text/srt' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'corrected.srt';
    a.click();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Input Section */}
        <div className="space-y-4">
          <input
            type="file"
            accept=".json"
            onChange={handleJsonUpload}
            className="file-input file-input-bordered w-full"
          />

          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Paste original text here"
            className="textarea textarea-bordered w-full h-64"
          />

          <button
            onClick={processCorrections}
            className="btn btn-primary w-full"
          >
            Process Corrections
          </button>
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          {correctedSegments.map((segment, index) => (
            <div key={segment.id} className="border p-2 rounded">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">
                  {segment.start.toFixed(1)} - {segment.end.toFixed(1)}s
                </span>
                <button
                  onClick={() => revertSegment(segment.id)}
                  className="btn btn-xs btn-error"
                >
                  Revert
                </button>
              </div>

              <div className="diff">
                <div className="diff-item">
                  <div className="diff-header">Original</div>
                  <div className="text-red-500">
                    {jsonData.segments[index]?.text}
                  </div>
                </div>
                <div className="diff-item">
                  <div className="diff-header">Corrected</div>
                  <div className="text-green-500">{segment.text}</div>
                </div>
              </div>
            </div>
          ))}

          {correctedSegments.length > 0 && (
            <button
              onClick={downloadCorrectedSrt}
              className="btn btn-success w-full mt-4"
            >
              Download Corrected SRT
            </button>
          )}
        </div>
      </div>
    </div>
  );
}