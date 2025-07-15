import { registerPlugin } from '@capacitor/core';
const VideoRecorder = registerPlugin('VideoRecorder', {
    web: () => import('./web').then(m => new m.VideoRecorderWeb()),
});
export { VideoRecorder };
export { VideoRecorderCamera, VideoRecorderQuality } from './definitions';
//# sourceMappingURL=index.js.map