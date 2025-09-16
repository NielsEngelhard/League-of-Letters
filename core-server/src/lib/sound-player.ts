// Names should match {FILE_NAME}.wav
export const soundEffects = ["button-hover", "button-click", "failing", "game-over", "success", "your-turn"] as const;
export type SoundEffect = (typeof soundEffects)[number];

export function PlayBrowserSoundEffect(soundEffect: SoundEffect) {
    try {
        // Play audio from public folder /sound/{name}.wav
        const audio = new Audio(`/sound/${soundEffect}.wav`);
        audio.play().catch(err => {
            console.log('Could not play sound:', err);
        });        
    } catch(err) {
        console.log('Could not play sound:', err);
    }
}