import * as esbuild from 'esbuild';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const src = path.join(root, 'src');
const watch = process.argv.includes('--watch');
const nodeEnv = watch ? 'development' : 'production';
const DEV_PORT = 8080;

function openBrowser(url) {
  const platform = process.platform;
  const cmd = platform === 'darwin' ? 'open' : platform === 'win32' ? 'cmd' : 'xdg-open';
  const args = platform === 'win32' ? ['/c', 'start', '', url] : [url];
  spawn(cmd, args, { detached: true, stdio: 'ignore' }).unref();
}

function cssInjectPlugin() {
  return {
    name: 'css-inject',
    setup(build) {
      build.onLoad({ filter: /\.css$/ }, async (args) => {
        const source = await fs.promises.readFile(args.path, 'utf8');
        const result = await postcss([autoprefixer]).process(source, {
          from: args.path,
        });
        return {
          contents: `
            const css = ${JSON.stringify(result.css)};
            if (typeof document !== 'undefined') {
              const style = document.createElement('style');
              style.textContent = css;
              document.head.appendChild(style);
            }
          `,
          loader: 'js',
        };
      });
    },
  };
}

function prepareDist() {
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist, { recursive: true });
  fs.cpSync(path.join(src, 'public'), dist, { recursive: true });
}

const buildOptions = {
  absWorkingDir: root,
  entryPoints: {
    ligo: path.join(src, 'index.js'),
    background: path.join(src, 'background.js'),
  },
  bundle: true,
  outdir: dist,
  entryNames: '[name]',
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
  sourcemap: true,
  minify: false,
  logLevel: 'info',
  define: {
    'process.env.NODE_ENV': JSON.stringify(nodeEnv),
  },
  // Extension popup has no Node builtins; keep browser-only deps.
  alias: {
    lib: path.join(src, 'lib'),
    containers: path.join(src, 'containers'),
    components: path.join(src, 'components'),
  },
  plugins: [cssInjectPlugin()],
};

prepareDist();

if (watch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  const { hosts, port } = await ctx.serve({
    servedir: dist,
    host: '127.0.0.1',
    port: DEV_PORT,
  });
  const url = `http://127.0.0.1:${port}/popup.html`;
  console.log(`watching… serving ${url}`);
  openBrowser(url);
} else {
  await esbuild.build(buildOptions);
}
