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
$  bower install
```

## Booting up the project

You will need to open 2 consoles and run both projects and MongoDb.

```shell
$ cd be AND cd fe
$ gulp
```

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

