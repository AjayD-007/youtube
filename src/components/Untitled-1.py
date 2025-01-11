

  
import bpy
import random
from mathutils import Vector
from numpy import nan
def clear_sequencer():
      """Clear all strips from the sequencer."""
      if bpy.context.scene.sequence_editor:
          sequences = list(bpy.context.scene.sequence_editor.sequences_all)
          for strip in sequences:
              try:
                  bpy.context.scene.sequence_editor.sequences.remove(strip)
              except RuntimeError as e:
                  print(f"Warning: Unable to remove strip {strip.name} - {e}")
  
def setup_timeline():
      """Initialize the timeline settings."""
      bpy.context.scene.render.fps = 24
      bpy.context.scene.frame_start = 0
      bpy.context.scene.frame_end = nan
  
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
  {
    "start": 0,
    "end": 10.200000000000001,
    "text": " Greetings, noble seekers of ancient tales. Today, we embark on an enchanting journey through",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 15.040000000000001,
    "text": " the timeless verses of Manimegalai, one of the cherished epics of Toma literature, penned",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 20.6,
    "text": " by the illustrious Sithalai Sathinar. In this episode, we delve into the verses from the chapter",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 28.12,
    "text": " Vichavarai Kadai, specifically lines 1-17. These lines transport us to a grand occasion, filled",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 34.6,
    "text": " with celestial blessings, royal grandeur, and the steadfast pursuit of virtue. Let us unravel",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 40.120000000000005,
    "text": " the profound essence hidden within these poetic lines. In the heart of the resplendent city",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 46.52,
    "text": " of Puhar, a place celebrated for its unshakable moral code and enduring fame, preparations",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 52.040000000000006,
    "text": " were underway for a festival unlike any other. The city, with its storied past and noble",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 57.68000000000001,
    "text": " traditions, stood as a beacon of cultural and spiritual excellence. It's grandeur, cherished",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 62.48,
    "text": " by the multitudes, resonated with the vibrant pulse of its people, and the blessings",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 67.76,
    "text": " of the heavens. High in the towering peaks of the Potigah Hills, the venerable sage Agostia",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 73.68,
    "text": " meditated in serene concentration. His wisdom, as unyielding as the mountain itself, was sought",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 79.6,
    "text": " by kings and deities alike. It was he who had once beheld the truths of the cosmos, distilling",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 86,
    "text": " them into teachings that guided generations. Now through divine inspiration, Agostia spoke,",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 90.4,
    "text": " his voice imbued with the resonance of cosmic authority, his words were destined to shape the",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 96.64,
    "text": " lives of mortals and immortals alike. In the celestial realms, Indra, the king of the gods,",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 101.92,
    "text": " watched the mortal world with a discerning gaze. He saw the Chola King, the noble sovereign",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 107.36,
    "text": " known as the Symbian, standing resolute in his commitment to justice and prosperity. This",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 114.32,
    "text": " king, famed for his unyielding valor, had earned the epithet, Tungayil Arinda Thodith Thol Symbian,",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 120,
    "text": " for his heroic deeds in demolishing the impregnable fortresses of his enemies. His shoulders",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 125.52,
    "text": " adorned with victorious scars, bore testimony to his unwavering dedication to his people and his",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 131.35999999999999,
    "text": " realm. As the festivals auspicious day approached, the king adorned in regal splendor,",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 137.12,
    "text": " knelt before the image of Indra. His prayers were earnest, his devotion evident. He besieged",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 142.32,
    "text": " the celestial ruler to bless his endeavor, a grand celebration that would bring together mortals",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 149.04,
    "text": " and gods in harmonious unity. The air buzzed with anticipation as the king declared his intent.",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 154.4,
    "text": " The festivities would last for 28 days, and they would be a testament to the enduring bond",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 160.95999999999998,
    "text": " between the terrestrial and celestial realms. Indra moved by the sincerity of the king's devotion",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 167.44,
    "text": " ascended. The celestial assembly, too, approved, for they recognized in the Kola King a rare virtue,",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 174.16,
    "text": " a ruler who upheld Dharma with unwavering resolve. The divine sanction bestowed an aura of sacredness",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 180.56,
    "text": " upon the event, ensuring its success and longevity. The preparations unfolded with meticulous",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 186.88,
    "text": " precision. Scholars burst in ancient scriptures, philosophers expounding on the paths to liberation,",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 191.68,
    "text": " and adherence of various faiths gathered, each contributing their wisdom to the occasion.",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 196.8,
    "text": " Among them were aesthetics, who had renounced worldly attachments, their insights illuminating",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 202.88000000000002,
    "text": " the transcendental truths of existence. Astrologers, skilled in deciphering the intricate patterns",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 208.08,
    "text": " of the cosmos, charted the festivals auspicious moments, ensuring celestial harmony.",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 214.96,
    "text": " Amid this convergence of minds and spirits, a divine presence manifested. The deities themselves",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 219.52,
    "text": " took forms that mortal eyes could perceive, gracing the city with their luminous presence.",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 225.76000000000002,
    "text": " They concealed their ethereal radiance, adopting appearances that blended seamlessly with the crowd.",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 231.51999999999998,
    "text": " This divine humility symbolized the unity of all beings, a theme central to the festival's purpose.",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 237.12,
    "text": " From far and wide, people flock to Puhar. Their languages, though diverse,",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 242.72,
    "text": " melded into a symphony of joyous celebration. Merchants, poets, warriors, and common folk",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 248.56,
    "text": " mingled, their shared anticipation dissolving the boundaries of cast, creed, and region. The city's",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 254.07999999999998,
    "text": " vibrant streets became a canvas of cultural compliments, a living testament to the Chola King's",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 259.52000000000004,
    "text": " vision of unity in diversity. The five great assemblies of the Chola Court,",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 264.96000000000004,
    "text": " counselors, priests, commanders, envoys, and spies joined hands with the city's administrative",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 270.88,
    "text": " elite, the 80-person council, together they ensured the seamless execution of the event. Their",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 275.6,
    "text": " collective effort reflected the King's governance, rooted in cooperation and wisdom.",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 281.68,
    "text": " As the festival commenced, the air was filled with music and the fragrance of blooming flowers.",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 287.28000000000003,
    "text": " The streets were adorned with vibrant decorations, and the rhythm of drums echo the collective",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 293.84000000000003,
    "text": " heartbeat of the city. Temples, resplendent and their sanctity, became the epicenters of devotion,",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 300.16,
    "text": " their rituals connecting the mortal with the divine. The Chola King, at the heart of this celebration,",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 306.16,
    "text": " embodied the ideals he championed, his regal presence inspired his subjects, while his humility",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 312.56,
    "text": " endeared him to the gods. The festival became a living embodiment of Dharma, a harmonious blend",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 319.04,
    "text": " of spiritual reverence, cultural pride, and communal joy. As we conclude this episode,",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 324.24,
    "text": " let us linger on the image of Puhar in its festive glory, a city that stood as a bridge between",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 329.68,
    "text": " realms, uniting the temporal with the eternal. Stay tuned for the next chapter, where we delve",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 334.32000000000005,
    "text": " deeper into the unfolding narrative, exploring the challenges and revelations that lie ahead.",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 340.56,
    "text": " Don't forget to like, share, and subscribe to our channel to continue this epic journey with us.",
    "stop": null,
    "duration": null
  },
  {
    "start": null,
    "end": 346.15999999999997,
    "text": " Until next time, may the wisdom of the ancients guide your path.",
    "stop": null,
    "duration": null
  }
]
  
      # Add images with transitions and effects
      image_folder = "C:/Users/ASUS/OneDrive/Documents/youtube/downloads/"
      image_strips = []
      transition_frames = 80
  
      for i, timing in enumerate(image_timings):
          base_channel = 2 if i % 2 == 0 else 3
          transform_channel = 4 if i % 2 == 0 else 5
  
          try:
              # Add image strip
              image_name = f"image_{timing['image_number']:02d}.jpg"
              strip_name = f"Image_{timing['image_number']}"
              strip = bpy.context.scene.sequence_editor.sequences.new_image(
                  name=strip_name,
                  filepath=image_folder + image_name,
                  channel=base_channel,
                  frame_start=timing['start']
              )
              strip.frame_final_duration = timing['duration']
  
              # Add transform effect
              add_transform_effect(strip, timing['start'], timing['stop'], transform_channel)
              image_strips.append(strip)
          except Exception as e:
              print(f"Error processing {image_name}: {str(e)}")
  
if __name__ == "__main__":
      main()
