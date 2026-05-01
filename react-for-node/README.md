# React User Management App

A practice project for learning React with Node.js backend integration. This is a frontend React application that provides a user management interface, communicating with a Node.js API server.

## Features

- **User List**: Display all users in a table format
- **Search Functionality**: Search users by name or email with debounced input
- **Add User**: Form to create new users
- **Edit User**: Update existing user information
- **Delete User**: Remove users with confirmation dialog
- **Responsive Design**: Clean, modern UI with CSS styling

## Tech Stack

- **Frontend**: React 19, React Router 7
- **Build Tool**: Vite
- **Styling**: CSS
- **Linting**: ESLint

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A running Node.js backend server on `http://localhost:3000` (not included in this repository)

**Note**: This frontend requires a backend API server running on port 3000. Make sure your Node.js backend is started separately.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── App.jsx          # Main user list component
├── AddUser.jsx      # Add new user form
├── EditUser.jsx     # Edit existing user form
├── Header.jsx       # Navigation header
├── main.jsx         # App entry point
├── App.css          # Main styles
└── index.css        # Global styles
```

## API Endpoints

The app communicates with the following backend endpoints:

- `GET /users?search=<query>` - Fetch users (with optional search)
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Contributing

This is a practice project for learning purposes. Feel free to experiment and modify the code.
