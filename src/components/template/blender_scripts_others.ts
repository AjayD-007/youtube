import { ImageTiming } from "../blender_script";

// New template sections to add
export const AUDIO_FUNCTIONS = `
def add_audio_strip(filepath: str, channel: int, frame_start: int):
    """Add an audio strip to the sequencer."""
    return bpy.context.scene.sequence_editor.sequences.new_sound(
        name="Audio",
        filepath=filepath,
        channel=channel,
        frame_start=frame_start
    )

def add_video_strip(filepath: str, channel: int, frame_start: int):
    """Add a video strip with audio."""
    return bpy.context.scene.sequence_editor.sequences.new_movie(
        name="Video",
        filepath=filepath,
        channel=channel,
        frame_start=frame_start
    )
`;

export const TEXT_TEMPLATES = (heading: string, subheading: string) => `
def ease_out_expo(t):
    """Exponential easing for smooth fade."""
    return 1 - pow(2, -10 * t) if t > 0 else 0

def create_text_strip(
    text: str,
    channel: int,
    frame_start: int,
    frame_end: int,
    font_size: int,
    location: tuple[float, float],
    font_path: str,
    fade_in_duration: int = 15,
    fade_out_duration: int = 15,
    scale_animation_duration: int = 35,
    initial_scale: float = 0.8,
    final_scale: float = 1.0
):
    """
    Create a movie-quality text strip with animations using available VSE attributes.
    
    Parameters:
        fade_in_duration: Number of frames for fade in
        fade_out_duration: Number of frames for fade out
        scale_animation_duration: Number of frames for scale animation
        initial_scale: Starting scale value
        final_scale: Ending scale value
    """
    # Ensure minimum duration for animations
    total_duration = frame_end - frame_start
    min_duration = max(fade_in_duration + fade_out_duration + scale_animation_duration, 45)
    if total_duration < min_duration:
        frame_end = frame_start + min_duration
    
    # Create text strip
    text_strip = bpy.context.scene.sequence_editor.sequences.new_effect(
        name=f"Text_{text}",
        type='TEXT',
        channel=channel,
        frame_start=frame_start,
        frame_end=frame_end
    )
    
    # Basic text properties
    text_strip.text = text
    text_strip.font_size = font_size
    text_strip.location = location
    text_strip.color = (1, 1, 1, 1)
    text_strip.use_bold = True
    
    # Enhanced text effects
    text_strip.use_shadow = True
    text_strip.shadow_color = (0, 0, 0, 0.8)
    text_strip.shadow_offset = 2
    
    text_strip.use_outline = True
    text_strip.outline_color = (0, 0, 0, 1)
    text_strip.outline_width = 0.08
    
    # Load custom font
    if font_path:
        try:
            text_strip.font = bpy.data.fonts.load(font_path)
        except Exception as e:
            print(f"Error loading font {font_path}: {e}")
    
    # Create transform strip for scale animation
    transform = bpy.context.scene.sequence_editor.sequences.new_effect(
        name=f"Transform_{text}",
        type='TRANSFORM',
        channel=channel + 1,
        frame_start=frame_start,
        frame_end=frame_end,
        seq1=text_strip
    )
    
    # Initial scale
    transform.scale_start_x = initial_scale
    transform.scale_start_y = initial_scale
    
    # Create scale keyframes using available properties
    bpy.context.scene.frame_set(frame_start)
    transform.scale_start_x = initial_scale
    transform.scale_start_y = initial_scale
    transform.keyframe_insert(data_path="scale_start_x", frame=frame_start)
    transform.keyframe_insert(data_path="scale_start_y", frame=frame_start)
    
    scale_end_frame = frame_end - scale_animation_duration
    bpy.context.scene.frame_set(scale_end_frame)
    transform.scale_start_x = final_scale
    transform.scale_start_y = final_scale
    transform.keyframe_insert(data_path="scale_start_x", frame=scale_end_frame)
    transform.keyframe_insert(data_path="scale_start_y", frame=scale_end_frame)
    
    # Fade animations using blend_alpha
    bpy.context.scene.frame_set(frame_start)
    text_strip.blend_alpha = 0.0
    text_strip.keyframe_insert(data_path="blend_alpha", frame=frame_start)
    
    bpy.context.scene.frame_set(frame_start + fade_in_duration)
    text_strip.blend_alpha = 1.0
    text_strip.keyframe_insert(data_path="blend_alpha", frame=frame_start + fade_in_duration)
    
    bpy.context.scene.frame_set(frame_end - fade_out_duration)
    text_strip.blend_alpha = 1.0
    text_strip.keyframe_insert(data_path="blend_alpha", frame=frame_end - fade_out_duration)
    
    bpy.context.scene.frame_set(frame_end)
    text_strip.blend_alpha = 0.0
    text_strip.keyframe_insert(data_path="blend_alpha", frame=frame_end)
    
    # Make strips easily selectable in VSE
    text_strip.select = True
    text_strip.select_left_handle = True
    text_strip.select_right_handle = True
    transform.select = True
    transform.select_left_handle = True
    transform.select_right_handle = True
    
    # Set interpolation mode for transform strip
    transform.interpolation = 'BICUBIC'
    
    return text_strip, transform
`;

export const INTRO_OUTRO_FUNCTIONS = (introVideoPath: string,data:ImageTiming[]) => `
def add_intro_outro():
    """Add intro/outro video and audio elements."""
    # Intro video (channel 2) with audio (channel 5)
    
    # Duplicate intro video at end
    end_video = add_video_strip(
        filepath="${introVideoPath}",
        channel=2,
        frame_start=${data[data.length-1].stop}
    )
`;