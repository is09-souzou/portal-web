# portal-web

https://ds6w3k8cpkvqy.cloudfront.net/

## Getting Started
### Prerequisites

```bash
$ yarn -v
1.7.0

$ node -v
v10.9.0
```

### Development

#### Setup
```bash
$ yarn
```

#### Debug
```bash
$ yarn

$ yarn start
```

#### Commands
```bash
# open browser with webpack-dev-server in development mode
$ yarn start
# open browser with webpack-dev-server in production mode
$ yarn start:prod
# build Project in development mode
$ yarn build
# build Project in development mode
$ yarn build:dev
# build Project in production mode
$ yarn build:prod
# remove cache of hard-source-webpack-plugin
$ yarn cache-clean
# chack typescript lint with tslint
$ yarn lint
# show ubndle size of webpack
$ yarn size-analyze
# generate project documents
$ yarn docs
# deploy to AWS S3 Bucket
$ yarn deploy
```

### Deploy
#### AWS CLI
##### Install AWS CLI
```bash
$ brew install awscli
or
$ pip install awscli
or
$ easy_install pip
```

##### SetUp
```bash
$ aws configure --profile=PROFILE_NAME
AWS Access Key ID [None]: 
AWS Secret Access Key [None]: 
Default region name [None]: 
Default output format [None]: 
```

##### Deploy
```bash
$ yarn deploy
or
$ yarn deploy --profile PROFILE_NAME
```

#### file size analyze
##### cmd
```bash
$ yarn size-analyze
```

##### web-view
uncomment `// new BundleAnalyzerPlugin()` in `webpack.config.(dev|prod).js`
```js
...
    plugins: [
        new BundleAnalyzerPlugin(), // <- uncomment
        new DefinePlugin(
            Object.entries(process.env)
                .map(x => ({["process.env." + x[0]]: JSON.stringify(x[1])}))
                .reduce((x, y) => Object.assign(x, y), {}),
        )
    ],
...
```

#### Generate Documents
```bash
$ yarn docs
```
