const JazzUpdateSitePlugin = require('jazz-update-site-webpack-plugin');
const DisableOutputWebpackPlugin = require('disable-output-webpack-plugin');
const moment = require('moment');
const packageJson = require('./package.json');

module.exports = (env) => {
    const timestamp = moment().format('[_]YYYYMMDD[-]HHmm');
    const version = (typeof env !== 'undefined' && (packageJson.version + "_" + env.buildUUID)) || packageJson.version + timestamp;
    const config = {
        entry: {
            app: './index.js',
        },
        plugins: [
            new DisableOutputWebpackPlugin(),
            new JazzUpdateSitePlugin({
                appType: 'ccm',
                projectId: 'com.siemens.bt.jazz.workitemeditor.rtcEmailWorkItemAction',
                acceptGlobPattern: [
                    'resources/**',
                    'META-INF/**',
                    'plugin.xml',
                ],
                projectInfo: {
                    author: packageJson.author,
                    copyright: packageJson.author,
                    description: packageJson.description,
                    license: packageJson.license,
                    version: version,
                }
            })
        ]
    };

    return config;
};