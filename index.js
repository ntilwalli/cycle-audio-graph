'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _virtualAudioGraph = require('virtual-audio-graph');

var _virtualAudioGraph2 = _interopRequireDefault(_virtualAudioGraph);

var _xstream = require('xstream');

var _xstream2 = _interopRequireDefault(_xstream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$audioContext = _ref.audioContext,
      audioContext = _ref$audioContext === undefined ? new AudioContext() : _ref$audioContext,
      _ref$output = _ref.output,
      output = _ref$output === undefined ? audioContext.destination : _ref$output;

  var virtualAudioGraph = (0, _virtualAudioGraph2.default)({ audioContext: audioContext, output: output });
  return function (nodeParams$) {
    return _xstream2.default.fromObservable(nodeParams$).subscribe({
      next: function next(nodeParams) {
        return virtualAudioGraph.update(nodeParams);
      },
      error: function error(e) {},
      complete: function complete() {}
    });
  };
};
