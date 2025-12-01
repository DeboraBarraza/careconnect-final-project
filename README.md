CareConnect – UCI Advanced React Final Project

CareConnect is a React-based web application built for the UCI Advanced React course final project.
It demonstrates modern React development using:
Next.js 14 (App Router)
Redux Toolkit
Local Storage persistence
Async API fetching
Client Components
Custom UI and state management patterns
This project simulates a parent dashboard containing weather information, daily child updates, and task reminders, all persisted locally on the client.

Features

1. Dashboard Page
Displays current weather (API simulated)
Shows today’s activity updates
Allows adding new updates
Updates persist using Redux + localStorage

3. Tasks & Reminders
Displays suggested tasks (fetched from an API)
Allows creating new daily tasks
Tasks can be marked as Completed or Pending
All tasks persist using Redux + localStorage

5. Child Profile (Static Page)
Simple profile layout for presentation purposes

Technical Highlights

Next.js (App Router)
All pages are located under the app/ directory, using modern React Server + Client Components.

Redux Toolkit

Two slices manage state:
activitiesSlice.ts
tasksSlice.ts

Local Storage Persistence
A custom Redux store subscribes to state changes and writes:

Activities: careconnect_activities_v1
Tasks: careconnect_tasks_v1

TypeScript

All components and slices include strong type definitions.

UI Styling
Tailwind CSS (or custom CSS depending on setup)
Responsive layout for desktop and mobile

How to Run the Project Locally 
Clone the repository:

git clone https://github.com/DeboraBarraza/careconnect-final-project.git
cd careconnect-final-project

Install dependencies:

npm install

Start the development server:

npm run dev

The project will be available at:
http://localhost:3000

app/
 ├── dashboard/
 ├── tasks/
 ├── child/
 ├── components/
 ├── store/
 ├── utils/
 ├── layout.tsx
 └── page.tsx

store/
 ├── activitiesSlice.ts
 ├── tasksSlice.ts
 └── store.ts

Author
Débora Barraza
UCI Advanced React – Fall 2025
Instructor: Lucas Krause

Assignment Summary:

This project fulfills the final assignment requirements:
Modern React and Next.js architecture
State management with Redux Toolkit
API fetching with Thunks
LocalStorage persistence
Fully functional, styled UI
Clean component organization
TypeScript implementation
