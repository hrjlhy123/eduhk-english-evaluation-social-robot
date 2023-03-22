import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { imagesURL_page3 } from '../index'
import '../resources/sass/App.sass'

function Page3() {
  const [images, setImages] = useState(imagesURL_page3)
  const [score, setScore] = useState(0)
  const [fluency, setFluency] = useState(0)
  const [integrity, setIntegrity] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [star, setStar] = useState([])

  useEffect(() => {
    let allScores = sessionStorage.getItem('allScores') ? JSON.parse(sessionStorage.getItem('allScores')) : [{ score: 0, fluency: 0, integrity: 0, accuracy: 0 }], sum = [0, 0, 0, 0], length = 0, score = 0
    for (var index in allScores) {
      sum[0] += allScores[index].score
      sum[1] += allScores[index].fluency
      sum[2] += allScores[index].integrity
      sum[3] += allScores[index].accuracy
    }
    length = Object.keys(allScores).length
    score = sum[0] / length
    setScore((sum[0] / length).toFixed(0))
    setFluency((sum[1] / length).toFixed(0))
    setIntegrity((sum[2] / length).toFixed(0))
    setAccuracy((sum[3] / length).toFixed(0))
    if (score >= 60) {
      setStar([{ display: 'initial' }, { display: 'initial' }, { display: 'initial' }])
    } else if (score >= 40) {
      setStar([{ display: 'initial' }, { display: 'initial' }, {}])
    } else if (score >= 20) {
      setStar([{ display: 'initial' }, {}, {}])
    }
  }, [])

  return (
    <div className='App-Page3'>
      <svg className='App-title App-title2' viewBox={'0 0 ' + 426 + ' ' + 70}>
        <text x={0} y={60} stroke={'#fff'} strokeWidth={8} paint-order={"stroke"}>WONDERFUL!</text>
      </svg>
      <p className='App-subhead App-subhead2'>You almost get all of it!</p>
      {images.map(item => {
        switch (item.class) {
          case 'star_bg':
          case 'rectangle2':
          case 'star': {
            return (
              <div>
                {[1, 2, 3].map(i => {
                  return (
                    <img
                      src={item.src}
                      className={'App-' + item.class + i}
                      style={item.class == 'star' ? star[i] : {}}
                    />
                  )
                })}
              </div>
            )
          }
          case 'icon9':
            return (
              <Link to='/Page4'>
                <img src={item.src} className={'App-' + item.class} />
              </Link>
            )
          case 'icon10':
            return (
              <Link to='/Page1'>
                <img src={item.src} className={'App-' + item.class} />
              </Link>
            )
          default:
            return <img src={item.src} className={'App-' + item.class} />
        }
      })}
      <div className='App-Scoreboard'>
        <div className='Scoreboard-items'>
          <p>SCORE</p>
          <p>{score}</p>
        </div>
        <div>
          <div className='Scoreboard-items'>
            <p>FLUENCY</p>
            <p>{fluency}</p>
          </div>
          <div className='Scoreboard-items'>
            <p>INTEGRITY</p>
            <p>{integrity}</p>
          </div>
          <div className='Scoreboard-items'>
            <p>ACCURACY</p>
            <p>{accuracy}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page3
