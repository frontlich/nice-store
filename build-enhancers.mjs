import path from 'path';
import fs from 'fs/promises';

import esbuild from 'esbuild';

const enhancersDir = path.resolve('src', 'enhancers');

async function build() {
  const nameList = await fs.readdir(enhancersDir);

  const enhancerPathList = nameList
    .filter((name) => {
      const arr = name.split('.');
      return name !== 'index.ts' && arr[arr.length - 1] === 'ts';
    })
    .map((name) => path.resolve(enhancersDir, name));

  const formatBuild = (format) => {
    return Promise.all([
      esbuild.build({
        entryPoints: enhancerPathList,
        entryNames: `[dir]/[name].${format}`,
        format,
        outdir: path.resolve('dist', 'enhancers'),
        write: true,
        bundle: true,
        treeShaking: true,
        external: ['rxjs'],
        define: {
          'process.env.NODE_ENV': 'process.env.NODE_ENV',
        },
      }),
      esbuild.build({
        entryPoints: [path.resolve(enhancersDir, 'index.ts')],
        entryNames: `[dir]/[name].${format}`,
        format,
        outdir: path.resolve('dist', 'enhancers'),
        write: true,
        bundle: false,
        treeShaking: true,
      }),
    ]);
  };

  await formatBuild('cjs');
  await formatBuild('esm');

  try {
    await fs.access(path.resolve('enhancers'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(path.resolve('enhancers'));
    } else {
      throw error;
    }
  }

  fs.writeFile(
    path.resolve('enhancers', 'package.json'),
    JSON.stringify(
      {
        name: 'nice-store/enhancers',
        types: '../dist/enhancers/index.d.ts',
        main: '../dist/enhancers/index.js',
        module: '../dist/enhancers/index.esm.js',
        sideEffects: false,
      },
      null,
      '  ',
    ),
  );
}

build();
