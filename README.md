# media-behavior

A Polymer behavior for media players.

## Usage

* Install [bower-art-resolver](https://www.npmjs.com/package/bower-art-resolver).
* Create a `.bowerrc` file in your project:
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
* Install `d2l-media-behavior` with Bower.
* Run `npm install`
* Run `bower install`
* Import and use the behavior in a Polymer component:
```
<link rel="import" href="path/to/bower_components/d2l-media-behavior/d2l-media-behavior.html">

...

Polymer({
	is: 'my-media-component',
	behaviors: [D2LMediaBehavior]
});
```
