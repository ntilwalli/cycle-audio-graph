import createVirtualAudioGraph from 'virtual-audio-graph'
import xs from 'xstream'

export default ({audioContext = new AudioContext(),
                 output = audioContext.destination} = {}) => {
  const virtualAudioGraph = createVirtualAudioGraph({audioContext, output})
  return nodeParams$ => xs.fromObservable(nodeParams$).subscribe({
    next: nodeParams => virtualAudioGraph.update(nodeParams),
    error: e => {},
    complete: () => {}
  })
}
