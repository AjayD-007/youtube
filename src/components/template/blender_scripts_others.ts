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
def create_text_strip(text: str, channel: int, frame_start: int, frame_end: int, font_size: int, location: tuple[float, float]):
    """Create a text strip with fade animation."""
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
    
    # Fade animation
    text_strip.blend_type = 'ALPHA_OVER'
    
    # Fade in
    text_strip.keyframe_insert("blend_alpha", frame=frame_start)
    text_strip.blend_alpha = 0.0
    text_strip.keyframe_insert("blend_alpha", frame=frame_start + 10)
    text_strip.blend_alpha = 1.0
    
    # Fade out
    text_strip.keyframe_insert("blend_alpha", frame=frame_end - 10)
    text_strip.blend_alpha = 1.0
    text_strip.keyframe_insert("blend_alpha", frame=frame_end)
    text_strip.blend_alpha = 0.0
    
    return text_strip

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