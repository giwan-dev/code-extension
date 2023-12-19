const path = require('path');

module.exports = {
  target: 'node', // VSCode 확장은 Node.js 환경에서 실행되므로 'node'를 타겟으로 설정합니다.
  entry: './src/extension.ts', // 엔트리 포인트 파일 경로
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js', // 번들 파일 이름
    libraryTarget: 'commonjs2', // VSCode 확장은 CommonJS 모듈 시스템을 사용합니다.
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  devtool: 'source-map',
  externals: {
    vscode: 'commonjs vscode', // 'vscode' 모듈을 외부 종속성으로 표시합니다.
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
    ],
  },
};