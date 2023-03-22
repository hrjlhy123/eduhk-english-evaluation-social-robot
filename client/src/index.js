import React from 'react'
import ReactDOM from 'react-dom/client'
import Html5Recorder from 'chivox_h5sdk/src/html5/html5recorder'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'
import Page1 from './page/mode selection'
import Page2 from './page/story mode 1&2'
import Page3 from './page/score'
import Page4 from './page/score details'
import Page5 from './page/chapter selection'
import Page6 from './page/story mode 3'
import ReactPWAInstallProvider from 'react-pwa-install'

// Scorer initialization
export let recorderInit = []
export const recorder = [
  new Html5Recorder({
    server: 'wss://cloud.chivox.com',
    appKey: '1649755076000093',
    sigurl: '/key',
    onInit: mess => {
      console.log('Sentence Scoring API onInit success')
      recorderInit[0] = mess
    },
    onError: err => { console.log('onError: ' + err) }
  }),
  new Html5Recorder({
    server: 'wss://cloud.chivox.com',
    appKey: '1649755076000093',
    sigurl: '/key',
    onInit: mess => {
      console.log('Free Scoring API onInit success')
      recorderInit[1] = mess
    },
    onError: err => { console.log('onError: ' + JSON.stringify(err)) }
  })
]

/* Resource import function */
// Method 2 is preload
export function hrjlhy_import(method, [...parameters]) {
  switch (method) {
    // Format: [src1, src2, ...]
    case 1:
      {
        return parameters[0].keys().map(parameters[0])
      }
    // Format: [{class: className1, src: src1}, {class: className2, src: src2}, ...]
    case 2:
      {
        let res = [], res_preload = [], url = [], name = []
        parameters[1] = hrjlhy_import(1, [parameters[1]])
        for (var n in parameters[1]) {
          name[n] = parameters[1][n].split('/').pop().split('.')[0]
          // import image/audio
          switch (parameters[0]) {
            case 'image':
              res_preload[n] = new Image()
              break
            case 'audio':
              res_preload[n] = new Audio()
              res_preload[n].preload = 'metadata'
              break
            default: break
          }
          res_preload[n].src = url[n] = parameters[1][n]
          res[n] = { class: name[n], src: url[n] }
        }
        return res
      }
    // Format: {className1: src1, className2: src2, ...}
    case 3:
      {
        let res = {}, res_preload = [], url = [], name = []
        parameters[1] = hrjlhy_import(1, [parameters[1]])
        for (var o in parameters[1]) {
          name[o] = parameters[1][o].split('/').pop().split('.')[0]
          // import image
          switch (parameters[0]) {
            case 'image':
              res_preload[o] = new Image()
              break
            case 'audio':
              res_preload[o] = new Audio()
              res_preload[o].preload = 'metadata'
              break
            default: break
          }
          res_preload[o].src = url[o] = parameters[1][o]
          res[name[o]] = url[o]
        }
        return res
      }
    default:
      console.error('Method of import:\n  1. [src1, src2, ...] \n  2. [{className1: src1}, {className2: src2}, ...] \n  3. {className1: src1, className2: src2, ...}')
      break;
  }
}
export const imagesURL_page1 = hrjlhy_import(2, ['image', require.context('./resources/images/Page1/', false, /\.(avif|svg|png|jpe?g)$/)])
export const imagesURL_page2 = hrjlhy_import(2, ['image', require.context('./resources/images/Page2/', false, /\.(avif|svg|png|jpe?g)$/)])
export const imagesURL_page3 = hrjlhy_import(2, ['image', require.context('./resources/images/Page3/', false, /\.(avif|svg|png|jpe?g)$/)])
export const imagesURL_page4 = hrjlhy_import(2, ['image', require.context('./resources/images/Page4/', false, /\.(avif|svg|png|jpe?g)$/)])
export const imagesURL_page5 = hrjlhy_import(2, ['image', require.context('./resources/images/Page5/', false, /\.(avif|svg|png|jpe?g)$/)])
export const imagesURL_page6 = hrjlhy_import(2, ['image', require.context('./resources/images/Page6/', false, /\.(avif|svg|png|jpe?g)$/)])
export const storyimagesURL1 = hrjlhy_import(2, ['image', require.context('./resources/images/Page2/story/', false, /\.(avif|svg|png|jpe?g)$/)])
export const storyimagesURL2 = hrjlhy_import(2, ['image', require.context('./resources/images/screenshots/', false, /\.(avif|svg|png|jpe?g)$/)])
export const storyvoicesURL = hrjlhy_import(2, ['audio', require.context('./resources/audio/story/', false, /\.(ogg|wav|mp3)$/)])
export const tipsvoicesURL = hrjlhy_import(2, ['audio', require.context('./resources/audio/tips/', false, /\.(ogg|wav|mp3)$/)])
export const imagesURL_animation = hrjlhy_import(3, ['image', require.context('./resources/images/animation', false, /\.(avif|svg|png|jpe?g)$/)])
export const imagesURL_animation_preload = hrjlhy_import(2, ['image', require.context('./resources/images/animation/', false, /\.(avif|svg|png|jpe?g)$/)])

/* URL inquiry function */
export function getURLParameter(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <ReactPWAInstallProvider enableLogging>
    <Router>
      <Routes>
        <Route path='/' element={<Page2 introFlag={true} />} />
        <Route path='/Page1' element={<Page1 />} />
        <Route path='/Page2' element={<Page2 />} />
        <Route path='/Page3' element={<Page3 />} />
        <Route path='/Page4' element={<Page4 />} />
        <Route path='/Page5' element={<Page5 />} />
        <Route path='/Page6' element={<Page6 />} />
      </Routes>
    </Router>
  </ReactPWAInstallProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
