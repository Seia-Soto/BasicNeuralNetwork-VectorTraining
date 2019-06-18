'use static';

// NOTE: Modules
const brain = require('brain.js')
const fs = require('fs')
const lineReader = require('line-reader')
const path = require('path')

console.log('> Loaded all modules and loading preferences...')

// NOTE: Learning preferences
const dataDirectoryPath = path.join(__dirname, 'data')
const dataFilePath = path.join(dataDirectoryPath, 'data.json') // NOTE: This is file that neural network will saved.
const trainingsetFilePath = path.join(dataDirectoryPath, 'model.txt') // NOTE: Edit this line to define your model.
const definitionFilePath = path.join(dataDirectoryPath, 'definition.json') // NOTE: This is temporary file for saving line(in file) information.

const activationMethod = 'sigmoid'
const hiddenLayersSize = 256
const hiddenLayersNodes = 32
const learningRate = 0.42

const loadFromPreviousModel = true
const testCasePerBatch = 32
const trainingOption = {
  iterations: 2500, // NOTE: Maximum iterations per train.
  log: true,
  logPeriod: 5,
  learningRate: learningRate
}

let errorPresent = false

if (!fs.existsSync(dataDirectoryPath)) {
  console.log('> Creating directory for saving results...')
  fs.mkdirSync(dataDirectoryPath)

  errorPresent = true
}

if (!fs.existsSync(dataFilePath)) {
  console.log('= Data file is not exists on ' + dataFilePath)

  errorPresent = true
}
if (!fs.existsSync(trainingsetFilePath)) {
  console.log('> Training file is not exists on ' + trainingsetFilePath)

  errorPresent = true
}
if (!fs.existsSync(definitionFilePath)) {
  console.log('> Training file is not exists on ' + definitionFilePath)

  errorPresent = true
}

if (errorPresent) {
  console.log('= Pausing because error is present...')
  console.log('= Please run this app again for safety of data.')

  process.exit(0)
}

// NOTE: Initialize neuralnet.
const net = new brain.NeuralNetwork({
  activation: activationMethod, // activation function
  hiddenLayers: new Array(hiddenLayersNodes).fill(hiddenLayersSize),
  learningRate: learningRate // global learning rate, useful when training using streams
})

const trainNetwork = (network, input) => {
  // NOTE: Training part.
  console.log('* Training word (cursor): ' + input.word + ' (' + currentLine + ')')

  let batch = {
    input: input.vectors,
    output: {}
  }

  if (input.word.match('_')) {
    let types = input.word.split('_')

    input.word = types[0]

    types.slice(1).forEach(type => batch.output[type] = 1)
  }
  network.train(batch, trainingOption)
}
const testNetwork = (network, input) => {
  // NOTE: Prediction of word.
  console.log('* Predicting word (cursor): ' + input.word + ' (' + currentLine + ')')

  console.log(net.run(input.vectors))
}

// NOTE: If loading from previous model required:
if (loadFromPreviousModel) {
  net.fromJSON(JSON.parse(fs.readFileSync(dataFilePath)))
} else {
  fs.writeFileSync(dataFilePath, JSON.stringify({}), 'utf8')
  fs.writeFileSync(definitionFilePath, JSON.stringify({}), 'utf8')
}

let currentLine = 1
let lastLine = 1

const definition = JSON.parse(fs.readFileSync(definitionFilePath))

lastLine = definition.lastLine || lastLine

process.on('SIGINT', () => {
  console.log('> Stopping...')
  console.log('> Writing down results... (' + dataFilePath + ')')

  fs.writeFileSync(dataFilePath, JSON.stringify(net.toJSON()), 'utf8')

  // NOTE: Exit.
  process.exit(0)
})

lineReader.eachLine(trainingsetFilePath, line => {
  if (currentLine === lastLine) {
    if (currentLine === 1) {
      console.log('> Training words, vectors per word:' + line.split(' ')[0] + ', ' + line.split(' ')[1])
    } else {
      const values = line.split(' ')

      let word = values[0]
      let vectors = values.slice(1).map(vector => Number(vector))

      if (currentLine % testCasePerBatch == 0) {
        testNetwork(net, {
          word: word,
          vectors: vectors
        })
        trainNetwork(net, {
          word: word,
          vectors: vectors
        })
      } else {
        trainNetwork(net, {
          word: word,
          vectors: vectors
        })
      }
    }

    lastLine++
  }

  currentLine++

  fs.writeFileSync(definitionFilePath, JSON.stringify({lastLine: lastLine}), 'utf8')
})
