# 💬 Chat App

A real-time chat application with public channels, 1:1 direct messages, typing
indicators, reactions, message editing, and image sharing — built with React,
TypeScript, Vite, and Firebase, and deployed to Firebase Hosting via CI/CD.

**Live:** https://chatappdemo-e1b26.web.app

> _Add a screenshot or GIF here (e.g. `docs/screenshot.png`) — it's the first
> thing a reviewer looks at._

---

## ✨ Features

- **Authentication** — Google (popup) and email/password (sign in + create
  account), plus anonymous guest access.
- **Channels** — multiple public rooms (General, Random, Tech, Gaming, Music).
- **Direct messages** — start a 1:1 DM by clicking a user in any channel;
  conversations are private to their two members.
- **Real-time everything** — Firestore live updates for messages, typing
  indicators, and reactions.
- **Rich messaging** — message grouping with avatars and timestamps, date
  separators, emoji reactions, inline edit, delete (with a themed confirm),
  and image sharing.
- **Modern UI** — cohesive black/blue theme, glassmorphism, and a responsive
  layout with a slide-in sidebar drawer on mobile.

## 🛠 Tech Stack

| Area       | Choice                                                     |
| ---------- | ---------------------------------------------------------- |
| Framework  | React 18 + **TypeScript** (strict)                         |
| Build      | **Vite** (migrated from Create React App)                  |
| Styling    | Tailwind CSS                                               |
| Backend    | Firebase **Auth** + **Firestore**                          |
| Tooling    | ESLint, Prettier, Husky + lint-staged                      |
| Monitoring | Sentry (opt-in via env)                                    |
| CI/CD      | GitHub Actions → Firebase Hosting (lint + typecheck gates) |

## 🏗 Architecture

- **Generalized message layer.** Channels and DMs share one implementation via
  a `chatPath` (`["rooms", id]` or `["conversations", id]`); `Chat`,
  `SendMessage`, `TypingIndicator`, and the message actions all operate on it.
- **Chat context.** `ChatProvider` / `useChat` track the active conversation
  and handle opening rooms and DMs.
- **Security rules.** `firestore.rules` enforces author-only writes, payload
  validation, member-only DM access, and scoped reaction/edit/delete updates.
- **Images.** Compressed in-browser to a data URL and stored on the message
  (free-tier friendly; swap `compressImageToDataUrl` for object storage to
  scale).

```
src/
  chat/         # ChatProvider, context, active-conversation helpers
  components/   # UI (ChatLayout, SidebarNav, Chat, Message, SendMessage, ...)
  hooks/        # useTyping
  lib/          # messageActions, image compression, sentry init
  utils/        # time formatting
  firebase.ts   # Firebase init (auth, db)
  rooms.ts      # channel definitions
firestore.rules # Firestore security rules
```

## 🚀 Getting Started

```bash
npm install
npm run dev      # start the dev server
```

Other scripts:

```bash
npm run build      # typecheck + production build (outputs to build/)
npm run lint       # ESLint (max-warnings 0)
npm run typecheck  # tsc --noEmit
npm run format     # Prettier
```

### Firebase configuration

The web Firebase config in `src/firebase.ts` is safe to commit — access is
controlled by **security rules**, not key secrecy. To run against your own
project, swap the config and publish `firestore.rules`
(Firebase Console → Firestore → Rules), then enable the **Google** and
**Email/Password** sign-in providers under Authentication.

Optional error monitoring: set `VITE_SENTRY_DSN` to enable Sentry.

## 📦 Deployment

Pushing to `master` triggers GitHub Actions, which runs `lint → build` and
deploys to Firebase Hosting. Pull requests get an automatic preview channel.

## 🗺 Roadmap

- Automated tests (Vitest + React Testing Library + Firebase emulator)
- Presence (online/away)
- Moderation (rate limiting / profanity) via Cloud Functions
