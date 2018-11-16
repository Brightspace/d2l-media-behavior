import { IronRangeBehavior } from '@polymer/iron-range-behavior/iron-range-behavior.js';
import '@polymer/iron-ajax/iron-ajax.js';
window.D2L = window.D2L || {};
/** @polymerBehavior window.D2L.MediaBehavior */
window.D2L.MediaBehaviorImpl = {
	/**
	 * Fired when play fails
	 *
	 * @event d2l-media-play-error
	 */
	properties: {
		src: {
			type: String,
			value: ''
		},
		autoLoad: {
			type: Boolean,
			value: false
		},
		autoplay: {
			type: Boolean,
			value: false
		},
		currentTime: {
			type: Number,
			value: 0,
			notify: true
		},
		duration: {
			type: Number,
			value: 0
		},
		requestSrc: {
			type: Boolean,
			value: false
		},
		volume: {
			type: Number,
			value: 1.0,
			observer: '_volumeChanged'
		},
		mediaStatus: {
			type: String,
			value: 'ready'
		},
		mimeType: {
			type: String,
			value: ''
		},
		isPlaying: {
			type: Boolean,
			value: false
		},
		ended: {
			type: Boolean,
			value: false
		},
		percentComplete: {
			type: Number,
			value: 0
		},
		seeking: {
			type: Boolean,
			value: false
		},
		immediateValue: {
			type: Number,
			value: 0
		},
		startedLoad: {
			type: Boolean,
			value: false
		},
		firstPlay: {
			type: Boolean,
			value: true
		}
	},

	observers: [
		'_srcChanged(src, requestSrc, autoLoad, mimeType)'
	],

	ready: function() {
		this._resetPlayer();
		var media = this.$.media;
		media.volume = this.volume;

		this._boundOnCanPlay = this._onCanPlay.bind(this);
		this._boundOnPlaying = this._onPlaying.bind(this);
		this._boundOnPause = this._onPause.bind(this);
		this._boundOnEnd = this._onEnd.bind(this);
		this._boundOnError = this._onError.bind(this);
	},

	attached: function() {
		this.$.media.addEventListener('loadedmetadata', this._boundOnCanPlay);
		this.$.media.addEventListener('playing', this._boundOnPlaying);
		this.$.media.addEventListener('pause', this._boundOnPause);
		this.$.media.addEventListener('ended', this._boundOnEnd);
		this.$.media.addEventListener('error', this._boundOnError);
	},

	detached: function() {
		this.$.media.removeEventListener('loadedmetadata', this._boundOnCanPlay);
		this.$.media.removeEventListener('playing', this._boundOnPlaying);
		this.$.media.removeEventListener('pause', this._boundOnPause);
		this.$.media.removeEventListener('ended', this._boundOnEnd);
		this.$.media.removeEventListener('error', this._boundOnError);
	},

	_srcChanged: function(src, requestSrc, autoLoad, mimeType) {
		this.canBePlayed = false;
		this.startedLoad = false;
		this.$.media.src = '';

		if (!this.mediaUrlRequest) {
			var mediaUrlRequest = document.createElement('iron-ajax');
			mediaUrlRequest.contentType = 'application/json';
			mediaUrlRequest.handleAs = 'json';
			mediaUrlRequest.method = 'get';
			this.mediaUrlRequest = mediaUrlRequest;
		}

		if (mimeType === 'application/x-d2l-video') {
			requestSrc = true;
		}

		if (requestSrc) {
			this.mediaUrlRequest.url = src;
			if (autoLoad) {
				this._requestMediaUrl(false);
			}
		} else {
			this._resetPlayer();
			this.$.media.src = src;
		}
	},

	_resetPlayer: function() {
		this.isPlaying = false;
		this.ended = false;
		this.percentComplete = 0;
		this.seeking = false;
		this.immediateValue = 0;
		this.currentTime = 0;
		this.startedLoad = false;
		this.firstPlay = true;
	},

	_volumeChanged: function(volume) {
		this.$.media.volume = volume;
	},

	_requestMediaUrl: function(playAfterLoad) {
		var self = this;

		return this.mediaUrlRequest.generateRequest().completes
			.then(function(event) {
				if (!event.response || !event.response.url) {
					self.mediaStatus = 'invalidManifest';
					return;
				}
				if (event.response.status) {
					self.mediaStatus = event.response.status;
				}
				self.$.media.src = event.response.url;
				self.startedLoad = true;
				self.$.media.load();

				if (playAfterLoad) {
					return self._playHandler(self.$.media.play());
				}
			})
			.catch(function() {
				self.mediaStatus = 'error';
			});
	},

	_playPause: function(event) {
		if (event) {
			event.preventDefault();
		}

		var media = this.$.media;
		if (this.canBePlayed) {
			return this.isPlaying ? media.pause() : this._playHandler(media.play());
		} else if (!this.autoLoad) {
			if (this.requestSrc) {
				this._requestMediaUrl(true);
			} else if (!this.startedLoad) {
				this.startedLoad = true;
				media.load();
				return this._playHandler(media.play());
			}
		}
	},

	_playHandler: function(playPromise) {
		var self = this;
		if (playPromise) {
			playPromise.catch(function(error) {
				self.dispatchEvent(new CustomEvent('d2l-media-play-error', {
					bubbles: true,
					cancelable: true,
					detail: { error: error }
				}));
			});
		}
	},

	_getFormattedTime: function() {
		return this._formatTime(this.firstPlay ? this.duration : this._getImmediateTime());
	},

	_getImmediateTime: function() {
		return this.duration * (this.immediateValue / 100);
	},

	_formatTime: function(seconds) {
		if (seconds === 0) {
			return '0:00';
		}

		var minutes = Math.floor(seconds / 60);
		var secondsLeft = String(Math.floor(seconds % 60));
		return minutes + ':' + (secondsLeft.length < 2 ? '0' + secondsLeft : secondsLeft);
	},

	_onSeekStart: function() {
		this.seeking = true;
	},

	_onSeekEnd: function() {
		if (this.seeking) {
			this._updatePlayPosition(this._getImmediateTime());
			this.seeking = false;
		}
	},

	_onCanPlay: function() {
		this.canBePlayed = true;

		var media = this.$.media;
		this.duration = media.duration;
	},

	_onPlaying: function() {
		this.firstPlay = false;
		this.ended = false;
		this.isPlaying = true;
		this._startProgressTimer();
	},

	_onPause: function() {
		this.isPlaying = false;
	},

	_onEnd: function() {
		this.ended = true;
		this.isPlaying = false;
	},

	_onError: function() {

	},

	_updatePlayPosition: function(newTime) {
		var media = this.$.media;
		this.currentTime = media.currentTime = newTime;
	},

	_startProgressTimer: function() {
		var self = this;

		if (this.progressTimer) {
			clearInterval(this.progressTimer);
		}

		this.progressTimer = setInterval(function() {
			var media = self.$.media;
			if (self.isPlaying) {
				self.currentTime = media.currentTime;

				if (!self.seeking) {
					self.percentComplete = (self.currentTime / self.duration) * 100;
				}
			} else {
				clearInterval(self.progressTimer);
			}
		}, 60);
	},

	_getPreload: function() {
		return this.autoLoad ? 'auto' : 'none';
	},

	_getAutoplay: function() {
		return this.autoplay;
	}
};

/** @polymerBehavior */
window.D2L.MediaBehavior = [IronRangeBehavior, window.D2L.MediaBehaviorImpl];
