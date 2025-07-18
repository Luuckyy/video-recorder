'use strict';

var core = require('@capacitor/core');

exports.VideoRecorderCamera = void 0;
(function (VideoRecorderCamera) {
    VideoRecorderCamera[VideoRecorderCamera["FRONT"] = 0] = "FRONT";
    VideoRecorderCamera[VideoRecorderCamera["BACK"] = 1] = "BACK";
})(exports.VideoRecorderCamera || (exports.VideoRecorderCamera = {}));
exports.VideoRecorderQuality = void 0;
(function (VideoRecorderQuality) {
    VideoRecorderQuality[VideoRecorderQuality["MAX_480P"] = 0] = "MAX_480P";
    VideoRecorderQuality[VideoRecorderQuality["MAX_720P"] = 1] = "MAX_720P";
    VideoRecorderQuality[VideoRecorderQuality["MAX_1080P"] = 2] = "MAX_1080P";
    VideoRecorderQuality[VideoRecorderQuality["MAX_2160P"] = 3] = "MAX_2160P";
    VideoRecorderQuality[VideoRecorderQuality["HIGHEST"] = 4] = "HIGHEST";
    VideoRecorderQuality[VideoRecorderQuality["LOWEST"] = 5] = "LOWEST";
    VideoRecorderQuality[VideoRecorderQuality["QVGA"] = 6] = "QVGA";
})(exports.VideoRecorderQuality || (exports.VideoRecorderQuality = {}));

const VideoRecorder = core.registerPlugin('VideoRecorder', {
    web: () => Promise.resolve().then(function () { return web; }).then(m => new m.VideoRecorderWeb()),
});

