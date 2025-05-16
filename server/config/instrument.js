// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://837c2c4a5f9052ea8f7ca2c0f7be48f6@o4509326825422848.ingest.us.sentry.io/4509326828175360",
  integrations: [
       Sentry.mongooseIntegration(),
  ],

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});