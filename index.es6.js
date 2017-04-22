import createVirtualAudioGraph from 'virtual-audio-graph'
import xs from 'xstream'

let micSource

function makeListener(audioCtx) {
  return (fftSize, interval) => {
    let userAudioMedia$
    if (micSource) {
      userAudioMedia$ = xs.of(micSource)
    } else {
      userAudioMedia$ = xs.create({
        start: listener => {
          navigator.getUserMedia({audio: true},
              stream => 
              {
                micSource = stream
                listener.next(startMicrophone(stream))
              } ,
              err => listener.error(err)
          )
        },
        stop: _ => {}
      })
    }

    const source = audioCtx.createMediaStreamSource(micSource);
    const analyser = audioCtx.createAnalyser();

    source.connect(analyser);

    analyser.fftSize = fftSize;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let timerId

    const fft$ = userAudioMedia$.map(_ => xs.create({
        start: (listener) => {
          function draw() {
              analyser.getByteTimeDomainData(dataArray)
              listener.next(dataArray)
          }
          timerId = setInterval(draw, interval)
        },

        stop: () => {
          clearInterval(timerId)
        }
    })).flatten()

    return fft$
  }
}

export default ({audioContext = new AudioContext(),
                 output = audioContext.destination} = {}) => {
  const virtualAudioGraph = createVirtualAudioGraph({audioContext})
  return nodeParams$ => {
    xs.fromObservable(nodeParams$).subscribe({
      next: nodeParams => virtualAudioGraph.update(nodeParams),
      error: e => {},
      complete: () => {}
    })

    return {
      listen: makeListener(audioContext)
    }
  }
}
