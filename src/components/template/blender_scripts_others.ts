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

def create_text_strip(text: str, channel: int, frame_start: int, frame_end: int, font_size: int, location: tuple[float, float], font_path: str):
    """Create a movie-quality text strip with advanced animations."""
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
    text_strip.color = (1, 1, 1, 1)  # White text
    text_strip.use_bold = True  # Bold text for better visibility
#    text_strip.use_shadow = True
    text_strip.shadow_color = (0, 0, 0, 1)  # Black shadow
    text_strip.shadow_offset = 1  # Shadow offset for depth
    text_strip.use_outline = True
    text_strip.outline_color = (0, 0, 0, 1)  # Black outline
    text_strip.outline_width = 0.05  # Outline thickness

    # Load custom font if provided
    if font_path:
        try:
            text_strip.font = bpy.data.fonts.load(font_path)
        except Exception as e:
            print(f"Error loading font {font_path}: {e}")

    # Fade-in animation
    text_strip.blend_alpha = 0.0
    text_strip.keyframe_insert("blend_alpha", frame=frame_start)
    text_strip.blend_alpha = 1.0
    text_strip.keyframe_insert("blend_alpha", frame=frame_start + 15)

    # Scale-up animation
    text_strip.transform.scale_x = 0.8
    text_strip.transform.scale_y = 0.8
    text_strip.transform.keyframe_insert("scale_x", frame=frame_start)
    text_strip.transform.keyframe_insert("scale_y", frame=frame_start)
    text_strip.transform.scale_x = 1.0
    text_strip.transform.scale_y = 1.0
    text_strip.transform.keyframe_insert("scale_x", frame=frame_end - 35)
    text_strip.transform.keyframe_insert("scale_y", frame=frame_end - 35)

    # Fade-out animation
    text_strip.blend_alpha = 1.0
    text_strip.keyframe_insert("blend_alpha", frame=frame_end - 15)
    text_strip.blend_alpha = 0.0
    text_strip.keyframe_insert("blend_alpha", frame=frame_end)

HEADING_TEXT = "MANIMEKALAI"
SUBHEADING_TEXT = "CHAPTER 5"

# Font paths
PAPYRUS_FONT_PATH = "C:/Windows/Fonts/PAPYRUS.TTF"
ARIAL_BLACK_FONT_PATH = "C:/Windows/Fonts/ARBLI___.TTF"
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