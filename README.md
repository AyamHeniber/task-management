# Task Management Application

A React-based task management dashboard with mocked backend integration.

## Features
- **Authentication**: JWT-based login simulation.
- **Task Management**: Create, Read, Update, and Delete tasks.
- **Filtering & Search**: Filter tasks by status and search by title/description.
- **Dark Mode**: Built-in dark/light theme toggle.
- **Mock API**: Uses Mock Service Worker (MSW) to simulate REST API endpoints.
- **Responsive UI**: Built with Ant Design and Tailwind CSS.

## Tech Stack
- React 18 + Vite
- TypeScript
- Redux Toolkit (State Management)
- Ant Design + Tailwind CSS (Styling)
- Mock Service Worker (API Mocking)
- Vitest + React Testing Library (Testing)

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
Start the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

**Demo Credentials:**
- Username: `test`
- Password: `test123`

### Running Tests
Run unit and integration tests with coverage:
```bash
npm run test -- --coverage
```

## Mock API & persistence
The application uses **Mock Service Worker (MSW)** to intercept network requests at the network level.
- `POST /login`: Authenticates user.
- `GET /tasks`: Fetches all tasks.
- `POST /tasks`: Creates a task.
- `PUT /tasks/:id`: Updates a task.
- `DELETE /tasks/:id`: Deletes a task.

Data is persisted in `localStorage` to survive page reloads.

## Project Structure
- `src/app`: Redux store configuration.
- `src/features`: Feature-based modules (Auth, Tasks).
- `src/shared`: Reusable components (ProtectedRoute, etc.).
- `src/mocks`: MSW handlers and server setup.
- `src/context`: React Context (Theme).

## Deployment
Build for production:
```bash
npm run build
```
The output will be in the `dist` folder, ready to be deployed to Vercel, Netlify, or any static host.
# task-management
