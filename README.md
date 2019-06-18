# Vector training of Basic Neural Network

This is an example source code of how to train vectors in Brain.JS with Neural Network (very simple).

## Preferences

You can find preferences below require statements at `index.js`.

### Datas

- dataDirectoryPath: Default directory for archives. (default: `data`)
- dataFilePath: This is file that neural network will saved. (default: `data.json`)
- trainingsetFilePath: Edit this line to define your model. (default: `model.txt`, type: `Gensim Continuous Skipgram (vector size 300)`, [download from NLPL word embeddings repository](http://vectors.nlpl.eu/repository/))
- definitionFilePath: This is temporary file for saving line(in file) information.

### Training

- activationMethod: Method to activate neurons in your network. (default: `sigmoid`)
- hiddenLayersSize: How many neurons to use in training. (default: `256`)
- hiddenLayersNodes: How many layers you want to use in training. (default: `32`)
- learningRate: learningRate of network. (default: `0.42`)

### Others

- loadFromPreviousModel: **You need to set this *false* at first time to initialize and save network.** If you want to load network saves from `dataFilePath`. **If this set to false, you'll lose all data trained at start.** (default: `true`)
- testCasePerBatch: How many times you want to train network per running uninitialized word. (default: `32`)
- trainingOption: from Brain.JS*
  - iterations: Maximum iterations per training.
  - log: If you want to log status of training.

## Initialization

Before we begin, you need to know one fact that training will stop after completion of current train(one word) when you send `SIGINT` signal to console that means your data will be saved safety after done of active training node.

1. Download model from online or local source and locate it to `data/model.txt`.
2. Set `loadFromPreviousModel` to `false` and test this is running correctly.
3. After running you'll get values from console, and set `loadFromPreviousModel` to `true` to save your data next time. **As I said at preferences section, you'll lose all data if you run training with this option set to `false`.**
