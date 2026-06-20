/**
 * AWS Amplify Configuration
 *
 * PRODUCTION SETUP:
 *   1. Run `amplify init` in this project directory
 *   2. Run `amplify add auth` — choose Cognito with User Pools
 *   3. Run `amplify add storage` — choose S3 for photo uploads
 *   4. Run `amplify push` to provision resources
 *   5. Amplify will auto-generate this file with real values
 *
 * The values below are DEMO PLACEHOLDERS — the app runs in demo mode
 * using mock data when no real Cognito pool is configured.
 *
 * Cognito User Pool Groups (configure via Amplify Console or CLI):
 *   - public        : Default authenticated users / general public
 *   - law_enforcement : Verified LE officers (admin-approved)
 *   - admin         : Platform administrators
 *
 * DynamoDB Tables (provisioned via amplify add api):
 *   - MissingChildCases
 *   - Sightings
 *   - Users
 *
 * S3 Bucket:
 *   - childguard-photos-{env} — stores child photos and sighting uploads
 *   - Access: private (pre-signed URLs for display)
 *   // TODO: AWS Rekognition integration — face indexing on S3 upload event
 */

const awsConfig = {
  // ── Auth (Amazon Cognito) ───────────────────────────────────────────────────
  Auth: {
    Cognito: {
      region: 'us-east-1',
      userPoolId: 'REPLACE_WITH_YOUR_USER_POOL_ID',         // e.g. us-east-1_XXXXXXXXX
      userPoolClientId: 'REPLACE_WITH_YOUR_APP_CLIENT_ID', // e.g. 1234567890abcdefghij
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
        username: false,
      },
    },
  },

  // ── Storage (Amazon S3) ────────────────────────────────────────────────────
  Storage: {
    S3: {
      bucket: 'REPLACE_WITH_YOUR_S3_BUCKET_NAME',  // e.g. childguard-photos-dev
      region: 'us-east-1',
    },
  },

  // ── API (AWS AppSync / API Gateway → DynamoDB) ────────────────────────────
  // Uncomment after running `amplify add api`
  // API: {
  //   GraphQL: {
  //     endpoint: 'REPLACE_WITH_APPSYNC_ENDPOINT',
  //     region: 'us-east-1',
  //     defaultAuthMode: 'userPool',
  //   },
  // },
};

export default awsConfig;
