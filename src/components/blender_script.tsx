import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Download, CheckCircle2 } from "lucide-react";

export interface ImageTiming {
  start: number;
  stop: number;
  prompt: string;
}

interface Props {
  data: ImageTiming[];
  fps?: number;
  imageFolder?: string;
}

const sanitizeString = (str: string): string => {
  return str.replace(/"/g, '\\"').replace(/'/g, "\\'");
};

const BlenderScriptGenerator: React.FC<Props> = ({
  data = [],
  fps = 24,
  imageFolder = "C:/path/to/images/",
}) => {
  const [copied, setCopied] = useState(false);

  const generateBlenderScript = useCallback(
    (): string => {
      if (!data || data.length === 0) return "";
  
      // Calculate total frames based on the last stop time
      
      const totalFrames =   data[data.length-1].stop - data[0].start;
  
      return `
import bpy
import random
from mathutils import Vector
  
def clear_sequencer():
      """Clear all strips from the sequencer."""
      if bpy.context.scene.sequence_editor:
          sequences = list(bpy.context.scene.sequence_editor.sequences_all)
          for strip in sequences:
              try:
                  bpy.context.scene.sequence_editor.sequences.remove(strip)
              except RuntimeError as e:
                  print(f"Warning: Unable to remove strip {strip.name} - {e}")
  
def setup_timeline():
      """Initialize the timeline settings."""
      bpy.context.scene.render.fps = ${fps}
      bpy.context.scene.frame_start = ${data[0].start}
      bpy.context.scene.frame_end = ${totalFrames}
  
def add_transform_effect(strip, start_frame, end_frame, channel):
      """Add random Ken Burns style transform effect to an image strip."""
      transform = bpy.context.scene.sequence_editor.sequences.new_effect(
          name=f"Transform_{strip.name}",
          type='TRANSFORM',
          channel=channel,
          frame_start=start_frame,
          frame_end=end_frame,
          seq1=strip
      )
  
      # Random starting and ending positions/scales for Ken Burns effect
      scale_start = random.uniform(1.0, 1.4)
      scale_end = random.uniform(1.0, 1.4)
      pos_start_x = random.uniform(-0.2, 0.2)
      pos_start_y = random.uniform(-0.2, 0.2)
      pos_end_x = random.uniform(-0.2, 0.2)
      pos_end_y = random.uniform(-0.2, 0.2)
  
      # Set initial keyframes
      transform.scale_start_x = scale_start
      transform.scale_start_y = scale_start
      transform.translate_start_x = pos_start_x
      transform.translate_start_y = pos_start_y
      transform.keyframe_insert(data_path='scale_start_x', frame=start_frame)
      transform.keyframe_insert(data_path='scale_start_y', frame=start_frame)
      transform.keyframe_insert(data_path='translate_start_x', frame=start_frame)
      transform.keyframe_insert(data_path='translate_start_y', frame=start_frame)
  
      # Set ending keyframes
      transform.scale_start_x = scale_end
      transform.scale_start_y = scale_end
      transform.translate_start_x = pos_end_x
      transform.translate_start_y = pos_end_y
      transform.keyframe_insert(data_path='scale_start_x', frame=end_frame)
      transform.keyframe_insert(data_path='scale_start_y', frame=end_frame)
      transform.keyframe_insert(data_path='translate_start_x', frame=end_frame)
      transform.keyframe_insert(data_path='translate_start_y', frame=end_frame)
  
      return transform
  
def main():
      # Clear existing strips
      clear_sequencer()
  
      # Set up timeline
      setup_timeline()
  
      # Ensure we have a sequence editor
      if not bpy.context.scene.sequence_editor:
          bpy.context.scene.sequence_editor_create()
  
      # Image timing data
      image_timings = ${JSON.stringify(data, null, 2)}
  
      # Add images with transitions and effects
      image_folder = "${imageFolder}"
  
      for i, timing in enumerate(image_timings):
          # Alternate between channels 2 and 3 for base images
          base_channel = 2 if i % 2 == 0 else 3
          # Use channels 4 and 5 for transform effects
          transform_channel = 4 if i % 2 == 0 else 5
  
          try:
              # Add image strip at exact frame positions
              image_name = f"image_{timing['image_number']:02d}.jpg"
              strip_name = f"Image_{timing['image_number']}"
              strip = bpy.context.scene.sequence_editor.sequences.new_image(
                  name=strip_name,
                  filepath=image_folder + image_name,
                  channel=base_channel,
                  frame_start=timing['start']
              )
              # Set the duration using the difference between stop and start frames
              strip.frame_final_duration = timing['stop'] - timing['start']
  
              # Add transform effect with exact frame timing
              add_transform_effect(strip, timing['start'], timing['stop'], transform_channel)
          except Exception as e:
              print(f"Error processing {image_name}: {str(e)}")
  
if __name__ == "__main__":
      main()
  `;
    },
    [data, fps, imageFolder]
  );
  
  

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
