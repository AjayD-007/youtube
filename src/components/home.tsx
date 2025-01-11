import React, { useState } from 'react';
import { Download, Copy, CheckCircle2 } from 'lucide-react';

const BlenderExporter = ({ calculations }:any) => {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState('python');
  
  // Generate Python script for Blender with proper escaping
  const generatePythonScript = () => {
    // Escape special characters in text content
    const escapedTimings = calculations.imageTimings.map((timing:any) => ({
      ...timing,
      text: timing.text.replace(/"/g, '\\"').replace(/'/g, "\\'")
    }));

    // Force minimum overlap of 40 frames
    const minOverlap = 40;
    const transitionFrames = Math.max(calculations.transitionFrames, minOverlap * 2);
    const transitionHalfFrames = Math.floor(transitionFrames / 2);

    return `"""
Blender Python script to set up video timeline with images, transitions, and Ken Burns effects.
Generated from Whisper timing data.
"""

import bpy
import random
from mathutils import Vector

def clear_sequencer():
    """Clear all strips from the sequencer."""
    if bpy.context.scene.sequence_editor:
        # Copy the sequence list to avoid modifying the collection while iterating
        sequences = list(bpy.context.scene.sequence_editor.sequences_all)
        for strip in sequences:
            try:
                bpy.context.scene.sequence_editor.sequences.remove(strip)
            except RuntimeError as e:
                print(f"Warning: Unable to remove strip {strip.name} - {e}")


def setup_timeline():
    """Initialize the timeline settings."""
    bpy.context.scene.render.fps = ${calculations.fps}
    bpy.context.scene.frame_start = 0
    bpy.context.scene.frame_end = ${calculations.totalFrames}

def add_transform_effect(strip, start_frame, end_frame, channel):
    """Add random Ken Burns style transform effect to an image strip."""
    transform = bpy.context.scene.sequence_editor.sequences.new_effect(
        name=f"Transform_{strip.name}",
        type='TRANSFORM',
        channel=channel,  # Using specified transform channel
        frame_start=start_frame,
        frame_end=end_frame,
        seq1=strip
    )
    
    # Random starting and ending positions/scales for Ken Burns effect
    scale_start = random.uniform(1.0, 1.2)
    scale_end = random.uniform(1.0, 1.2)
    pos_start_x = random.uniform(-0.1, 0.1)
    pos_start_y = random.uniform(-0.1, 0.1)
    pos_end_x = random.uniform(-0.1, 0.1)
    pos_end_y = random.uniform(-0.1, 0.1)
    
    # Set initial keyframes
    transform.scale_start_x = scale_start
    transform.scale_start_y = scale_start
    transform.translate_start_x = pos_start_x
    transform.translate_start_y = pos_start_y
    transform.keyframe_insert(data_path="scale_start_x", frame=start_frame)
    transform.keyframe_insert(data_path="scale_start_y", frame=start_frame)
    transform.keyframe_insert(data_path="translate_start_x", frame=start_frame)
    transform.keyframe_insert(data_path="translate_start_y", frame=start_frame)
    
    # Set ending keyframes
    transform.scale_start_x = scale_end
    transform.scale_start_y = scale_end
    transform.translate_start_x = pos_end_x
    transform.translate_start_y = pos_end_y
    transform.keyframe_insert(data_path="scale_start_x", frame=end_frame)
    transform.keyframe_insert(data_path="scale_start_y", frame=end_frame)
    transform.keyframe_insert(data_path="translate_start_x", frame=end_frame)
    transform.keyframe_insert(data_path="translate_start_y", frame=end_frame)
    
    # Add easing
    for fcurve in transform.animation_data.action.fcurves:
        for keyframe in fcurve.keyframe_points:
            keyframe.interpolation = 'SINE'
            keyframe.easing = 'EASE_IN_OUT'
    
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
    image_timings = [
${escapedTimings.map((timing:any) => `        {
            "start": ${timing.startFrame},
            "end": ${timing.endFrame},
            "duration": ${timing.endFrame - timing.startFrame},
            "image_number": ${timing.imageNumber},
            "text": "${timing.text}"  # Reference for image content
        }`).join(',\n')}
    ]
    
    # Add images with transitions and effects
    image_folder = "C:/Users/ASUS/OneDrive/Documents/youtube/downloads/"
    image_strips = []
    transition_frames = ${transitionFrames}
    overlap = ${transitionHalfFrames}  # Overlap for transitions
    
    for i, timing in enumerate(image_timings):
        # Calculate the base channel (alternating between 2 and 3)
        base_channel = 2 if i % 2 == 0 else 3
        transform_channel = 5 if i % 2 == 0 else 6
        
        # Adjust start and end frames to account for transitions
        adjusted_start = timing['start'] - overlap
        adjusted_end = timing['end'] + overlap
        
        # Create image strip
        image_name = f"image_{timing['image_number']:02d}.jpg"
        strip_name = f"Image_{timing['image_number']}"
        
        try:
            # Add image strip
            strip = bpy.context.scene.sequence_editor.sequences.new_image(
                name=strip_name,
                filepath=image_folder + image_name,
                channel=base_channel,
                frame_start=adjusted_start
            )
            strip.frame_final_duration = timing['end'] - timing['start'] + (2 * overlap)
            
            # Add transform effect for Ken Burns
            add_transform_effect(strip, adjusted_start, adjusted_end, transform_channel)
            
            image_strips.append(strip)
            
            # Add cross transition with previous strip if not first strip
            if len(image_strips) > 1:
                previous_strip = image_strips[-2]
                transition_start = timing['start'] - overlap
                
                bpy.context.scene.sequence_editor.sequences.new_effect(
                    name=f"Transition_{timing['image_number']}",
                    type='CROSS',
                    channel=4,  # Place transitions in channel 4
                    frame_start=transition_start,
                    frame_end=transition_start + transition_frames,
                    seq1=previous_strip,
                    seq2=strip
                )
        except Exception as e:
            print(f"Error processing {image_name}: {str(e)}")
    
    # Adjust opacity for smoother transitions
    for strip in image_strips:
        strip.blend_type = 'ALPHA_OVER'
        strip.blend_alpha = 1.0

if __name__ == "__main__":
    main()
`;
  };

  // Rest of the component remains unchanged...
  const generateCSV = () => {
    const headers = "Image Number,Start Frame,End Frame,Duration Frames,Text\n";
    const rows = calculations.imageTimings.map((timing:any) => {
      const escapedText = timing.text.replace(/"/g, '""');
      return `${timing.imageNumber},${timing.startFrame},${timing.endFrame},${timing.endFrame - timing.startFrame},"${escapedText}"`;
    }).join('\n');
    return headers + rows;
  };

  const handleCopy = (content:any) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = (content:any, fileType:any) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileType === 'python' ? 'blender_import.py' : 'image_timings.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const content = exportFormat === 'python' ? generatePythonScript() : generateCSV();

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Export for Blender</h2>
        <select 
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="python">Python Script</option>
          <option value="csv">CSV File</option>
        </select>
      </div>

      <div className="relative">
        <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
          {content}
        </pre>
        
        <div className="absolute top-2 right-2 space-x-2">
          <button
            onClick={() => handleCopy(content)}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-1"
          >
            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={() => handleDownload(content, exportFormat)}
            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center gap-1"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Usage Instructions:</h3>
        {exportFormat === 'python' ? (
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Download or copy the Python script</li>
            <li>Create a folder named "images" in your Blender project directory</li>
            <li>Name your images as "image_01.jpg", "image_02.jpg", etc.</li>
            <li>In Blender, go to Scripting workspace</li>
            <li>Create a new text file and paste the script</li>
            <li>Click "Run Script" to automatically set up your timeline</li>
            <li>Each image will have a Ken Burns effect and smooth transitions</li>
          </ol>
        ) : (
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Download the CSV file</li>
            <li>Use it as a reference for manually placing images</li>
            <li>Each row contains exact frame numbers for an image</li>
            <li>Text column shows what content should match each image</li>
          </ol>
        )}
      </div>
    </div>
  );
};

export default BlenderExporter;