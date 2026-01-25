# Remaining Tasks & Missing Features

This document outlines the missing parts of the website that need to be implemented to complete the application.

## 1. Event Registration
Currently, events rely on an external `registrationUrl`. We need a native registration system.
- [ ] **Database**: Create `event_registrations` table (user_id, event_id, status, created_at).
- [ ] **API**: Create endpoints to handling registration (POST /api/events/[id]/register).
- [ ] **Frontend**: Create `src/app/(frontend)/events/[slug]/register/page.tsx` with a registration form.
- [ ] **User Dashboard**: 'My Events' section to see registered events.

## 2. Authentication
Only the Login page exists. We need a complete auth flow.
- [ ] **Sign Up Page**: `src/app/(frontend)/(auth)/register/page.tsx` for new users.
- [ ] **Forgot Password**: `src/app/(frontend)/(auth)/forgot-password/page.tsx`.
- [ ] **Reset Password**: `src/app/(frontend)/auth/reset-password/page.tsx`.

## 3. Public Pages
- [ ] **Testimonials**: Dedicated page `src/app/(frontend)/testimonials/page.tsx` to list all testimonials (currently only API and Admin exist).
- [ ] **Team / Community**: A page to list users or team members if applicable.

## 4. User Profile
Logged-in users need a place to manage their account.
- [ ] **Profile Page**: `src/app/(frontend)/profile/page.tsx` or `src/app/dashboard/profile/page.tsx`.
- [ ] **Settings**: Change password, update avatar, etc.

## 5. Admin Features
- [ ] **Registration Management**: Admin view to see who registered for an event.
