# Salesforce Voice Assistant App with React Native and Wit.ai

A basic React Native app implemented with:

- [React Native](https://reactnative.dev/)
- [forcereact](https://www.npmjs.com/package/forcereact)
- [react-native-audio-record](https://www.npmjs.com/package/react-native-audio-record)
- [Wit.ai](https://wit.ai/)

## Installation

The app works in OS X and requires this

Prerequisites:

- [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/get-npm)
- [Yarn](https://yarnpkg.com/)
- [cocoapods](https://cocoapods.org/)
- [react native cli](https://www.npmjs.com/package/react-native-cli)
- [Xcode](https://developer.apple.com/xcode/)

Install

1. Clone the project and open the root folder. Run:

```bash
npm install
```

2. Go /ios folder and do:

```bash
pod install
```

3. Go to the root folder and update /app.js with Wit.ai app Token

4. Go to the root folder and do

```bash
npm start --reset-cache
```

5. Open /ios/fbHackaton.xcworkspace and do Run

## Usage

1. Open the app and press Start Recording
2. Tell commands like "show five contacts"
3. press Stop Recording

See [video](https://www.youtube.com/watch?v=qUPdX-HaafM)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

The MIT License (MIT)

Copyright (c) 2020 Mikhail Vargo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
