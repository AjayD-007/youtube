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
    """Add enhanced Ken Burns style transform effect to an image strip."""
    transform = bpy.context.scene.sequence_editor.sequences.new_effect(
        name=f"Transform_{strip.name}",
        type='TRANSFORM',
        channel=channel,
        frame_start=start_frame,
        frame_end=end_frame,
        seq1=strip
    )

    # Enhanced random parameters for more dynamic movement
    scale_start = random.uniform(1.3, 1.8)  # Increased zoom range
    scale_end = random.uniform(1.1, 1.4)    # Ensure we don't zoom out too much
    
    # Increased movement range for more noticeable panning
    pos_start_x = random.uniform(-0.6, 0.6)
    pos_start_y = random.uniform(-0.6, 0.6)
    pos_end_x = random.uniform(-0.6, 0.6)
    pos_end_y = random.uniform(-0.6, 0.6)

    # Ensure minimum movement distance for more dynamic feel
    min_movement = 0.3
    while abs(pos_end_x - pos_start_x) < min_movement and abs(pos_end_y - pos_start_y) < min_movement:
        pos_end_x = random.uniform(-0.6, 0.6)
        pos_end_y = random.uniform(-0.6, 0.6)

    # Set initial transform properties
    bpy.context.scene.frame_set(start_frame)
    transform.scale_start_x = scale_start
    transform.scale_start_y = scale_start
    transform.translate_start_x = pos_start_x
    transform.translate_start_y = pos_start_y
    
    # Insert initial keyframes
    transform.keyframe_insert(data_path='scale_start_x', frame=start_frame)
    transform.keyframe_insert(data_path='scale_start_y', frame=start_frame)
    transform.keyframe_insert(data_path='translate_start_x', frame=start_frame)
    transform.keyframe_insert(data_path='translate_start_y', frame=start_frame)

    # Set ending transform properties
    bpy.context.scene.frame_set(end_frame)
    transform.scale_start_x = scale_end
    transform.scale_start_y = scale_end
    transform.translate_start_x = pos_end_x
    transform.translate_start_y = pos_end_y
    
    # Insert ending keyframes
    transform.keyframe_insert(data_path='scale_start_x', frame=end_frame)
    transform.keyframe_insert(data_path='scale_start_y', frame=end_frame)
    transform.keyframe_insert(data_path='translate_start_x', frame=end_frame)
    transform.keyframe_insert(data_path='translate_start_y', frame=end_frame)

    # Set interpolation type
    transform.interpolation = 'BEZIER'

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
    # Image processing
    image_folder = "${imageFolder.replace(/\\/g, '\\\\')}"
    image_timings = ${JSON.stringify(data, null, 2).replace(/"/g, "'")}
    # Add text elements with proper timing
    heading_text, heading_transform = create_text_strip(
        text=HEADING_TEXT,
        channel=4,
        frame_start=1,
        frame_end=image_timings[0]['start'] + 10,
        font_size=158,
        location=(0.5, 0.7),
        font_path=PAPYRUS_FONT_PATH,
        fade_in_duration=15,
        fade_out_duration=10,
        scale_animation_duration=25
    )
    
    subheading_text, subheading_transform = create_text_strip(
        text=SUBHEADING_TEXT,
        channel=6,
        frame_start=1,
        frame_end=image_timings[0]['start'] + 15,
        font_size=80,
        location=(0.5, 0.6),
        font_path=ARIAL_BLACK_FONT_PATH,
        fade_in_duration=20,
        fade_out_duration=15,
        scale_animation_duration=30,
        initial_scale=0.7,
        final_scale=1.1
    )
    
    # Add intro/outro videos
    add_intro_outro()
    
    

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
    main()`;