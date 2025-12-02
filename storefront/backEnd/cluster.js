// cluster.js
import cluster from "cluster";
import os from "os";
import { fileURLToPath } from "url";
import path from "path";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const { default: app } = await import("./server.js");
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Worker ${process.pid} started on port ${PORT}`));
}
