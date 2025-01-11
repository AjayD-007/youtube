"use client";

import BlenderScriptGenerator, {
  ImageTiming,
} from "@/components/blender_script";
import React, { useState } from "react";

const BlenderScriptWrapper: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [fps, setFps] = useState<number>(24);
  const [imageFolder, setImageFolder] = useState<string>(
    "C:/Users/ASUS/OneDrive/Documents/youtube/downloads/"
  );
  const [data, setData] = useState<ImageTiming[] | null>(null);
  const adjustStartTimes = (jsonData:any, fps=24) => {
    return jsonData.map((element:any,index:number) => {
      let startInFrames = Math.floor(element.start * fps);
      let endInframes = Math.floor(element.stop * fps);
      if (startInFrames >= 40) {
        startInFrames -= 40;
      } else {
        startInFrames = 0;
      }
      return { ...element, start: startInFrames,stop:endInframes,image_number:index+1 };
    });
  };
  const handleSubmit = () => {
    try {
      const parsedData: ImageTiming[] = JSON.parse(jsonInput);
      setData(adjustStartTimes(parsedData));
    } catch (error) {
      alert("Invalid JSON. Please check your input.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Blender Script Generator Setup
        </h2>

        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Paste your JSON here"
          rows={10}
          className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-gray-700 font-medium mb-2">FPS</label>
            <input
              type="number"
              value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-gray-700 font-medium mb-2">
              Image Folder
            </label>
            <input
              type="text"
              value={imageFolder}
              onChange={(e) => setImageFolder(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Submit
        </button>

        {data && (
          <div className="mt-8">
            <BlenderScriptGenerator
              data={data}
              fps={fps}
              imageFolder={imageFolder}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlenderScriptWrapper;
