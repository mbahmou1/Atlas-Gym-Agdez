const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const nextDir = path.join(root, ".next");

function run(cmd) {
  execSync(cmd, { cwd: root, stdio: "inherit", shell: true });
}

try {
  if (process.platform === "win32") {
    try {
      run("for /f \"tokens=5\" %a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %a 2>nul");
    } catch {
      /* ignore */
    }
  }
} catch {
  /* ignore */
}

if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log("Removed .next");
}

run("npm run build");

console.log("\nStarting server on http://0.0.0.0:3000 ...\n");
const child = spawn("npm", ["run", "start"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});

child.on("error", (err) => {
  console.error(err);
  process.exit(1);
});
