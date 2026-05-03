import path from "path";

// required for ES modules
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// for absolute file for other paths
// gives main index.js file for this chapter-10

// export default path.dirname(require.main.filename);  // for commonjs
export default path.dirname(process.argv[1]); // for ES modules (import/export)


// Without this path Util - relative path
// res.sendFile(path.join(__dirname, "../", "views", "home.html"));

// with this path util - absolute path - this is best
// res.sendFile(path.join(rootDir, "views", "home.html"));
