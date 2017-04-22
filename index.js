'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _virtualAudioGraph = require('virtual-audio-graph');

var _virtualAudioGraph2 = _interopRequireDefault(_virtualAudioGraph);

var _xstream = require('xstream');

var _xstream2 = _interopRequireDefault(_xstream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var micSource = void 0;

function makeListener(audioCtx) {
  return function (fftSize, interval) {
    var userAudioMedia$ = void 0;
    if (micSource) {
      userAudioMedia$ = _xstream2.default.of(micSource);
    } else {
      userAudioMedia$ = _xstream2.default.create({
        start: function start(listener) {
          navigator.getUserMedia({ audio: true }, function (stream) {
            micSource = stream;
            listener.next(startMicrophone(stream));
          }, function (err) {
            return listener.error(err);
          });
        },
        stop: function stop(_) {}
      });
    }

    var source = audioCtx.createMediaStreamSource(stream);
    var analyser = audioCtx.createAnalyser();

    source.connect(analyser);

    analyser.fftSize = fftSize;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var timerId = void 0;

    var fft$ = userAudioMedia$.map(function (_) {
      return _xstream2.default.create({
        start: function start(listener) {
          function draw() {
            analyser.getByteTimeDomainData(dataArray);
            listener.next(dataArray);
          }
          timerId = setInterval(draw, interval);
        },

        stop: function stop() {
          clearInterval(timerId);
        }
      });
    }).flatten();

    return fft$;
  };
}

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$audioContext = _ref.audioContext,
      audioContext = _ref$audioContext === undefined ? new AudioContext() : _ref$audioContext,
      _ref$output = _ref.output,
      output = _ref$output === undefined ? audioContext.destination : _ref$output;

  var virtualAudioGraph = (0, _virtualAudioGraph2.default)({ audioContext: audioContext });
  return function (nodeParams$) {
    _xstream2.default.fromObservable(nodeParams$).subscribe({
      next: function next(nodeParams) {
        return virtualAudioGraph.update(nodeParams);
      },
      error: function error(e) {},
      complete: function complete() {}
    });

    return {
      listen: makeListener(audioContext)
    };
  };
};
