# portal-web
## Getting Started
### Prerequisites

```bash
$ yarn -v
1.7.0

$ node -v
v10.5.0
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
# chack tslint
$ yarn lint
# build Project
$ yarn build
# start webpack-dev-server and build
$ yarn start
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


#### Generate Documents
```bash
$ yarn docs
```
