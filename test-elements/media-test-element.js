/**
`media-test-element`
@demo demo/index.html
*/
import '@polymer/polymer/polymer-legacy.js';

import '../d2l-media-behavior.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier3-icons.js';
import '@d2l/seek-bar/d2l-seek-bar.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="media-test-element">
  <template strip-whitespace="">
		<style>
			[hidden] {
				display: none;
			}
		</style>
		<video id="media" preload="{{ _getPreload(autoLoad) }}" poster="{{ poster }}"></video>

		<div id="controlBar">
			<div class="control play-pause-container">
				<d2l-icon hidden$="[[ isPlaying ]]" icon="d2l-tier3:play" on-tap="_playPause"></d2l-icon>
				<d2l-icon hidden$="[[ !isPlaying ]]" icon="d2l-tier3:pause" on-tap="_playPause"></d2l-icon>
			</div>
			<div class="seek-control">
				<d2l-seek-bar value="[[ percentComplete ]]" immediate-value="{{ immediateValue }}" on-drag-start="_onSeekStart" on-drag-end="_onSeekEnd"></d2l-seek-bar>
			</div>
			<div class="time control">{{ _formatTime(currentTime) }} / {{ _formatTime(duration) }}</div>
		</div>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'media-test-element',
	behaviors: [
		window.D2L.MediaBehavior
	],
	properties: {
		poster: String
	}
});
