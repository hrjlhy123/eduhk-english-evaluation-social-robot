import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { imagesURL_page1, tipsvoicesURL } from '../index'
import '../resources/sass/App.sass'

export function Tipsbot(data) {
  const [svgWidth, setSvgwidth] = useState(329),
    [havetext, setHavetext] = useState('none')


  useEffect(() => {
    if (data.data.text) {
      setHavetext('initial')
      let tips_text = document.querySelector('.tipsText > span')
      setSvgwidth(tips_text.offsetWidth + 80)
    } else {
      setHavetext('none')
    }
  }, [data.data.text])

  useEffect(() => {
    if (data.data.audio) {
      let tips_audio = document.querySelector('.App-audio1-' + data.data.audio)
      tips_audio.play()
    }
  }, [data.data.audio])

  return (
    <div className="App-tipsbot" style={data.data.style}>
      {imagesURL_page1.map(item => {
        switch (item.class) {
          case 'special_icon1': return (<img src={item.src} className={'App-' + item.class} />)
          default: break
        }
      })
      }
      {tipsvoicesURL.map(item => { return <audio className={'App-audio1 App-audio1-' + item.class}><source src={item.src} type='audio/wav' preload='auto' /></audio> })}
      <div className='App-special_icon2'>
        <p className='tipsText'><span>{data.data.text}</span></p>
        <svg width={svgWidth} height='11.55vh' style={{ display: havetext }}>
          <svg y="6.66666666666667vh" width="4.11458333333333vw" height="3.7037037037037vh" viewBox="0 0 79 40">
            <path d="M4.33198 28.8581L32.5217 -0.0012544L78.3995 24.9142L17.8215 37.7917C13.9373 38.9168 6.32038 41.2716 2.02059 38.442C-2.2792 35.6123 1.76994 30.8737 4.33198 28.8581Z" fill="white" />
          </svg>
          <rect x='1.04166666666667vw' width={svgWidth - 20} height='9.90740740740741vh' rx='4.9537037037037vh' fill='white' />
        </svg>
      </div>
    </div>
  )
}

function Page1() {
  const [images, setImages] = useState(imagesURL_page1),
    [tipsText, setTipstext] = useState(''),
    [tipsAudio, setTipsAudio] = useState('')

  useEffect(() => {
    setTimeout(() => {
      setTipstext('Select story mode')
      setTipsAudio('tips_05')
    }, 8000);
  }, [])

  /* Session storage clear */
  sessionStorage.clear();

  return (
    <div className='App-Page1'>
      <svg className='App-title App-title1' viewBox={'0 0 ' + 600 + ' ' + 80}>
        <text x={0} y={60} stroke={'#fff'} strokeWidth={8} paint-order={"stroke"}>The Three Little Pigs</text>
      </svg>
      <p className='App-subhead App-subhead1'>Resource: Little FOX</p>
      <div>
        {images.map(item => {
          switch (item.class) {
            case 'icon1': return (<Link to='/'><img src={item.src} className={'App-' + item.class} /></Link>)
            case 'selection1': return (<Link to='/Page2'><img src={item.src} className={'App-' + item.class} /></Link>)
            case 'selection2': return (<Link to='/Page5'><img src={item.src} className={'App-' + item.class} /></Link>)
            case 'selection3': return (<Link to='/Page6'><img src={item.src} className={'App-' + item.class} /></Link>)
            case 'special_icon1': break
            default: return <img src={item.src} className={'App-' + item.class} />
          }
        })}
      </div>
      <Tipsbot data={{ text: tipsText, audio: tipsAudio }}></Tipsbot>
    </div >
  )
}

export default Page1
