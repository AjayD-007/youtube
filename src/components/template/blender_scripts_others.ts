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

def create_text_strip(text: str, channel: int, frame_start: int, frame_end: int, font_size: int, location: tuple[float, float], font: str):
    """Create a professional text strip with smooth fade animation and slight movement."""
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
    text_strip.use_shadow = True  # Soft shadow for cinematic look
    text_strip.shadow_color = (0, 0, 0, 0.5)

    # Font handling
    font_path = bpy.path.abspath("//fonts/")  # Adjust path as needed
    if font == "Papyrus":
        text_strip.font = font_path + "Papyrus.ttf"
    elif font == "ArialBlack":
        text_strip.font = font_path + "ArialBlack.ttf"

    # Fade in
    text_strip.blend_alpha = 0.0
    text_strip.keyframe_insert("blend_alpha", frame=frame_start)
    text_strip.blend_alpha = 1.0
    text_strip.keyframe_insert("blend_alpha", frame=frame_start + 15)

    # Subtle movement for cinematic effect
    start_y = location[1]
    end_y = location[1] + 0.02  # Slight upward movement

    text_strip.location = (location[0], start_y)
    text_strip.keyframe_insert("location", frame=frame_start)

    text_strip.location = (location[0], end_y)
    text_strip.keyframe_insert("location", frame=frame_end - 20)

    # Fade out
    text_strip.blend_alpha = 1.0
    text_strip.keyframe_insert("blend_alpha", frame=frame_end - 15)
    text_strip.blend_alpha = 0.0
    text_strip.keyframe_insert("blend_alpha", frame=frame_end)

    return text_strip

# Text Definitions
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