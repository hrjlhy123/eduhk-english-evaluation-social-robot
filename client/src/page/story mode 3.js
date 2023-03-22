import React, { useRef, useEffect, useState } from 'react'
import { Link, useLocation, useParams, useRouteMatch, useSearchParams } from 'react-router-dom'
import { recorder, imagesURL_page1, imagesURL_page2, imagesURL_page6, storyimagesURL2, storyvoicesURL, imagesURL_animation_preload } from '../index'
import '../resources/sass/App.sass'
import '../resources/css/characters_threeLittlePigs.css'
import anime from './animation/animation'
import { Tipsbot } from './mode selection'

function Page6() {
  const [imagesReuse1, setImagesreuse1] = useState(imagesURL_page1), /* URL */
    [imagesReuse2, setImagesreuse2] = useState(imagesURL_page2), /* URL */
    [images, setImages] = useState(imagesURL_page6), /* URL */
    [storyimages, setStoryimages] = useState(storyimagesURL2), /* URL */
    [storyvoices, setStoryvoices] = useState(storyvoicesURL), /* URL */
    [animation, setAnimation] = useState([]), /* URL */
    [data, setData] = useState({}), /* data */
    [page, setPage] = useState(-1), /* data */
    [displayTipbot, setDisplaytipbot] = useState('none'), /* data */
    [refAudio1, setRefaudio1] = useState(new Audio()), /* data */
    [refAudio2, setRefaudio2] = useState(new Audio()), /* data */
    [questionText, setQuestiontext] = useState(''), /* data */
    [tipsText, setTipstext] = useState(''), /* data */
    [tipsAudio, setTipsAudio] = useState(''), /* data */
    // [tipsLoop, setTipsloop] = useState(), /* data */
    [loadFlag, setLoadFlag] = useState(false), /* flag */
    [recordFlag, setRecordFlag] = useState(true), /* flag */
    [scoreFlag, setScoreFlag] = useState(false), /* flag */
    [menuFlag, setMenuFlag] = useState(true) /* flag */

  // Global Functions
  let hrjlhy_interval, pageChange, handleClick1, handleClick2, handleClick3, handleClick4, handleClick5, handleClick7

  // Data Request & Pre-processing
  {
    async function Data() {
      let response = await fetch('http://localhost:5000/page6_dataset/tellYourOwnStory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      /* Session storage clear */
      sessionStorage.clear();

      let data = await response.json()
      console.log('data:', data)
      setData(data)
      sessionStorage.setItem('data', JSON.stringify(data))
    }

    useEffect(() => {
      Data()
      let loadingTime = (new Date()).getTime()
      hrjlhy_interval = setInterval(() => {
        if (((new Date()).getTime() - loadingTime >= 8000)) {
          setLoadFlag(true)
          console.log('loadFlag:', true)
          clearInterval(hrjlhy_interval)
        }
        if (document.querySelector('.App-audio1-c1_9')) {
          document.querySelector('.App-audio1-c1_9').oncanplay = () => {
            if (((new Date()).getTime() - loadingTime >= 2000)) {
              setLoadFlag(true)
              console.log('loadFlag:', true)
              clearInterval(hrjlhy_interval)
            }
          }
        }
        document.fonts.ready.then(() => {
          if (((new Date()).getTime() - loadingTime >= 2000)) {
            setLoadFlag(true)
            console.log('loadFlag:', true)
            clearInterval(hrjlhy_interval)
          }
        })
      }, 200)
    }, [])
  }

  // Page Jump
  {
    // Tips loop display function
    let loopTips = (page) => {
      let i = 0
      setTipstext(data[page].tips[i++ % data[page].tips.length])
      const loopTips = setInterval(() => { setTipstext(data[page].tips[i++ % data[page].tips.length]) }, 4000)
      return loopTips
    }

    // Page Jump Function
    pageChange = (page, change) => {
      // clearInterval(tipsLoop)

      // Page: [0, 1, 2, 3, 4, 5, ...] 
      {
        page = page + change
        setPage(page)
        setScoreFlag(false)
        console.log('scoreFlag:', false)
      }

      // Console
      {
        let info = {}
        info['data[' + page + ']'] = data[page]
        console.log('data (Page ' + (parseInt(page) + 1) + '):', info)
      }

      // Tips for Beginners
      if (page == 0) {
        setTimeout(() => {
          setTipstext('Click the recording button to record')
          setTipsAudio('tips_13')
        }, 8000)
      } else {
        setTipstext('')
        setTipsAudio('')
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

      // Character
      const Character = new Promise((resolve, reject) => {
        let animationCharacter = []
        // Animated character
        animationCharacter.push(
          anime([{
            emotion: 'curlyNormal',
            height: '78.8889058430989vh',
            width: '29.9073028564453vw',
            left: '61.238530476888vw',
            top: '30.2777777777778vh'
          }])
        )
        setAnimation(animationCharacter)
      })

      // Subtitle
      const Subtitle = new Promise((resolve, reject) => { setQuestiontext(data[page].question) })

      // Voice
      const Voice = new Promise((resolve, reject) => {
        if (data[page].audio) {
          for (var audio of document.querySelectorAll('.App-audio1')) {
            if (audio.className.split(' ').includes('App-audio1-' + data[page].audio)) {
              audio.play()
            } else {
              audio.pause()
              audio.currentTime = 0
            }
          }
        }
        setRefaudio1(document.querySelector('.App-audio1-' + data[page].audio))
      })

      // Tipsbot
      setDisplaytipbot('initial')
      // setTipsloop(loopTips(page))

      // Logic: Page Jump button displayed
      {
        // Case1: Should not go back to the previous page in the first page
        // Case2: Should not go to the next page in the last page
        let case1 = (page == 0), case2 = (page == data.length - 1)
        document.querySelector('.App-icon4').style.display = case1 ? 'none' : 'initial'
        document.querySelector('.App-icon5').style.display = case2 ? 'none' : 'initial'
        document.querySelector('.App-icon11').style.display = case2 ? 'initial' : 'none'
      }

      // Logic: Give data to Page4
      if (page + 1) {
        let allwords = !sessionStorage.getItem('allWords') ? {} : JSON.parse(sessionStorage.getItem('allWords')),
          allScores = !sessionStorage.getItem('allScores') ? {} : JSON.parse(sessionStorage.getItem('allScores')),
          allAudioURL = !sessionStorage.getItem('allAudioURL') ? {} : JSON.parse(sessionStorage.getItem('allAudioURL'))
        allwords[page] = []
        allScores[page] = {
          score: 0,
          fluency: 0,
          integrity: 0,
          accuracy: 0
        }
        allAudioURL[page] = ''
        sessionStorage.setItem('allWords', JSON.stringify(allwords))
        sessionStorage.setItem('allScores', JSON.stringify(allScores))
        sessionStorage.setItem('allAudioURL', JSON.stringify(allAudioURL))
      }

      Promise.all([Picture, Character, Subtitle, Voice])
    }
  }

  // Button Clicked
  {
    // Next Page button
    handleClick1 = () => {
      console.log('Click: Next Page button')
      pageChange(page, +1)
    }

    // Last Page button
    handleClick2 = () => {
      console.log('Click: Last Page button')
      pageChange(page, -1)
    }

    // Record button
    handleClick3 = () => {
      console.log('Click: Record button')
      // Recording after audio
      setTimeout(() => {
        if (recordFlag) {
          setRecordFlag(false)
          console.log('recordFlag:', false)
          // Calling Sentence Scoring Interface
          recorder[0].stopRecord()
          recorder[0].record({
            duration: 6000,
            playDing: true,
            serverParams: {
              coreType: 'en.prtl.exam',
              rank: 100,
              precision: 1,
              attachAudioUrl: 1,
              refText: { "lm": [{ "text": data[page].content }] },
              keywords: data[page].keywords,
              userId: 'tester',
              result: { details: { use_inherit_rank: 1 } }
            },
            onRecordIdGenerated: tokenId => {
              console.log('========onRecordIdGenerated start========')
              console.log(JSON.stringify(tokenId))
              console.log('========onRecordIdGenerated end========')
            },
            onStart: () => { console.log('onStart') },
            onStop: () => { console.log('onStop') },
            // Complete Score
            onScore: score => {
              setRecordFlag(true)
              console.log('recordFlag:', true)
              setScoreFlag(true)
              console.log('scoreFlag:', true)
              recorder[0].stopRecord()
              let allWords = !sessionStorage.getItem('allWords') ? {} : JSON.parse(sessionStorage.getItem('allWords')),
                allScores = !sessionStorage.getItem('allScores') ? {} : JSON.parse(sessionStorage.getItem('allScores')),
                allAudioURL = !sessionStorage.getItem('allAudioURL') ? {} : JSON.parse(sessionStorage.getItem('allAudioURL'))
              allWords[page] = score.result.details.keywords.item_info
              allScores[page] = {
                score: score.result.overall,
                fluency: score.result.details.multi_dim.flu,
                integrity: score.result.details.multi_dim.cnt,
                accuracy: Math.round(score.result.details.keywords.count / score.result.details.keywords.item_info.length * 100)
              }
              allAudioURL[page] = 'https://' + score.audioUrl.replace(':8002', '') + '.mp3'
              sessionStorage.setItem('allWords', JSON.stringify(allWords))
              sessionStorage.setItem('allScores', JSON.stringify(allScores))
              sessionStorage.setItem('allAudioURL', JSON.stringify(allAudioURL))
              // AudioUrl
              setRefaudio2(new Audio(allAudioURL[page]))

              // Logic: change tipsbot text and character's emotion
              {
                if (allScores[page]['accuracy'] >= 60) {
                  setTipstext('Well Done!')
                  setTipsAudio('tips_14')
                  setAnimation(anime([{
                    emotion: 'curlyNormal',
                    height: '78.8889058430989vh',
                    width: '29.9073028564453vw',
                    left: '61.238530476888vw',
                    top: '30.2777777777778vh'
                  }]))
                } else {
                  setTipstext('Come on, I still believe in you!')
                  setTipsAudio('tips_15')
                  setAnimation(anime([{
                    emotion: 'curlyWorried',
                    height: '78.8889058430989vh',
                    width: '29.9073028564453vw',
                    left: '61.238530476888vw',
                    top: '30.2777777777778vh'
                  }]))
                }
              }
            },
            onScoreError: err => {
              setRecordFlag(true)
              console.log('recordFlag:', true)
              recorder[0].stopRecord()
              recorder[0].reset()
              alert(JSON.stringify(err))
            }
          })
        } else {
          setRecordFlag(true)
          console.log('recordFlag:', true)
          recorder[0].stopRecord()
          console.log('record stop.')
        }
      }, /*refAudio2.duration * 1000 ||*/ 0) /* Delay 1 times before calling the API */
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
      console.log(refAudio2)
      refAudio2.volume = 1.0
      refAudio2.play()
    }

    // Menu button (menuFlag)
    handleClick7 = (e) => {
      console.log('Click: Menu button')
      // If the menu button is hidden, the background click is useless
      if (!e.target.classList.contains('App-story') && menuFlag) {
        console.log('Menu Button clicked:', 'show')
        document.querySelector('.App-icon2').style.display = 'none'
        document.querySelector('.App-icon6').classList.remove('App-icon6-hide')
        document.querySelector('.App-icon7').classList.remove('App-icon7-hide')
        setMenuFlag(false)
        console.log('menuFlag:', false)
        // If the menu button is not hidden, the background click can be used to hide the menu button
      } else {
        console.log('Menu Button clicked:', 'hide')
        document.querySelector('.App-icon2').style.display = 'initial'
        document.querySelector('.App-icon6').classList.add('App-icon6-hide')
        document.querySelector('.App-icon7').classList.add('App-icon7-hide')
        setMenuFlag(true)
        console.log('menuFlag:', false)
      }
    }
  }

  // Logic: Display the page after loading (loadFlag)
  useEffect(() => {
    // If is loading page and getting data
    if (page == -1 && Object.keys(data).length != 0) {
      if (loadFlag) {
        document.querySelector('.App-loading').style.opacity = 0.0
        setTimeout(() => {
          handleClick1()
          document.querySelector('.App-loading').style.display = 'none'
          clearInterval(hrjlhy_interval)
          console.log('--Loading completed--')
        }, 2000)
      }
    }
  }, [loadFlag])

  // Logic: Replay Recording button display (scoreFlag)
  useEffect(() => { document.querySelector('.App-icon7').style.display = scoreFlag ? 'initial' : 'none' }, [scoreFlag])

  // Basic Page display
  return (
    <div className='App-Page6' data-page={page} >
      <div>
        <svg className='App-title App-title5'>
          <text x={'50%'} y={'50%'} stroke={'#fff'} strokeWidth={8} paint-order={"stroke"}>{questionText}</text>
        </svg>
        {imagesURL_animation_preload.map(item => { switch (item.class) { default: return (<img src={item.src} className='preload' />) } })}
        {animation}
        {imagesReuse1.map(item => {
          switch (item.class) {
            case 'icon2': return (<img src={item.src} className={'App-' + item.class} onClick={handleClick7} />)
            default: break
          }
        })}
        {imagesReuse2.map(item => {
          switch (item.class) {
            case 'icon3': return <Link to='/Page1'><img src={item.src} className={'App-' + item.class} /></Link>
            case 'icon4': return <img src={item.src} className={'App-' + item.class} onClick={handleClick2} />
            case 'icon5': return <img src={item.src} className={'App-' + item.class} onClick={handleClick1} />
            case 'icon6': return <img src={item.src} className={'App-' + item.class + ' ' + 'App-icon6-hide'} onClick={handleClick4} />
            case 'icon7': return <img src={item.src} className={'App-' + item.class + ' ' + 'App-icon7-hide'} onClick={handleClick5} />
            case 'icon8': return <img src={item.src} className={'App-' + item.class + '-page6'} onClick={handleClick3} />
            case 'icon11': return <Link to='/Page3'><img src={item.src} className={'App-' + item.class} /></Link>
            case 'loading': return (<img src={item.src} className={'App-' + item.class} />)
            default: break
          }
        })}
        {images.map(item => { return <img src={item.src} className={'App-' + item.class} onClick={handleClick7} /> })}
        {storyimages.map(item => {
          switch (item.class) {
            default: return <img src={item.src} className={'App-story App-story-page6'} id={'App-story-' + item.class} style={item.class == 'c1_1_q1' ? {} : { display: 'none' }}></img>
          }
        })}
        {storyvoices.map(item => { return <audio className={'App-audio1 App-audio1-' + item.class}><source src={item.src} type='audio/wav' preload='auto' /></audio> })}
      </div>
      <Tipsbot data={{ text: tipsText, audio: tipsAudio, style: { display: displayTipbot } }}></Tipsbot>
    </div >
  )
}

export default Page6
