// Starts the API first so Vite can proxy to the port the API actually claimed.
import { spawn } from "node:child_process";
import net from "node:net";

let website = null;
let server = null;

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

    server.listen(port, "0.0.0.0", function () {
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

async function getExistingRyzeApi(port) {
  const controller = new AbortController();
  const timeout = setTimeout(function () {
    controller.abort();
  }, 1500);

  try {
    const response = await fetch("http://localhost:" + port + "/api/health", {
      signal: controller.signal,
    });
    if (!response.ok) {
      return null;
    }

    const health = await response.json();
    if (health.ok === true && Number.isInteger(health.pendingEmailNotifications)) {
      return health;
    }
    return null;
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function startApi(port) {
  return new Promise(function (resolve, reject) {
    const child = spawn(process.execPath, ["server/index.js"], {
      stdio: ["inherit", "pipe", "pipe"],
      env: { ...process.env, API_PORT: String(port) },
    });
    let output = "";
    let ready = false;

    function collect(chunk, stream) {
      const text = chunk.toString();
      if (ready) {
        stream.write(text);
        return;
      }

      output = (output + text).slice(-4000);
      if (output.includes("RYZE server running on http://localhost:" + port)) {
        ready = true;
        stream.write(output);
        output = "";
        resolve(child);
      }
    }

    child.stdout.on("data", function (chunk) {
      collect(chunk, process.stdout);
    });
    child.stderr.on("data", function (chunk) {
      collect(chunk, process.stderr);
    });
    child.once("error", function (error) {
      if (!ready) {
        reject(error);
      } else {
        console.error("[API] process error:", error.message);
      }
    });
    child.once("exit", function (code) {
      if (!ready) {
        const error = new Error("API server exited before listening on port " + port + ".");
        error.code = output.indexOf("EADDRINUSE") !== -1 ? "EADDRINUSE" : "API_START_FAILED";
        error.startupOutput = output;
        reject(error);
        return;
      }
      console.log("[API] stopped (code " + code + ")");
      if (website !== null) {
        website.kill();
      }
      process.exit(code || 1);
    });
  });
}

const startPort = Number(process.env.API_PORT || process.env.PORT || 5000);
let apiPort = startPort;
let apiAlreadyRunning = false;
const existingApi = await isPortAvailable(startPort) ? null : await getExistingRyzeApi(startPort);

if (existingApi !== null) {
  if (existingApi.emailTransport !== "gmail-smtp-465") {
    throw new Error("An older RYZE API is running on port " + startPort +
      ". Stop that server, then run npm run dev again to load the updated Gmail SMTP settings.");
  }
  apiAlreadyRunning = true;
  console.log("Using existing RYZE API on port " + startPort);
} else {
  apiPort = await findAvailablePort(startPort);
}

if (!apiAlreadyRunning) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      server = await startApi(apiPort);
      break;
    } catch (error) {
      if (error.code !== "EADDRINUSE") {
        if (error.startupOutput) {
          process.stderr.write(error.startupOutput);
        }
        throw error;
      }
      console.log("Port " + apiPort + " became busy during startup; retrying on the next port.");
      apiPort = await findAvailablePort(apiPort + 1);
    }
  }

  if (!server) {
    throw new Error("Could not start the API after 10 port-selection attempts.");
  }
}

console.log("Starting RYZE: website on http://localhost:5173 and API on http://localhost:" + apiPort);

website = spawn("npm", ["run", "client"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, API_PORT: String(apiPort) },
});
website.on("exit", function (code) {
  console.log("[WEB] stopped (code " + code + ")");
});

function stopAll() {
  if (website !== null) {
    website.kill();
  }
  if (server !== null) {
    server.kill();
  }
  process.exit();
}

process.on("SIGINT", stopAll);
process.on("SIGTERM", stopAll);
