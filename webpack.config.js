// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const { library, experiments } = require('webpack');


const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = 'style-loader';

const libraryName = 'hydraulic-resistance';



const config = {
    experiments: {
        outputModule: true
    },

    entry: './app/src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: libraryName + '.js',
        libraryTarget: 'module'
        
    },
    plugins: [
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,'css-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};
