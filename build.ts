import * as esbuild from "esbuild";
import { readdirSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

// Create dist directory if it doesn't exist
const distDir = join(process.cwd(), "dist");
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Find all TypeScript files
function findTsFiles(dir: string, fileList: string[] = []): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      findTsFiles(fullPath, fileList);
    } else if (entry.name.endsWith(".ts")) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

const srcDir = join(process.cwd(), "src");
const tsFiles = findTsFiles(srcDir);

// Build each TypeScript file
for (const tsFile of tsFiles) {
  const relativePath = tsFile.replace(srcDir, "").replace(".ts", ".js");
  const outFile = join(distDir, relativePath.replace(/^\//, ""));

  // Ensure output directory exists
  const outDir = outFile.substring(0, outFile.lastIndexOf("\\"));
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  esbuild.buildSync({
    entryPoints: [tsFile],
    outfile: outFile,
    platform: "node",
    target: "node18",
    format: "esm",
    bundle: false,
    sourcemap: true,
  });
}

console.log("Build complete");

