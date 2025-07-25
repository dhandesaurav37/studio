# White Wolf - Firebase Studio Project

This is a Next.js application built with Firebase Studio. This guide provides all the necessary steps to run, build, and deploy your application to Firebase App Hosting.

## Getting Started

First, install the necessary project dependencies:

```bash
npm install
```

To run the development server locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment to Firebase App Hosting

Follow these steps to deploy your application to a live URL.

### Step 1: Build the Application

This command compiles and optimizes your Next.js application for production.

```bash
npm run build
```

### Step 2: Deploy to Firebase

This command uploads your built application to Firebase App Hosting.

```bash
firebase deploy --only apphosting
```

After the deployment is complete, the Firebase CLI will provide you with a live URL where you can view your deployed application.

## Troubleshooting Deployment

If you encounter issues during deployment, such as the CLI not finding your backend, follow these steps to refresh your connection to Firebase.

1.  **Log out of the Firebase CLI:**
    ```bash
    firebase logout
    ```

2.  **Log back in:** This will open a browser window to re-authenticate.
    ```bash
    firebase login
    ```

3.  **Try the deployment again:**
    ```bash
    firebase deploy --only apphosting
    ```

This process typically resolves any synchronization issues between your local machine and your Firebase project.

## Advanced `apphosting.yaml` Configuration

As you discovered in the documentation, you can add more advanced configurations to your `apphosting.yaml` file to control scaling and environment variables.

Here is an example of what you can add:

```yaml
# Settings to manage and configure a Firebase App Hosting backend.
# https://firebase.google.com/docs/app-hosting/configure
backend:
  framework: next
runConfig:
  minInstances: 0
  maxInstances: 100
  concurrency: 100
  cpu: 1
  memoryMiB: 512
headers:
  - source: /_next/static/**
    headers:
      - key: Cache-Control
        value: public, max-age=31536000, immutable
env:
  - variable: MY_ENV_VARIABLE
    value: some_value
    availability:
      - BUILD
      - RUNTIME
  - variable: MY_API_KEY
    secret: a-secret-id-in-secret-manager
```

### Key Sections Explained:

*   **`runConfig`**: Controls the scaling behavior of your Cloud Run instance. You can set the minimum and maximum number of server instances, CPU, and memory. This is useful for managing performance and cost.
*   **`env`**: Manages environment variables. You can set plain text variables (like `MY_ENV_VARIABLE`) or securely reference secrets stored in Google Secret Manager (like `MY_API_KEY`). These can be made available during the build process (`BUILD`) or when the app is running (`RUNTIME`).

Remember, these advanced settings are not required for your initial deployment but are very useful as your application grows.


