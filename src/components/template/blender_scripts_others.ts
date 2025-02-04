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
def create_cinematic_text(text: str, channel: int, frame_start: int, frame_end: int, font_size: int, location: tuple[float, float], style='heading'):
    """Create text with cinematic-style animations based on text type."""
    text_strip = bpy.context.scene.sequence_editor.sequences.new_effect(
        name=f"Text_{text}",
        type='TEXT',
        channel=channel,
        frame_start=frame_start,
        frame_end=frame_end
    )
    text_strip.text = text
    text_strip.font_size = font_size
    text_strip.location = location
    text_strip.blend_type = 'ALPHA_OVER'
    
    # Set appropriate font
    if style == 'heading':
        text_strip.font = bpy.data.fonts.load("C:\\Windows\\Fonts\\PAPYRUS.TTF")
    else:  # subheading
        text_strip.font = bpy.data.fonts.load("C:\\Windows\\Fonts\\ariblk.ttf")
    
    def add_keyframe_with_easing(strip, data_path, frame, value, interpolation='BEZIER', easing='EASE_OUT'):
        strip.keyframe_insert(data_path=data_path, frame=frame)
        keyframe = strip.animation_data.action.fcurves.find(data_path).keyframe_points[-1]
        keyframe.interpolation = interpolation
        keyframe.easing = easing
    
    # Animation timing
    intro_duration = 25  # Frames for intro animation
    hold_duration = frame_end - frame_start - 50  # Main display duration
    outro_duration = 25  # Frames for outro animation
    
    if style == 'heading':
        # Heading animation: Fade in while scaling up from center
        # Similar to Marvel/Star Wars style title reveals
        
        # Initial state (small and transparent)
        text_strip.blend_alpha = 0.0
        text_strip.scale_start_x = 0.4
        text_strip.scale_start_y = 0.4
        
        # Fade in
        add_keyframe_with_easing(text_strip, "blend_alpha", frame_start, 0.0)
        add_keyframe_with_easing(text_strip, "blend_alpha", frame_start + intro_duration, 1.0)
        
        # Scale up with slight overshoot
        add_keyframe_with_easing(text_strip, "scale_start_x", frame_start, 0.4)
        add_keyframe_with_easing(text_strip, "scale_start_y", frame_start, 0.4)
        add_keyframe_with_easing(text_strip, "scale_start_x", frame_start + intro_duration, 1.05)
        add_keyframe_with_easing(text_strip, "scale_start_y", frame_start + intro_duration, 1.05)
        add_keyframe_with_easing(text_strip, "scale_start_x", frame_start + intro_duration + 5, 1.0)
        add_keyframe_with_easing(text_strip, "scale_start_y", frame_start + intro_duration + 5, 1.0)
        
        # Fade out with scale
        add_keyframe_with_easing(text_strip, "blend_alpha", frame_end - outro_duration, 1.0)
        add_keyframe_with_easing(text_strip, "blend_alpha", frame_end, 0.0)
        add_keyframe_with_easing(text_strip, "scale_start_x", frame_end - outro_duration, 1.0)
        add_keyframe_with_easing(text_strip, "scale_start_y", frame_end - outro_duration, 1.0)
        add_keyframe_with_easing(text_strip, "scale_start_x", frame_end, 1.2)
        add_keyframe_with_easing(text_strip, "scale_start_y", frame_end, 1.2)
        
    else:
        # Subheading animation: Slide in from bottom with fade
        # Similar to traditional movie subtitle/credit style
        
        # Initial state (below screen and transparent)
        text_strip.blend_alpha = 0.0
        text_strip.translate_start_y = -0.3
        
        # Fade in while sliding up
        add_keyframe_with_easing(text_strip, "blend_alpha", frame_start, 0.0)
        add_keyframe_with_easing(text_strip, "blend_alpha", frame_start + intro_duration, 1.0)
        add_keyframe_with_easing(text_strip, "translate_start_y", frame_start, -0.3)
        add_keyframe_with_easing(text_strip, "translate_start_y", frame_start + intro_duration, 0.0)
        
        # Fade out while sliding up
        add_keyframe_with_easing(text_strip, "blend_alpha", frame_end - outro_duration, 1.0)
        add_keyframe_with_easing(text_strip, "blend_alpha", frame_end, 0.0)
        add_keyframe_with_easing(text_strip, "translate_start_y", frame_end - outro_duration, 0.0)
        add_keyframe_with_easing(text_strip, "translate_start_y", frame_end, 0.2)
    
    return text_strip

def create_text_strip(text: str, channel: int, frame_start: int, frame_end: int, font_size: int, location: tuple[float, float]):
    """Wrapper function to maintain compatibility with existing code."""
    style = 'heading' if font_size > 100 else 'subheading'
    return create_cinematic_text(text, channel, frame_start, frame_end, font_size, location, style)

HEADING_TEXT = ${JSON.stringify(heading)}
SUBHEADING_TEXT = ${JSON.stringify(subheading)}
`;

export const INTRO_OUTRO_FUNCTIONS = (introVideoPath: string,data:ImageTiming[]) => `
def add_intro_outro():
    """Add intro/outro video and audio elements."""
    # Intro video (channel 2) with audio (channel 5)
    intro_video = add_video_strip(
        filepath="${introVideoPath}",
        channel=2,
        frame_start=1
    )
    
    
    # Duplicate intro video at end
    end_video = add_video_strip(
        filepath="${introVideoPath}",
        channel=2,
        frame_start=${data[data.length-1].stop}
    )
`;