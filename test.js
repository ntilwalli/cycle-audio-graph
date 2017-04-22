require('web-audio-test-api')
WebAudioTestAPI.setState({
  'AudioContext#createStereoPanner': 'enabled',
  'AnalyserNode#getFloatTimeDomainData': 'enabled'
})
const xs = require('xstream').default
const test = require('tape')
const makeAudioGraphDriver = require('./').default
const run = require('@cycle/run').run
const setup = require('@cycle/run').setup
const setAdapt = require('@cycle/run/lib/adapt').setAdapt

const audioContext = new AudioContext()

const audioGraphDriver = makeAudioGraphDriver({
  audioContext,
  output: audioContext.destination
})

test('it works', t => {
  audioGraphDriver(xs.of({
    0: ['gain', 'output', {gain: 0.2}],
    1: ['oscillator', 0, {type: 'square', frequency: 440}]
  }))
  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [
      {
        gain: {inputs: [], value: 0.2},
        inputs: [
          {
            detune: {value: 0, inputs: []},
            frequency: {value: 440, inputs: []},
            inputs: [],
            name: 'OscillatorNode',
            type: 'square'
          }
        ],
        name: 'GainNode'
      }
    ]
  })

  audioGraphDriver(xs.of({
    0: ['gain', 'output', {gain: 0.1}],
    1: ['oscillator', 0, {type: 'sine', frequency: 220}]
  }))
  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [
      {
        gain: {inputs: [], value: 0.1},
        inputs: [
          {
            detune: {value: 0, inputs: []},
            frequency: {value: 220, inputs: []},
            inputs: [],
            name: 'OscillatorNode',
            type: 'sine'
          }
        ],
        name: 'GainNode'
      }
    ]
  })

  audioGraphDriver(xs.of({}))
  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: []
  })

  audioGraphDriver(xs.of({
    0: ['gain', 'output', {gain: 0.2}],
    1: ['oscillator', 0, {type: 'square', frequency: 440}]
  }))
  t.deepEqual(audioContext.toJSON(), {
    name: 'AudioDestinationNode',
    inputs: [
      {
        gain: {inputs: [], value: 0.2},
        inputs: [
          {
            detune: {value: 0, inputs: []},
            frequency: {value: 440, inputs: []},
            inputs: [],
            name: 'OscillatorNode',
            type: 'square'
          }
        ],
        name: 'GainNode'
      }
    ]
  })
  t.end()
})

// test('mic input', t => {

//     let dispose
//     function app(sources) {
//       const mic$ = sources.Audio.listen({
//         fftSize: 256,
//         interval: 1000
//       }).take(3)

//       let count = 0;
//       mic$.subscribe(val => {
//         console.log('val', val)
//         count++
//         if (count === 3) {
//           assert.ok(true)
//           dispose()
//           done()
//         }
//       })

//       return {
//         Audio: xs.never(),
//       };
//     }

//     const {sinks, sources, run} = setup(app, {
//       Audio: audioGraphDriver()
//     });

//     dispose = run();
// })
