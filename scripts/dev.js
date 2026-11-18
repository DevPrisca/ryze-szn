// Starts the website (Vite) and the order server together. No extra packages needed.
import { spawn } from "node:child_process";
import net from "node:net";

function isPortAvailable(port) {
  return new Promise(function (resolve, reject) {
    const server = net.createServer();

    server.once("error", function (error) {
      if (error.code === "EADDRINUSE") {
        resolve(false);
        return;
      }
      reject(error);
    });

    server.listen(port, function () {
      server.close(function (error) {
        if (error) {
          reject(error);
          return;
        }
        resolve(true);
      });
    });
  });
}

async function findAvailablePort(startPort) {
  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port += 1;
  }
  return port;
}

function start(label, scriptName, apiPort) {
  const child = spawn("npm", ["run", scriptName], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, API_PORT: String(apiPort) },
  });

  child.on("exit", (code) => console.log("[" + label + "] stopped (code " + code + ")"));

  return child;
}

const startPort = Number(process.env.API_PORT || process.env.PORT || 5000);
const apiPort = await findAvailablePort(startPort);

console.log("Starting RYZE: website on http://localhost:5173 and API on http://localhost:" + apiPort);

const website = start("WEB", "client", apiPort);
const server = start("API", "server", apiPort);

function stopAll() {
  website.kill();
  server.kill();
  process.exit();
}

process.on("SIGINT", stopAll);
process.on("SIGTERM", stopAll);
