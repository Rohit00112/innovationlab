# Email Setup for Contact Form

This document explains how to set up the email functionality for the contact form.

## Environment Variables

The contact form uses SMTP to send emails. You need to set up the following environment variables:

1. Create a `.env.local` file in the root directory of the project with the following content:

```
EMAIL_PASSWORD=your_app_password_here
```

Replace `your_app_password_here` with the app password for the Gmail account.

## Important Notes

- **NEVER commit the `.env.local` file to version control**. It contains sensitive information.
- The `.env.local` file is already included in the `.gitignore` file, so it won't be committed to Git.
- When deploying to a hosting service like Vercel, you need to set the `EMAIL_PASSWORD` environment variable in the hosting service's dashboard.

## How It Works

1. The contact form collects user input (name, email, subject, message, etc.)
2. When the form is submitted, it sends a POST request to the `/api/contact` API route
3. The API route uses nodemailer to send an email to innovation.lab@iic.edu.np
4. The email includes all the form data and sets the reply-to address to the user's email

## Troubleshooting

If emails are not being sent:

1. Check that the `.env.local` file exists and contains the correct app password
2. Ensure the Gmail account has "Less secure app access" enabled or is using an app password
3. Check the server logs for any errors related to nodemailer or SMTP
4. Verify that the SMTP settings in `app/api/contact/route.ts` are correct for Gmail

## Security Considerations

- The app password is stored securely in environment variables and is not exposed to the client
- The API route validates all input before sending emails
- Rate limiting should be implemented to prevent abuse (not included in this basic setup)
