# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Music-gram is a React Native mobile app built with Expo SDK 55, TypeScript, and Firebase.

## Project
Spotify Clone - React Native / Expo app with TypeScript

## Tech Stack
- Expo (managed workflow) + TypeScript
- Firebase Firestore (database)
- Firebase Auth (email/password + Google OAuth)
- React Navigation (stack + tab navigation)
- expo-av for audio playback

## Architecture
- /screens — full page screens (Home, Search, Library, Player)
- /components — reusable UI components
- /hooks — custom React hooks
- /services — Firebase logic (auth.ts, firestore.ts, storage.ts)
- /navigation — navigation config

## Conventions
- Strict TypeScript, no `any`
- Components in PascalCase
- Keep components under 150 lines

## Prohibited
- Do NOT auto-commit without asking
- Do NOT modify .env or firebase config files
- Do NOT use class components


## Commands

- `npx expo start` — start the Expo dev server
- `npx expo start --android` — start on Android
- `npx expo start --ios` — start on iOS
- `npx expo start --web` — start on web
- `npx expo run:android` - start directly (native)
- `npx tsc --noEmit` — type-check without emitting

## Architecture

- **Entry point**: `index.ts` registers the root component via `registerRootComponent`
- **Root component**: `App.tsx`
- **Navigation**: React Navigation (stack navigator via `@react-navigation/stack`)
- **Auth**: `expo-auth-session` + `expo-web-browser` for OAuth flows
- **Media**: `expo-av` for audio/video playback
- **Backend**: Firebase SDK (`firebase` package)
- **TypeScript**: strict mode, extends `expo/tsconfig.base`
