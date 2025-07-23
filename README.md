# 🎬 movie-carousel

A technical test application built for **Mytheresa**.

This project is a movie browser using The Movie Database (TMDB) API, built with React, TypeScript, and custom Server-Side Rendering (SSR).

---

## 🚀 Getting Started

### ✅ Prerequisites

It is recommended to use the following versions:

- **Node.js**: `v20.19.4`
- **Yarn**: `v1.22.21`

### 📦 Installation

Clone the repository and install dependencies:

```bash
yarn install
```

### 🔧 Development

To start the development server:

```bash
yarn dev
```

### 🧪 Running Tests

To execute unit and integration tests:

```bash
yarn test
```

### 🏗️ Build for Production

To create the production build:

```bash
yarn build
```

---

## ⚙️ Project Details

- Written in **TypeScript**
- Implements **custom Server-Side Rendering (SSR)**
- Uses a custom hook `useInitialData` to hydrate client-side components with server-fetched data, avoiding redundant API calls.
- The `.env` file has been included for ease of testing by the reviewer.  
  ⚠️ **Note**: This is **not recommended** for real-world projects as it contains sensitive information like API keys and account IDs. In production, a `.env.sample` should be provided instead and sensitive tokens requested via other secure means.
- State management is handled with **Zustand**, using `localStorage` persistence to simulate the "favorites" feature.
- While TMDB API supports adding favorites via guest sessions, it presented issues with authentication as per its documentation. Given that Mytheresa uses TMDB as a source, a local implementation was chosen instead for reliability.

---

## 💡 Suggestions for Improvement

- [ ] Implement lazy loading for images.
- [ ] Use ISR (Incremental Static Regeneration) to cache HTML and server responses.
- [ ] Add dynamic metadata for SEO at server level per page.
- [ ] Improve styling and layout for a more polished UI.
- [ ] Refactor large components by extracting logic into smaller, well-separated files.
- [ ] Increase unit and integration test coverage.
- [ ] Replace simple `Loading...` indicators with skeleton loaders.
- [ ] Add a `Dockerfile` for containerized development and deployment.
- [ ] Include `prettier.config.ts` to ensure consistent formatting across developers.
- [ ] Add a custom 404 Not Found page.
- [ ] Add React error boundaries to gracefully handle rendering errors.
- [ ] Implement a unified error management strategy with customizable logging levels.
- [ ] Enable compression on build chunks to reduce bundle size.
- [ ] Improve folder structure (e.g., move all `Details`-related files into a `Details/` folder).
