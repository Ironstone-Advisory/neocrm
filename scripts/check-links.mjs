import { access, readdir, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const ignoredDirectories = new Set([".git", "node_modules"]);

async function markdownFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await markdownFiles(path)));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(path);
  }
  return files;
}

function localTargets(markdown) {
  const withoutCodeBlocks = markdown.replace(/```[\s\S]*?```/g, "");
  return [...withoutCodeBlocks.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)]
    .map((match) => match[1].trim())
    .map((target) => (target.startsWith("<") && target.endsWith(">") ? target.slice(1, -1) : target))
    .filter((target) => !/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(target))
    .map((target) => target.split("#", 1)[0].split("?", 1)[0])
    .filter(Boolean)
    .map((target) => decodeURIComponent(target));
}

export async function checkLinks(repositoryRoot = root) {
  const errors = [];
  for (const file of await markdownFiles(repositoryRoot)) {
    const content = await readFile(file, "utf8");
    for (const target of localTargets(content)) {
      const resolved = resolve(dirname(file), target);
      try {
        await access(resolved);
      } catch {
        errors.push(`${relative(repositoryRoot, file)} -> ${target}`);
      }
    }
  }
  return errors;
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isDirectRun) {
  const errors = await checkLinks();
  if (errors.length) {
    console.error(errors.map((error) => `broken relative link: ${error}`).join("\n"));
    process.exitCode = 1;
  } else {
    console.log("markdown relative-link check passed");
  }
}
