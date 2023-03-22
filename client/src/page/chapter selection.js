import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { imagesURL_page1, imagesURL_page5 } from '../index'
import '../resources/sass/App.sass'
import { Tipsbot } from './mode selection'

function Page5() {
  const [images, setImages] = useState(imagesURL_page5),
  [imagesreuse, setImagesreuse] = useState(imagesURL_page1),
  [tipsText, setTipstext] = useState(''),
  [tipsAudio, setTipsAudio] = useState('')

  useEffect(() => {
    setTimeout(() => {
      setTipstext('Which animals would you like to roleplay?')
      setTipsAudio('tips_07')
    }, 8000);
  }, [])

  return (
    <div className='App-Page5'>
      <svg className='App-title App-title4' viewBox={'0 0 ' + 526 + ' ' + 64}>
        <text x={2} y={60} stroke={'#fff'} strokeWidth={8} paint-order={"stroke"}>Select character to use</text>
      </svg>
      {imagesreuse.map(item => {
        switch (item.class) {
          case 'background1':
          case 'special_icon1': break
          case 'icon1': return (<Link to='/Page1'><img src={item.src} className={'App-' + item.class} /></Link>)
          default: break;
        }
      })}
      {images.map(item => {
        switch (item.class) {
          // Select character
          case 'selection4': return (<Link to='/Page2?character=Curly'><img src={item.src} className={'App-' + item.class} /></Link>)
          case 'selection5': return (<Link to='/Page2?character=Willis'><img src={item.src} className={'App-' + item.class} /></Link>)
          default: return (<img src={item.src} className={'App-' + item.class} />)
        }
      })}
      <Tipsbot data={{ text: tipsText, audio: tipsAudio }}></Tipsbot>
    </div>
  )

}
export default Page5