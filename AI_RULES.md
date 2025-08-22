# AI Development Rules for Zalo Mini App

This document outlines the technical stack and coding conventions for the AI assistant to follow when developing this Zalo Mini App.

## 🚀 Tech Stack

- **Platform**: Zalo Mini App, utilizing the `zmp-sdk` for native features.
- **Framework**: React with TypeScript for building a type-safe user interface.
- **Build Tool**: Vite (`zmp-vite-plugin`) for fast development and optimized builds.
- **UI Library**: `zmp-ui` is the primary component library, ensuring a native look and feel on the Zalo platform.
- **Styling**: Tailwind CSS for utility-first styling, supplemented with SCSS for global styles and variables.
- **Routing**: `ZMPRouter` from `zmp-ui` for all in-app navigation.
- **State Management**: React Hooks (`useState`, `useEffect`) for local state and `Jotai` for global/shared state management.
- **API Communication**: Centralized API service layer (`src/services/api.ts`) using the native `fetch` API to interact with the Dynamics 365 CRM backend.

## 📜 Library Usage Rules

### 1. UI Components
- **Primary Choice**: Always use components from the `zmp-ui` library (e.g., `Page`, `Button`, `Input`, `Text`, `Box`). This is mandatory to maintain visual consistency with the Zalo platform.
- **Custom Components**: When a `zmp-ui` component is not sufficient, create new, small, single-purpose components in the `src/components/` directory. Style them using Tailwind CSS.

### 2. Styling
- **Utility Classes**: Use Tailwind CSS for all component-level styling. Avoid inline styles unless absolutely necessary for dynamic properties.
- **Global Styles & Variables**: Define reusable brand colors and variables in `src/css/variables.scss`. Add global styles or complex component styles to `src/css/app.scss`.
- **Responsiveness**: All components must be designed to be responsive and work well on various mobile screen sizes.

### 3. State Management
- **Local State**: For state that is confined to a single component, use React's built-in hooks like `useState` and `useEffect`.
- **Global State**: For state that needs to be shared across multiple components (e.g., user authentication status, theme), use `Jotai`.

### 4. Routing & Navigation
- **Router**: All page routing must be handled by `<ZMPRouter>` and `<AnimationRoutes>` from `zmp-ui`.
- **Navigation**: Use navigation functions provided by `zmp-ui` hooks or components for programmatic navigation.

### 5. Icons
- **Primary Choice**: Use the `<Icon>` component from `zmp-ui` with its built-in icon set (e.g., `zi-arrow-left`).
- **Custom Icons**: If a specific icon is not available, create a new SVG component in `src/components/` (similar to `logo.tsx`).

### 6. API Communication
- **Centralized Service**: All interactions with the backend API must be defined within the `src/services/api.ts` file. Do not make direct `fetch` calls from within components.
- **Data Models**: Define TypeScript interfaces for all API request and response payloads within `api.ts` to ensure type safety.

### 7. Platform Integration
- **Native Features**: To access device or Zalo-specific functionalities (e.g., user info, system theme), use the functions provided by the `zmp-sdk`.