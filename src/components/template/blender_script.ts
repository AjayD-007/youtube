import { ImageTiming } from "../blender_script";

// blender-script-templates.ts
export const BASE_IMPORTS = `
import bpy
import random
import math
from mathutils import Euler
from mathutils import Vector
`;

export const CLEAR_SEQUENCER = `
def clear_sequencer():
    """Clear all strips from the sequencer."""
    if bpy.context.scene.sequence_editor:
        sequences = list(bpy.context.scene.sequence_editor.sequences_all)
        for strip in sequences:
            try:
                bpy.context.scene.sequence_editor.sequences.remove(strip)
            except RuntimeError as e:
                print(f"Warning: Unable to remove strip {strip.name} - {e}")
`;

export const TIMELINE_SETUP = (fps: number, startFrame: number, endFrame: number) => `
def setup_timeline():
    """Initialize the timeline settings."""
    bpy.context.scene.render.fps = ${fps}
    bpy.context.scene.frame_start = ${startFrame}
    bpy.context.scene.frame_end = ${endFrame}
`;

export const TRANSFORM_EFFECT = `
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
    scale_start = random.uniform(1.2, 1.6)
    scale_end = random.uniform(1.0, 1.6)
    pos_start_x = random.uniform(-0.3, 0.3)
    pos_start_y = random.uniform(-0.3, 0.3)
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
`;

export const MAIN_FUNCTION = (data: ImageTiming[], imageFolder: string) => `
def main():
    # Clear existing strips
    clear_sequencer()
    
    # Set up timeline
    setup_timeline()
    
    # Create sequence editor
    if not bpy.context.scene.sequence_editor:
        bpy.context.scene.sequence_editor_create()

    # Add audio elements
    add_audio_strip("C:/Users/ASUS/OneDrive/Documents/youtube/whisper-transcription/story.wav", 1, 1)  # Channel 1
    add_audio_strip("C:/Users/ASUS/OneDrive/Documents/youtube/downloads/music.mp3", 8, 1)  # Channel 8
    HEADING_TEXT = "MANIMEKALAI"
    SUBHEADING_TEXT = "CHAPTER 5"

    # Font paths
    PAPYRUS_FONT_PATH = "C:/Windows/Fonts/PAPYRUS.TTF"
    ARIAL_BLACK_FONT_PATH = "C:/Windows/Fonts/ARBLI___.TTF"
    # Add text elements
    create_text_strip(
        text=HEADING_TEXT,
        channel=4,
        frame_start=1,
        frame_end=${data[0]?.start + 10 || 30},  # Overlap first image
        font_size=158,
        location=(0.5, 0.7),font_path=PAPYRUS_FONT_PATH
    )
    
    create_text_strip(
        text=SUBHEADING_TEXT,
        channel=6,
        frame_start=1,
        frame_end=${data[0]?.start + 15 || 35},
        font_size=80,
        location=(0.5, 0.6),font_path=ARIAL_BLACK_FONT_PATH
    )
    
    # Add intro/outro videos
    add_intro_outro()
    
    # Original image processing
    image_folder = "${imageFolder.replace(/\\/g, '\\\\')}"
    image_timings = ${JSON.stringify(data, null, 2).replace(/"/g, "'")}

    for i, timing in enumerate(image_timings):
        base_channel = 3 if i % 2 == 0 else 4
        transform_channel = 5 if i % 2 == 0 else 6
        
        try:
            image_name = f"image_{timing['image_number']:02d}.jpg"
            strip_name = f"Image_{timing['image_number']}"
            strip = bpy.context.scene.sequence_editor.sequences.new_image(
                name=strip_name,
                filepath=image_folder + image_name,
                channel=base_channel,
                frame_start=timing['start']
            )
            strip.frame_final_duration = timing['stop'] - timing['start']
            add_transform_effect(strip, timing['start'], timing['stop'], transform_channel)
        except Exception as e:
            print(f"Error processing {image_name}: {str(e)}")

if __name__ == "__main__":
    main()
`;