## Backbone APP()

An app object for the client, using common conventions for Backbone.js

The main purpose for this lib is to relieve you from setting up backbone.js on a  low level - allowing you to focus on the things that are unique in your product. 

Among others is contains a collection of "fixes" to common solutions and provides a solid foundation to start off developing!


## Features

The APP() includes methods that connect it to: 

* Template class
* External html fragments
* Google Analytics 
* Automated Session (with plugin)
* Phonegap 


## Install

Using bower:

```
bower install backbone.app
```

Direct download:  [https://github.com/makesites/backbone-app/archive/master.zip](https://github.com/makesites/backbone-app/archive/master.zip)

Find the compilled library in the "build/" folder. Choose between the uncompressed and comment annotated **backbone.app.js** and the minified **backbone.app-min.js** 

## Build

To build the library simply load the npm dependencies and execute the **build.js** with node: 
```
npm install
node build.js
```

The build script will combine the contents of the "lib/" folder and output the compiled library in the "build/" folder.


## Credits

Created by Makis Tracend ( [@tracend](http://github.com/tracend) )

Distributed through [Makesites.org](http://makesites.org/)

Released under the [MIT license](http://makesites.org/licenses/MIT)
