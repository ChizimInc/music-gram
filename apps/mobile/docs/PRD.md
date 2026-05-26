# Spotify Clone — PRD

## Overview
A music streaming app for mobile (iOS/Android) built with React Native + Expo.
Target users: music listeners who want a familiar Spotify-like experience.

## Tech Stack (Client)
- React Native / Expo (TypeScript)
- Firebase Auth (email/password + Google Sign-In)
- expo-av (audio playback)
- REST API: NestJS backend (hosted separately)

## Tech Stack (Backend — see backend repo)
- NestJS (TypeScript)
- PostgreSQL + TypeORM (or Prisma)
- Firebase Admin SDK (token verification)

## Core Features
### v1 (MVP)
- [ ] User registration and login (email + Google)
- [ ] Browse songs and albums on Home screen
- [ ] Search songs by title or artist
- [ ] Play/pause/seek audio with a persistent mini-player
- [ ] Create and manage personal playlists

### v2 (Later)
- [ ] Social features (follow users, share playlists, chating with friends, share songs)
- [ ] Offline downloads
- [ ] Lyrics display

## Out of Scope
- Actual music licensing (use royalty-free tracks from Firestore)
- Real payments or subscriptions

## Acceptance Criteria
- App runs on Android and iOS emulators
- Auth persists between sessions
- Audio continues playing when navigating between screens