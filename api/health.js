export default async function handler(req, res) {

  const Begin = new Date().toISOString();

  const info = {
    status: "Good",
    checkedAt: now,
    env: {
      vercelEnv: process.env.VERCEL_ENV || "local",
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA || null,
      commitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || null,
    },
  };

  res.status(200).json(info);
}