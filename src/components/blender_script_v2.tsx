import React, { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Download, CheckCircle2 } from "lucide-react";
import {
  BASE_IMPORTS,
  CLEAR_SEQUENCER,
  TIMELINE_SETUP,
  TRANSFORM_EFFECT,
  MAIN_FUNCTION,
} from "@/components/template/blender_script";
import { ImageTiming } from "@/components/blender_script";
import { AUDIO_FUNCTIONS, INTRO_OUTRO_FUNCTIONS, TEXT_TEMPLATES } from "./template/blender_scripts_others";

interface Props {
  data: ImageTiming[];
  fps?: number;
  imageFolder?: string;
}

const BlenderScriptGenerator: React.FC<Props> = ({
  data = [],
  fps = 24,
  imageFolder = "C:/path/to/images/",
}) => {
  const [copied, setCopied] = React.useState(false);
  function normalizePath(path: string): string {
    // Replace all backslashes with forward slashes
    let normalized = path.replace(/\\/g, "/");
    // Ensure it ends with a forward slash
    if (!normalized.endsWith("/")) {
      normalized += "/";
    }
  
    return normalized;
  }
  const generateBlenderScript = useCallback(() => {
    if (!data || data.length === 0) return "";

    const startFrame = data[0]?.start || 0;
    const endFrame = data[data.length - 1]?.stop || 0;
    const totalFrames = endFrame - startFrame;
    const someData = data.map((ele:ImageTiming,index:number)=>({start:ele.start,stop:ele.stop,prompt:"",image_number:(index+1)}))
    const correctedImageFolder = normalizePath(imageFolder);
    return [
      BASE_IMPORTS,
      CLEAR_SEQUENCER,
      TIMELINE_SETUP(fps, startFrame, totalFrames),
      AUDIO_FUNCTIONS,
      TEXT_TEMPLATES("MANIMEKALAI", "CHAPTER 12"),
      TRANSFORM_EFFECT,
      INTRO_OUTRO_FUNCTIONS(
        "C:/Users/ASUS/OneDrive/Documents/youtube/downloads/intro.mp4",data
      ),
      MAIN_FUNCTION(someData, correctedImageFolder),
    ].join("\n\n");
  }, [data, fps, imageFolder]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateBlenderScript());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generateBlenderScript()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blender_script.py";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">
            Blender Script Generator
          </CardTitle>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm font-mono">
          {generateBlenderScript()}
        </pre>
      </CardContent>
    </Card>
  );
};

export default BlenderScriptGenerator;