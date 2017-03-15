# media-behavior

A Polymer behavior for media players.

## How To Use

* Add `bower-art-resolver` to your `package.json`
* Add a `.bowerrc` file to your project:
```
{
	"registry": {
		"search": [
			"https://ro-dev:AP3hK9qVHxhdvdFwPeGMw2bj5eWeuDJZuRCdBB@d2lartifacts.artifactoryonline.com/d2lartifacts/api/bower/bower-local",
			"https://bower.herokuapp.com"
  		]
	},
	"resolvers": [
  	"bower-art-resolver"
	]
}
```
* Add `d2l-media-behavior` to `bower.json` with the appropriate version.
* `npm install`
* `bower install`
* Import it into your Polymer component: 
```
<link rel="import" href="path/to/bower_components/d2l-media-behavior/d2l-media-behavior.html">
```
* Use it in your Polymer component:
```
behaviors: [
	D2LMediaBehavior
]
```

## Development

* `npm install`
* `npm start`
* Visit http://localhost:9998/components/d2l-media-behavior/demo/
