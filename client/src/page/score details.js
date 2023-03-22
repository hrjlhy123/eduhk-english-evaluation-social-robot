import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { imagesURL_page4, storyimagesURL2, storyvoicesURL } from '../index'
import '../resources/sass/App.sass'

function Page4() {
  // [Reconstructable]
  const [images, setImages] = useState(imagesURL_page4), /* URL */
    [storyimages, setStoryimages] = useState(storyimagesURL2), /* URL */
    [voices, setStoryvoices] = useState(storyvoicesURL), /* URL */
    [allWords, setAllWords] = useState(sessionStorage.getItem('allWords') ? JSON.parse(sessionStorage.getItem('allWords')) : []), /* data */
    [refAudio, setRefaudio] = useState(sessionStorage.getItem('allAudioURL') ? JSON.parse(sessionStorage.getItem('allAudioURL')) : []), /* data */
    [refAudio1, setRefaudio1] = useState(new Audio()) /* data */
  // page:      [c1-3, c1-5, ...]
  // allPage:      [c1-1, c1-2, c1-3, c1-4, c1-5, ...]
  let allPage = [], data_ = JSON.parse(sessionStorage.getItem('data'))
  for (var index in allWords) { allPage.push(index) }
  const [page, setPage] = useState(allPage[0] ? allPage[0] : 0) /* data */
  allPage = []
  for (var index in data_) { allPage.push(data_[index].scene) }
  console.log('data:', data_)
  const [refText, setReftext] = useState([]), /* data */
    [data, setData] = useState(data_), /* data */
    [allScene, setAllScene] = useState(sessionStorage.getItem('allWords') ? Object.keys(JSON.parse(sessionStorage.getItem('allWords'))) : []), /* data */
    [scoreFlag, setScoreFlag] = useState(false) /* flag */

  // Global Functions
  let pageChange, handleClick1, handleClick2, handleClick4, handleClick5

  // Page Jump
  pageChange = (page, change, data, allWords) => {
    // Page
    {
      // allWords:  {c1-3: [{xx: , xx: }, {xx: , xx: }], c1-5: [{xx: , xx: }, {xx: , xx: }], ...}
      // page:      [c1-3, c1-5, ...]
      // page:      [2, 4, ...]
      page = Object.keys(allWords)[Object.keys(allWords).indexOf(page) + change] ? Object.keys(allWords)[Object.keys(allWords).indexOf(page) + change] : page + change
      setPage(page)
      setScoreFlag(refAudio[page] ? true : false)
      console.log('scoreFlag:', refAudio[page] ? true : false)
      for (var i in data) {
        if (data[i].scene == page) {
          page = i
          break
        }
      }
    }

    // Console
    {
      let info = {}
      info['data[' + page + ']'] = data[page]
      console.log('data (Page ' + (parseInt(page) + 1) + '):', info)
    }

    // Picture
    const Picture = new Promise((resolve, reject) => {
      if (data[page].scene) {
        let picture_come = document.querySelector('#App-story-' + data[page].scene), picture_go
        for (var picture of document.querySelectorAll('.App-story')) {
          if (picture.classList.contains('last_come')) {
            picture_go = picture
            picture_go.classList.remove('last_come')
          }
        }
        if (picture_go) { picture_go.style.display = 'none' }
        picture_come.style.display = 'initial'
        picture_come.classList.add('last_come')
      }
    })

    // Subtitle
    const Subtitle = new Promise((resolve, reject) => { setReftext([data[page].content]) })

    // Voice
    const Voice = new Promise((resolve, reject) => { setRefaudio1(document.querySelector('.App-audio1-' + data[page].audio)) })

    // Logic: Page Jump button displayed
    {
      // Case1: Should not go back to the previous page in the first page
      // Case2: Should not go to the next page in the last page
      let case1 = allScene.indexOf(data[page].scene) != -1 ? allScene.indexOf(data[page].scene) == 0 : page == 0,
        case2 = allScene.indexOf(data[page].scene) != -1 ? allScene.indexOf(data[page].scene) == Object.keys(allWords).length - 1 : page == data.length - 1
      document.querySelector('.App-icon4').style.display = case1 ? 'none' : 'initial'
      document.querySelector('.App-icon5').style.display = case2 ? 'none' : 'initial'
    }

    Promise.all([Picture, Subtitle, Voice])
  }

  // Initialize the first page
  useEffect(() => { pageChange(page, 0, data, allWords) }, [])

  // Button Clicked
  {
    // Next Page button
    handleClick1 = () => {
      console.log('Click: Next Page button')
      pageChange(page, +1, data, allWords)
    }

    // Last Page button
    handleClick2 = () => {
      console.log('Click: Last Page button')
      pageChange(page, -1, data, allWords)
    }

    // Replay Original button
    handleClick4 = () => {
      console.log('Click: Replay Original button')
      refAudio1.volume = 1.0
      refAudio1.play()
    }

    // Replay Recording button
    handleClick5 = () => {
      console.log('Click: Replay Recording button')
      let refAudio2 = new Audio(refAudio[page])
      refAudio2.volume = 1.0
      refAudio2.play()
    }
  }

  // Logic: Replay Recording button display (scoreFlag)
  useEffect(() => { document.querySelector('.App-icon7').style.display = scoreFlag ? 'initial' : 'none' }, [scoreFlag])

  return (
    <div className='App-Page4' data-page={page}>
      <svg className='App-title App-title3' viewBox={'0 0 ' + 277 + ' ' + 70}>
        <text x={0} y={50} stroke={'#fff'} strokeWidth={8} paint-order={"stroke"}>HISTORY</text>
      </svg>
      {images.map(item => {
        switch (item.class) {
          case 'icon3': return <Link to='/Page3'><img src={item.src} className={'App-' + item.class} /></Link>
          case 'icon4': return <img src={item.src} className={'App-' + item.class} onClick={handleClick2} />
          case 'icon5': return <img src={item.src} className={'App-' + item.class} onClick={handleClick1} style={{ display: 'initial' }} />
          case 'icon6': return <img src={item.src} className={'App-' + item.class} onClick={handleClick4} />
          case 'icon7': return <img src={item.src} className={'App-' + item.class} onClick={handleClick5} />
          case 'mark1':
          case 'mark2': break
          default: return <img src={item.src} className={'App-' + item.class} />
        }
      })}
      {/* [Reconstructable] */}
      <div className='App-subtitle2'>
        {(() => {
          let word = []
          // If have allwords
          if (Object.values(allWords).length) {
            // If have the first sentence of allWords (JoinTellingStory or TellYourOwnStory)
            let joinTellingStoryFlag = false, tellYourOwnStoryFlag = false
            testMode:
            for (var i in Object.values(allWords)) {
              console.log('1', i)
              if (Object.values(allWords)[i].length != 0) {
                console.log('2', Object.values(allWords)[i])
                for (var j in Object.values(allWords)[i]) {
                  console.log('3', j)
                  if (Object.values(allWords)[i][j].hasOwnProperty('score')) {
                    console.log('4', Object.values(allWords)[i][j])
                    joinTellingStoryFlag = true
                    break testMode
                  } else {
                    console.log('5')
                    tellYourOwnStoryFlag = true
                    break testMode
                  }
                }
              }
            }
            if (joinTellingStoryFlag || tellYourOwnStoryFlag) {
              // If the first word of the first sentence have scores (JoinTellingStory)
              if (joinTellingStoryFlag) {
                // If sentence in the page have score
                if (allWords[page].length != 0) {
                  allWords[page].map((item, index) => {
                    let color = {}, img_src = '', img_className = ''
                    if (item.score < 20) {
                      color = { color: '#F55D5E' }
                      img_src = images[8].src
                      img_className = 'App-mark1'
                    } else if (item.score < 60) {
                      color = { color: '#00CAFF' }
                      img_src = images[9].src
                      img_className = 'App-mark2'
                    }
                    let subtitle = data[allPage.indexOf(page)].content.split(' ')
                    word.push(<span className='word' key={index} style={color}>
                      <span>{item.score}</span>
                      <span>{subtitle[index]}</span>
                      <img src={img_src} className={img_className} />
                    </span>)
                  })
                  // If sentence in the page have no score
                } else {
                  word.push(<span className='word' key={0} style={{ color: '#C6C4C4' }}>
                    <span>{ }</span>
                    <span>{data[allPage.indexOf(page)].content}</span>
                  </span>)
                }
                // If allwords have no score (TellYourOwnStory)
              } else if (tellYourOwnStoryFlag) {
                let wordClass = 'word', color = {}, subtitle = data[page].content.split(' ')
                console.log('allWords:', allWords)
                if (allWords[page].length) {
                  console.log('allWords[' + page + ']:', allWords[page])
                  for (var i in subtitle) {
                    for (var j in data[page].keywords_position) {
                      if (i == data[page].keywords_position[j] - 1) {
                        wordClass = 'keyword'
                        if (allWords[page][j].hits < 1) { color = { color: '#F55D5E' } } else {
                          color = { color: '#6AAD00' }
                        }
                        break
                      } else {
                        wordClass = 'word'
                        color = { color: '#C6C4C4' }
                      }
                    }
                    word.push(<span className={wordClass} key={i} style={color}>
                      <span>{ }</span>
                      <span>{subtitle[i]}</span>
                    </span>)
                  }
                } else {
                  console.log('data:', data)
                  console.log('data[' + page + ']:', data[page])
                  word.push(<span className='word' key={i} style={{ color: '#C6C4C4' }}>
                    <span>{ }</span>
                    <span>{data[page].content}</span>
                  </span>)
                }
              }
              // If don't have allwords
            } else {
              console.log('data:', data)
              console.log('data[' + page + ']:', data[page])
              word.push(<span className='word' key={0} style={{ color: '#C6C4C4' }}>
                <span>{ }</span>
                <span>{data[page] ? data[page].content : data[allPage.indexOf(page)] ? data[allPage.indexOf(page)].content : ""}</span>
              </span>)
            }
            return word
          }
        })()}

      </div>
      {storyimages.map(item => {
        switch (item.class) {
          default: return <img src={item.src} className={'App-story App-story-page4'} id={'App-story-' + item.class} style={item.class == 'c1_1_q1' ? {} : { display: 'none' }}></img>
        }
      })}
      {/* {Reconstructable} */}
      {voices.map(item => { return (<audio className={'App-audio1-' + item.class}><source src={item.src} type='audio/wav' preload='auto' /></audio>) })}
    </div>
  )
}

export default Page4
