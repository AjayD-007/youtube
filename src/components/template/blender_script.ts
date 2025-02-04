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
def ease_out_expo(t):
    """Exponential easing out for more dramatic endings."""
    return 1 - pow(2, -10 * t) if t > 0 else 0

def perlin_motion(t, scale=0.5):
    """Uses Perlin noise for more natural, unpredictable motion."""
    return scale * noise.pnoise1(t * 3, repeat=1024)

def generate_transform_keyframes(transform, start_frame, end_frame, style='organic'):
    """Generate keyframes for a dynamic transform effect."""
    duration = end_frame - start_frame

    for frame in range(start_frame, end_frame + 1):
        t = (frame - start_frame) / duration
        eased_t = ease_out_expo(t)

        # Add layered effects
        if style == 'organic':
            progress = eased_t + perlin_motion(t, scale=0.1)
        elif style == 'chaotic':
            progress = eased_t + perlin_motion(t, scale=0.2) * random.uniform(0.8, 1.2)
        else:  # Default to smoother animation
            progress = eased_t

        # Compute dynamic values
        current_scale = transform.scale_start_x + (transform.scale_end - transform.scale_start_x) * progress
        current_x = transform.pos_start_x + (transform.pos_end_x - transform.pos_start_x) * progress
        current_y = transform.pos_start_y + (transform.pos_end_y - transform.pos_start_y) * progress
        current_rotation = perlin_motion(t, scale=0.05) * 15  # Subtle rotation variation

        # Apply transformations
        transform.scale_start_x = current_scale
        transform.scale_start_y = current_scale
        transform.translate_start_x = current_x
        transform.translate_start_y = current_y
        transform.rotation_start = current_rotation

        # Insert keyframes
        transform.keyframe_insert('scale_start_x', frame=frame)
        transform.keyframe_insert('scale_start_y', frame=frame)
        transform.keyframe_insert('translate_start_x', frame=frame)
        transform.keyframe_insert('translate_start_y', frame=frame)
        transform.keyframe_insert('rotation_start', frame=frame)

def add_transform_effect(strip, start_frame, end_frame, channel):
    """Apply dynamic transform effects to an image strip."""
    transform = bpy.context.scene.sequence_editor.sequences.new_effect(
        name=f"Transform_{strip.name}",
        type='TRANSFORM',
        channel=channel,
        frame_start=start_frame,
        frame_end=end_frame,
        seq1=strip
    )

    # Randomly select a movement style
    styles = ['organic', 'chaotic', 'smooth']
    selected_style = random.choice(styles)

    # Set base transformation parameters
    transform.scale_start_x = random.uniform(1.0, 1.2)
    transform.scale_end = random.uniform(1.1, 1.4)
    transform.pos_start_x = random.uniform(-0.3, 0.3)
    transform.pos_start_y = random.uniform(-0.3, 0.3)
    transform.pos_end_x = random.uniform(-0.25, 0.25)
    transform.pos_end_y = random.uniform(-0.25, 0.25)

    # Style-based modifications
    if selected_style == 'chaotic':
        transform.scale_start_x *= 1.1
        transform.scale_end *= 1.05
    elif selected_style == 'organic':
        transform.pos_start_x *= 1.5
        transform.pos_start_y *= 1.5

    # Generate keyframes
    generate_transform_keyframes(transform, start_frame, end_frame, selected_style)

    # Enable motion blur for smoother transitions
    transform.use_motion_blur = True
    transform.motion_blur_samples = 12

    return transform

def add_transition_effect(strip1, strip2, overlap_frames=25):
    """Create a more advanced transition effect between two strips."""
    transition = bpy.context.scene.sequence_editor.sequences.new_effect(
        name=f"Transition_{strip1.name}_{strip2.name}",
        type='GAMMA_CROSS',
        channel=max(strip1.channel, strip2.channel) + 1,
        frame_start=strip2.frame_start - overlap_frames,
        frame_end=strip2.frame_start + overlap_frames,
        seq1=strip1,
        seq2=strip2
    )

    return transition
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
    
    # Add text elements
    create_text_strip(
        text=HEADING_TEXT,
        channel=4,
        frame_start=1,
        frame_end=${data[0]?.start + 10 || 30},  # Overlap first image
        font_size=158,
        location=(0.5, 0.7)
    )
    
    create_text_strip(
        text=SUBHEADING_TEXT,
        channel=6,
        frame_start=1,
        frame_end=${data[0]?.start + 15 || 35},
        font_size=80,
        location=(0.5, 0.6)
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