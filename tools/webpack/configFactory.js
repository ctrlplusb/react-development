import { resolve as resolvePath } from 'path';
import webpack from 'webpack';
import appRootDir from 'app-root-dir';
import { getPackageJson, removeEmpty, ifElse } from '../utils';

function webpackConfigFactory({ target }) {
  const libraryName = 'react';
  const minimize = target === 'umd-min';

  return {
    entry: {
      index: ['react'],
    },
    output: {
      path: resolvePath(appRootDir.get(), './umd'),
      filename: minimize
        ? `${libraryName}.min.js`
        : `${libraryName}.js`,
      library: libraryName,
      libraryTarget: 'umd',
    },
    plugins: removeEmpty([
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),

      new webpack.LoaderOptionsPlugin({
        minimize,
      }),

      ifElse(minimize)(
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            screw_ie8: true,
            warnings: false,
          },
          mangle: {
            screw_ie8: true,
          },
          output: {
            comments: false,
            screw_ie8: true,
          },
        }),
      ),
    ]),
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [resolvePath(appRootDir.get(), './src')],
        },
      ],
    },
  };
}

module.exports = webpackConfigFactory;
