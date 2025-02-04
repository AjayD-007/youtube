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
def ease_in_out_cubic(t):
    """Cubic easing function for smoother animations."""
    if t < 0.5:
        return 4 * t * t * t
    else:
        return 1 - pow(-2 * t + 2, 3) / 2

def oscillate(t, frequency=2, amplitude=0.1):
    """Create a smooth oscillating value using sine waves."""
    return amplitude * math.sin(2 * math.pi * frequency * t)

def spring_motion(t, tension=3, dampening=0.7):
    """Create spring-like motion with dampening."""
    return math.exp(-dampening * t) * math.cos(tension * t)

def generate_transform_keyframes(transform, start_frame, end_frame, style='dynamic'):
    """Generate keyframes for transform effect based on style."""
    duration = end_frame - start_frame
    
    for frame in range(start_frame, end_frame + 1):
        t = (frame - start_frame) / duration
        eased_t = ease_in_out_cubic(t)
        
        # Base progress for interpolation
        if style == 'spring':
            progress = 1 + spring_motion(t)
        elif style == 'wave':
            progress = 1 + oscillate(t)
        else:  # dynamic
            progress = eased_t
        
        # Calculate current values
        current_scale = transform.scale_start_x + (transform.scale_end - transform.scale_start_x) * progress
        current_x = transform.pos_start_x + (transform.pos_end_x - transform.pos_start_x) * progress
        current_y = transform.pos_start_y + (transform.pos_end_y - transform.pos_start_y) * progress
        
        # Add subtle oscillation to rotation
        if style != 'simple':
            current_rotation = oscillate(t, frequency=1, amplitude=0.02)
        else:
            current_rotation = 0
            
        # Apply keyframes
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
    """Add dynamic transform effects to an image strip."""
    transform = bpy.context.scene.sequence_editor.sequences.new_effect(
        name=f"Transform_{strip.name}",
        type='TRANSFORM',
        channel=channel,
        frame_start=start_frame,
        frame_end=end_frame,
        seq1=strip
    )
    
    # Animation style selection
    styles = ['dynamic', 'spring', 'wave', 'simple']
    selected_style = random.choice(styles)
    
    # Base parameters
    transform.scale_start_x = random.uniform(1.0, 1.3)
    transform.scale_end = random.uniform(1.1, 1.5)
    transform.pos_start_x = random.uniform(-0.2, 0.2)
    transform.pos_start_y = random.uniform(-0.2, 0.2)
    transform.pos_end_x = random.uniform(-0.15, 0.15)
    transform.pos_end_y = random.uniform(-0.15, 0.15)
    
    # Style-specific adjustments
    if selected_style == 'spring':
        # More dramatic scale changes for spring motion
        transform.scale_start_x *= 1.1
        transform.scale_end *= 0.9
    elif selected_style == 'wave':
        # Wider movement range for wave motion
        transform.pos_start_x *= 1.2
        transform.pos_start_y *= 1.2
    
    # Generate keyframes based on selected style
    generate_transform_keyframes(transform, start_frame, end_frame, selected_style)
    
    # Add motion blur for smoother animation
    transform.use_motion_blur = True
    transform.motion_blur_samples = 8
    
    return transform

def add_transition_effect(strip1, strip2, overlap_frames=20):
    """Add transition effect between two strips."""
    transition = bpy.context.scene.sequence_editor.sequences.new_effect(
        name=f"Transition_{strip1.name}_{strip2.name}",
        type='CROSS',
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