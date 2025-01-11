"use client"
import React, { useState } from 'react';
import BlenderExporter from '@/components/home';  // Previous export component

const WhisperTimingApp = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [calculations, setCalculations] = useState<any>(null);
  const [error, setError] = useState('');
  const [fps] = useState(24);
  const [transitionFrames] = useState(24);

  const calculateTimings = (segments:any) => {
    const totalDuration = segments[segments.length - 1].end;
    const recommendedImages = Math.ceil(segments.length / 2);
    
    // Group segments for images
    const imageSegments: { start: any; end: any; text: string; duration: number; }[] = [];
    let currentGroup: any[] = [];
    
    segments.forEach((segment:any, index:any) => {
      currentGroup.push(segment);
      const groupDuration = segment.end - currentGroup[0].start;
      
      if (groupDuration >= (totalDuration / recommendedImages) || index === segments.length - 1) {
        imageSegments.push({
          start: currentGroup[0].start,
          end: segment.end,
          text: currentGroup.map(seg => seg.text).join(' '),
          duration: groupDuration
        });
        currentGroup = [];
      }
    });

    // Calculate frame timings
    const imageTimings = imageSegments.map((segment, i) => ({
      imageNumber: i + 1,
      startFrame: Math.ceil(segment.start * fps),
      endFrame: Math.ceil(segment.end * fps),
      durationSeconds: segment.duration,
      text: segment.text
    }));

    return {
      totalDuration,
      totalFrames: Math.ceil(totalDuration * fps),
      numberOfImages: imageSegments.length,
      imageTimings,
      fps,
      transitionFrames
    };
  };

  const handleJsonSubmit = (e:any) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(jsonInput);
      const segments = parsed.segments || [];
      const calculatedData = calculateTimings(segments);
      setCalculations(calculatedData);
      setError('');
    } catch (err) {
      setError('Invalid JSON format');
      setCalculations(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Whisper to Blender Timing Calculator
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <form onSubmit={handleJsonSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste Whisper JSON
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full h-48 px-3 py-2 border rounded-lg"
                placeholder="Paste your Whisper JSON here..."
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Calculate Timings
            </button>
          </form>
          
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
        </div>

        {/* Show the export options only when we have calculations */}
        {calculations && (
          <BlenderExporter calculations={calculations} />
        )}
      </div>
    </div>
  );
};

export default WhisperTimingApp;