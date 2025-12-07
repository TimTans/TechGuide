

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
//Remember, for this to work, you have to have a terminal with vercel dev running.

const baseUrl =
  process.env.STATUS_BASE_URL || "http://localhost:3000";

async function main() {
  console.log(`Fetching system status from ${baseUrl}/api/system_status ...`);

  const res = await fetch(`${baseUrl}/api/system_status`);
  if (!res.ok) {
    console.error("Failed to fetch system status:", res.status, res.statusText);
    process.exit(1);
  }

  const data = await res.json();


  const folder = "reports";
  mkdirSync(folder, { recursive: true });


  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = join(folder, `${stamp}-system_status.json`);

  writeFileSync(filename, JSON.stringify(data, null, 2), "utf8");
  console.log(`✅ System status written to ${filename}`);
}

main().catch((err) => {
  console.error("Error running system status snapshot:", err);
  process.exit(1);
});
