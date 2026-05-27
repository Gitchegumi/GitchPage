# Voice Over Card + Page Rework Plan

## 1. Homepage Voice Over Card (`src/app/(home)/page.tsx`)

### Replaced `VoiceContent` — now stateful:
- **State**: `selectedDemo` (0 or 1), `isPlaying`, `isMuted`, `progress`, `duration`, `currentTime`
- **Data**: real demos from `/public/demos/`:
  - Commercial Demo → `GITCHEGUMI-MEDIA_COMMERICAL-DEMO.mp3`
  - E-Learning Demo → `GITCHEGUMI-MEDIA_ELEARNING-DEMO.mp3`
- **Featured player** (left column):
  - Real `<audio>` element managed via ref
  - Big play/pause button (Golden) + mute/unmute toggle
  - Live progress bar (updates from `timeupdate` event)
  - Waveform animation synced to `isPlaying`
  - Demo title + description updates when a card is clicked
- **Demo cards** (right column):
  - Show actual demo name + short description
  - Click → loads into featured player + auto-plays
  - Download button per card (link to the .mp3)
- **CTA**: professional hiring text (e.g., "Hire me →" or "Start a project →")

### Replaced `MobileVoice` — same functionality, mobile layout:
- Featured player with real audio controls
- Demo list with download + tap-to-play
- Professional CTA

### CSS additions (`home.css`):
- `.muteBtn` — small toggle button next to play
- `.downloadBtn` — icon button on demo cards
- `.demoCard` hover state for selection
- `.demoCard.active` — highlighted when loaded

## 2. Voice Over Page (`src/app/(site)/voice-over/page.tsx`)

### Layout change — form above the fold:
- Move `VoInquiryForm` to top of page, right of intro text
- OR top-full-width if that feels cramped
- Keep the two `AudioPlayer` demos below
- Keep "Why Choose Me" section below demos

### Approach:
- Use a 2-column grid at top: intro text (left) + form (right)
- On mobile, stack: form first, then intro

## 3. PR review comment: pull before push (already fixed in memory)
