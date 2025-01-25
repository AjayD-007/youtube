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

  // Process corrections with segment-by-segment matching
  const processCorrections = () => {
    if (!originalText || !jsonData?.segments) return;

    // Remove extra whitespace and split into words
    const cleanedOriginalText = originalText
      .replace(/\s+/g, ' ')
      .trim();

    let currentTextIndex = 0;
    const newSegments = [];
    const changes = [];

    for (const segment of jsonData.segments) {
      // Find the best match for the current segment in the original text
      const remainingText = cleanedOriginalText.slice(currentTextIndex);
      
      // Try to find a close match for the segment
      const closestMatch = findBestMatch(
        segment.text.trim(), 
        remainingText
      );

      if (closestMatch) {
        // Track changes
        if (closestMatch.original !== segment.text.trim()) {
          changes.push({
            id: segment.id,
            original: segment.text.trim(),
            corrected: closestMatch.original
          });

          // Update the segment with the corrected text
          newSegments.push({
            ...segment,
            text: closestMatch.original
          });

          // Move the text index forward
          currentTextIndex += closestMatch.startIndex + closestMatch.original.length;
        } else {
          // No change needed
          newSegments.push(segment);
          currentTextIndex += closestMatch.startIndex + segment.text.trim().length;
        }
      } else {
        // If no match found, keep original segment
        newSegments.push(segment);
      }
    }

    setChangeHistory(changes);
    setCorrectedSegments(newSegments);
  };

  // Find best match for a segment in the remaining text
  const findBestMatch = (segmentText: string, remainingText: string) => {
    // Remove leading/trailing whitespace and convert to lowercase for matching
    const cleanSegment = segmentText.trim().toLowerCase();
    const cleanRemaining = remainingText.toLowerCase();

    // Try exact match first
    const exactMatchIndex = cleanRemaining.indexOf(cleanSegment);
    if (exactMatchIndex !== -1) {
      return {
        original: remainingText.slice(exactMatchIndex, exactMatchIndex + segmentText.trim().length),
        startIndex: exactMatchIndex
      };
    }

    // If no exact match, try more lenient matching
    // This could be expanded with more sophisticated matching algorithms
    for (let i = 0; i < cleanRemaining.length; i++) {
      const substring = cleanRemaining.slice(i, i + cleanSegment.length);
      const similarity = calculateSimilarity(cleanSegment, substring);
      
      if (similarity > 0.7) { // 70% similarity threshold
        return {
          original: remainingText.slice(i, i + segmentText.trim().length),
          startIndex: i
        };
      }
    }

    return null;
  };

  // Calculate similarity between two strings
  const calculateSimilarity = (str1: string, str2: string) => {
    const longerLength = Math.max(str1.length, str2.length);
    const editDistance = levenshteinDistance(str1, str2);
    return (longerLength - editDistance) / longerLength;
  };

  // Levenshtein distance algorithm for string similarity
  const levenshteinDistance = (str1: string, str2: string) => {
    const matrix = [];

    for (let i = 0; i <= str1.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str1.length; i++) {
      for (let j = 1; j <= str2.length; j++) {
        if (str1.charAt(i - 1) === str2.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str1.length][str2.length];
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
            className="w-full p-2 border rounded"
          />

          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Paste original text here"
            className="w-full h-64 p-2 border rounded"
          />

          <button
            onClick={processCorrections}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  Revert
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-sm font-semibold text-red-600">Original</div>
                  <div className="text-red-500">
                    {jsonData.segments[index]?.text}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-600">Corrected</div>
                  <div className="text-green-500">{segment.text}</div>
                </div>
              </div>
            </div>
          ))}

          {correctedSegments.length > 0 && (
            <button
              onClick={downloadCorrectedSrt}
              className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
            >
              Download Corrected SRT
            </button>
          )}
        </div>
      </div>
    </div>
  );
}