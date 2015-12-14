# slick

## Project setup

*Operating system dependancies*

* MongoDB for the BE.
* Javascript deps

```shell
$  [sudo] npm install -g bower tsd typescript
```

### Lets get the project going now.

```shell
$ git clone [your fork of this repo]
$ cd  [repo]
```
Install project dependancies

For be
```shell
$  cd be 
$  npm install
$  tsd install
```
For fe
```shell
$  cd be 
$  npm install
$  tsd install
```

## Booting up the project - DEVELOPMENT

You will need to open 2 consoles and run both projects and MongoDb.


```shell
$ cd be
$ [npm install && tsd install]
$ gulp
```

```shell
$ cd fe
$ [npm install && tsd install]
$ npm start  #loads webpack server - note that no files are written to disk!! all in memory
```
You need to hit manually http://localhost:3000/index.html - though changes will be reloaded automatically.

## Booting up the project - PROD version - not so pro, but comfortable

Build FE -
```shell
$ cd fe
$ [npm install && tsd install]
$ npm build  #writes files to `fe/dist`
```

Run be - which has a relative path to  `fe/dist` to serve it statically
```shell
$ cd be
$ [npm install && tsd install]
$ gulp #this will run express with nodemon, you can use whatever to run express after building it
```
Hit http://localhost:3002/index.html


## Seed users and rooms 

hit `http://localhost:3002/setup` and your users and rooms will be erased and recreated.

## Tests
(Never run them.. this is a placeholder. I'll make some tests when code is stable)

> This project uses jasmine and Karma for automated unit testing, you
> will need it running globally on your env

```shell
$  [sudo] npm install -g karma
```

```shell
$  [sudo] npm install -g karma-cli
```
```shell
$  [sudo] npm install -g phantomjs
```

