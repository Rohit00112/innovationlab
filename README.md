# Innovation Lab Website

This is the official website for the Innovation Lab at Itahari International College, built with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.org).

## Important Deployment Requirements

### Domain Configuration
**The website must be deployed to the domain: `innovation.iic.edu.np`**



### Environment Variables
The following environment variables must be set in your deployment environment:

```
EMAIL_PASSWORD=your_app_password_here
```

This is required for the contact form functionality. See the [Email Setup](#email-setup) section for more details.

## Getting Started

### Prerequisites
- Node.js 18.18.0 or higher
- Yarn or npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/innovation-lab.git
cd innovation-lab
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the required environment variables (see [Email Setup](#email-setup))

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js app router pages and layouts
- `components/` - React components organized by type
- `data/` - JSON files containing website content
- `hooks/` - Custom React hooks
- `public/` - Static assets (images, fonts, etc.)
- `styles/` - Global CSS and Tailwind configuration

## Email Setup

The contact form uses SMTP to send emails to `innovation.lab@iic.edu.np`. To set up email functionality:

1. Create a `.env.local` file in the root directory with:
```
EMAIL_PASSWORD=your_app_password_here
```

2. When deploying, add this environment variable to your hosting platform's environment settings.