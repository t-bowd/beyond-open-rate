// Removes tinacms's nested @ariakit/react 0.4.x after npm install.
//
// @ariakit/react 0.4.x imports from @ariakit/react-components sub-paths
// (e.g. group/group, heading/heading) that were never published to npm at 0.4.x.
// This breaks TinaCMS's esbuild step. Removing the nested copy forces Node.js
// to use the top-level @ariakit/react 0.3.14 (pinned via overrides), which
// imports from @ariakit/react-core instead and builds without errors.

const fs = require("fs");
const path = require("path");

const ariakitDir = path.join(__dirname, "../node_modules/tinacms/node_modules/@ariakit");

if (!fs.existsSync(ariakitDir)) {
  process.exit(0);
}

const entries = fs.readdirSync(ariakitDir);

if (entries.length === 0) {
  fs.rmdirSync(ariakitDir);
  console.log("postinstall: removed empty node_modules/tinacms/node_modules/@ariakit/");
  process.exit(0);
}

// Check if @ariakit/react is nested here at 0.4.x
const reactPkg = path.join(ariakitDir, "react", "package.json");
if (fs.existsSync(reactPkg)) {
  const { version } = JSON.parse(fs.readFileSync(reactPkg, "utf8"));
  if (version.startsWith("0.4")) {
    fs.rmSync(ariakitDir, { recursive: true, force: true });
    console.log(`postinstall: removed node_modules/tinacms/node_modules/@ariakit/ (had @ariakit/react@${version} which requires unpublished @ariakit/react-components@0.4.x)`);
  }
}
