# Demo Script: Team Task Manager

**Duration**: 2–5 Minutes

---

## 1. Introduction (30s)
"Hi everyone! Today I’m excited to show you **TaskFlow**, a comprehensive Team Task Management application built to streamline collaboration and productivity. We’ve designed this with a modern MERN stack to ensure scalability and a premium user experience."

## 2. Features Walkthrough (2m)
- **Auth & Onboarding**: "We'll start by signing up. Notice the role-based selection—I’ll create an Admin account first. Our authentication uses JWT and bcrypt for enterprise-grade security."
- **Admin Dashboard**: "Once logged in, the Admin sees a high-level overview. We have real-time counters for Pending, In Progress, and Overdue tasks. The UI uses glassmorphism and Tailwind CSS for that premium feel."
- **Task Creation**: "As an Admin, I can create a task. I’ll assign a 'Quarterly Report' to a team member, set its priority to High, and pick a due date. Everything is validated on both ends."
- **Member View**: "Now, let’s switch to a Member's perspective. They see only the tasks assigned to them. They can’t delete tasks, but they can update the status as they work. Notice the smooth transitions using Framer Motion."
- **Filtering & Search**: "With a large team, finding tasks is easy. We have a robust search bar and status filters to keep things organized."

## 3. Tech Explanation (1m)
- "Under the hood, we’re using **Node.js and Express** for a RESTful API. **MongoDB** handles our flexible data schema."
- "On the frontend, **React with Vite** provides a lightning-fast development experience. **Tailwind CSS** allows for highly customized, responsive styling without the bloat."
- "The entire application is ready for deployment on **Railway and Vercel**, with environment variables already abstracted."

## 4. Closing (30s)
"TaskFlow isn't just a TODO list; it's a centralized hub for team accountability. Thank you for watching!"
