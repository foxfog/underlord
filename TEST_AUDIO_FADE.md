# Test Background Music Fade Functionality

## Feature Implementation
✅ **Completed**: Background music now fades when test audio plays in audio settings
✅ **Completed**: Test audio timer resets to beginning when stopped in settings

## How it works:
1. **When test audio starts**: Background music fades out smoothly over 0.5 seconds and stops
2. **When test audio ends**: Background music resumes with smooth fade-in back to original volume over 0.5 seconds
3. **When test audio stops**: Timer automatically resets to 0:00 for next playback

## Components Modified:
- **settings.js**: Added `isTestAudioPlaying` state and `setTestAudioPlaying()` action
- **BgMusic.vue**: Added watchers and fade functions for test audio handling
- **UiPlayerAudio.vue**: 
  - Added notifications when test audio starts/stops
  - Added `resetOnStop` prop for timer reset functionality
  - Timer resets when audio is paused or ends naturally
- **SettingsAudio.vue**: Added `resetOnStop="true"` to all test audio players

## Testing Steps:
1. Start the application (`npm run dev`)
2. Navigate to Settings → Audio
3. Play any test audio using the play buttons next to volume sliders
4. Observe background music fading out smoothly when test audio starts
5. **Stop the test audio before it ends** - observe timer resets to 0:00
6. **Let test audio play until the end** - observe timer resets to 0:00
7. Observe background music fading back in when test audio ends

## Technical Details:
- **Fade timing**: Exactly 0.5 seconds as requested
- **Fade steps**: 20 steps at 25ms intervals (20 × 25ms = 500ms)
- **Volume control**: Only affects background music volume, not test audio
- **State management**: Uses Pinia store for communication between components
- **Background music behavior**: Pauses during test audio, resumes with fade-in after
- **Timer reset**: Configurable via `resetOnStop` prop, enabled for settings audio players

## Code Features:
- ✅ Smooth 0.5-second fade-out when test audio starts
- ✅ Background music stops during test audio playback  
- ✅ Smooth 0.5-second fade-in when test audio ends
- ✅ Returns to original musicVolume setting
- ✅ Works with all test audio types (music, sound, voice, common)
- ✅ Prevents conflicts with existing fade functionality
- ✅ **Timer resets to 0:00 when stopping test audio in settings**
- ✅ **Configurable timer reset via `resetOnStop` prop for reuse in other components**
- ✅ **Timer resets both on manual stop and natural audio end**

## Usage in Other Components:
```vue
<!-- For audio that should reset timer when stopped -->
<UiPlayerAudio :src="audioFile" :resetOnStop="true" />

<!-- For audio that should NOT reset timer (default behavior) -->
<UiPlayerAudio :src="audioFile" :resetOnStop="false" />
<!-- or simply -->
<UiPlayerAudio :src="audioFile" />
```