class DropShadow {
    constructor(options = {}) {
        this.opacity = options.opacity || 0;
        this.radius = options.radius || 0;
        this.color = hexToRgb(options.color || '#000000') || '#000000';
        function hexToRgb(hex) {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (_m, r, g, b) {
                return r + r + g + g + b + b;
            });
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
        }
    }
}
class FrameConfig {
    constructor(options = {}) {
        this.id = options.id;
        this.stackPosition = options.stackPosition || 'back';
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 'fill';
        this.height = options.height || 'fill';
        this.borderRadius = options.borderRadius || 0;
        this.dropShadow = new DropShadow(options.dropShadow);
    }
}
class VideoRecorderWeb extends core.WebPlugin {
    constructor() {
        super();
        this.previewFrameConfigs = [];
        this.currentFrameConfig = new FrameConfig({ id: 'default' });
    }
    _initializeCameraView() {
        this.videoElement = document.createElement('video');
        this.videoElement.autoplay = true;
        this.videoElement.hidden = true;
        this.videoElement.style.cssText = `
			object-fit: cover;
			pointer-events: none;
			position: absolute;
		`;
        document.body.appendChild(this.videoElement);
        this._updateCameraView(this.currentFrameConfig);
    }
    _updateCameraView(config) {
        var _a, _b, _c;
        this.videoElement.style.width = config.width === 'fill' ? '100vw' : `${config.width}px`;
        this.videoElement.style.height = config.height === 'fill' ? '100vh' : `${config.height}px`;
        this.videoElement.style.left = `${config.x}px`;
        this.videoElement.style.top = `${config.y}px`;
        this.videoElement.style.zIndex = config.stackPosition === 'back' ? '-1' : '99999';
        this.videoElement.style.borderRadius = `${config.borderRadius}px`;
        this.videoElement.style.boxShadow = `0 0 ${(_a = config.dropShadow) === null || _a === void 0 ? void 0 : _a.radius}px 0 rgba(${(_b = config.dropShadow) === null || _b === void 0 ? void 0 : _b.color}, ${(_c = config.dropShadow) === null || _c === void 0 ? void 0 : _c.opacity})`;
    }
    async initialize(options) {
        var _a, _b;
        console.warn('VideoRecorder: Web implementation is currently for mock purposes only, recording is not available');
        const previewFrames = ((_a = options === null || options === void 0 ? void 0 : options.previewFrames) === null || _a === void 0 ? void 0 : _a.length) !== undefined && ((_b = options === null || options === void 0 ? void 0 : options.previewFrames) === null || _b === void 0 ? void 0 : _b.length) > 0 ? options === null || options === void 0 ? void 0 : options.previewFrames : [{ id: 'default' }];
        this.previewFrameConfigs = previewFrames === null || previewFrames === void 0 ? void 0 : previewFrames.map(config => new FrameConfig(config));
        this.currentFrameConfig = this.previewFrameConfigs[0];
        this._initializeCameraView();
        if ((options === null || options === void 0 ? void 0 : options.autoShow) !== false) {
            this.videoElement.hidden = false;
        }
        if (navigator.mediaDevices.getUserMedia) {
            this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.videoElement.srcObject = this.stream;
        }
        return Promise.resolve();
    }
    destroy() {
        var _a, _b;
        (_a = this.videoElement) === null || _a === void 0 ? void 0 : _a.remove();
        this.previewFrameConfigs = [];
        this.currentFrameConfig;
        (_b = this.stream) === null || _b === void 0 ? void 0 : _b.getTracks().forEach(track => track.stop());
        return Promise.resolve();
    }
    flipCamera() {
        console.warn('VideoRecorder: No web mock available for flipCamera');
        return Promise.resolve();
    }
    addPreviewFrameConfig(config) {
        if (this.videoElement) {
            if (!config.id) {
                return Promise.reject('id required');
            }
            const newFrame = new FrameConfig(config);
            if (this.previewFrameConfigs.map(config => config.id).indexOf(newFrame.id) === -1) {
                this.previewFrameConfigs.push(newFrame);
            }
            else {
                this.editPreviewFrameConfig(config);
            }
        }
        return Promise.resolve();
    }
    editPreviewFrameConfig(config) {
        if (this.videoElement) {
            if (!config.id) {
                return Promise.reject('id required');
            }
            const updatedFrame = new FrameConfig(config);
            const existingIndex = this.previewFrameConfigs.map(config => config.id).indexOf(updatedFrame.id);
            if (existingIndex !== -1) {
                this.previewFrameConfigs[existingIndex] = updatedFrame;
            }
            else {
                this.addPreviewFrameConfig(config);
            }
            if (this.currentFrameConfig.id == config.id) {
                this.currentFrameConfig = updatedFrame;
                this._updateCameraView(this.currentFrameConfig);
            }
        }
        return Promise.resolve();
    }
    switchToPreviewFrame(options) {
        if (this.videoElement) {
            if (!options.id) {
                return Promise.reject('id required');
            }
            const config = this.previewFrameConfigs.filter(config => config.id === options.id);
            if (config.length > 0) {
                this._updateCameraView(config[0]);
            }
            else {
                return Promise.reject('id not found');
            }
        }
        return Promise.resolve();
    }
    showPreviewFrame() {
        if (this.videoElement) {
            this.videoElement.hidden = false;
        }
        return Promise.resolve();
    }
    hidePreviewFrame() {
        if (this.videoElement) {
            this.videoElement.hidden = true;
        }
        return Promise.resolve();
    }
    startRecording() {
        console.warn('VideoRecorder: No web mock available for startRecording');
        return Promise.resolve();
    }
    stopRecording() {
        console.warn('VideoRecorder: No web mock available for stopRecording');
        return Promise.resolve({ videoUrl: 'some/file/path' });
    }
    getDuration() {
        return Promise.resolve({ value: 0 });
    }
    addListener() {
        console.warn('VideoRecorder: No web mock available for addListener');
    }
    toggleFlash() {
        console.warn('VideoRecorder: No web mock available for toggleFlash');
        return Promise.resolve();
    }
    enableFlash() {
        console.warn('VideoRecorder: No web mock available for enableFlash');
        return Promise.resolve();
    }
    disableFlash() {
        console.warn('VideoRecorder: No web mock available for disableFlash');
        return Promise.resolve();
    }
    isFlashEnabled() {
        console.warn('VideoRecorder: No web mock available for isFlashEnabled');
        return Promise.resolve({ isEnabled: false });
    }
    isFlashAvailable() {
        console.warn('VideoRecorder: No web mock available for isFlashAvailable');
        return Promise.resolve({ isAvailable: false });
    }
}

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    VideoRecorderWeb: VideoRecorderWeb
});

exports.VideoRecorder = VideoRecorder;
//# sourceMappingURL=plugin.cjs.js.map
