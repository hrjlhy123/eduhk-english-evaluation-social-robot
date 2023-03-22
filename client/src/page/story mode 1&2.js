import React, { useRef, useEffect, useState } from 'react'
import { Link, useLocation, useParams, useRouteMatch, useSearchParams } from 'react-router-dom'
import { recorderInit, recorder, imagesURL_page1, imagesURL_page2, storyimagesURL1, storyvoicesURL, imagesURL_animation_preload } from '../index'
import '../resources/sass/App.sass'
import '../resources/css/characters_threeLittlePigs.css'
import anime from './animation/animation'
import { Tipsbot } from './mode selection'

function Page2(pageData) {
  const [getParameter, setGetparameter] = useSearchParams(''), /* search */
    [imagesReuse, setImagesreuse] = useState(imagesURL_page1), /* URL */
    [images, setImages] = useState(imagesURL_page2), /* URL */
    [storyimages, setStoryimages] = useState(storyimagesURL1), /* URL */
    [storyvoices, setStoryvoices] = useState(storyvoicesURL), /* URL */
    [animation, setAnimation] = useState([]), /* URL */
    [data, setData] = useState({}), /* data */
    [page, setPage] = useState(-1), /* data */
    [displayTipbot, setDisplaytipbot] = useState('none'), /* data */
    [allName, setAllName] = useState([]), /* data */
    [allPosition, setAllPosition] = useState([]), /* data */
    [allSize, setAllSize] = useState([]), /* data */
    [allAnimation, setAllAnimation] = useState([]), /* data */
    [allScene, setAllScene] = useState([]), /* data */
    [allWords, setAllWords] = useState({}), /* data */
    [refText, setReftext] = useState([]), /* data */
    [refAudio1, setRefaudio1] = useState(new Audio()), /* data */
    [refAudio2, setRefaudio2] = useState(new Audio()), /* data */
    [tipsText, setTipstext] = useState(''), /* data */
    [tipsAudio, setTipsAudio] = useState(''), /* data */
    [tipsLoop, setTipsloop] = useState(), /* data */
    [loadFlag, setLoadFlag] = useState(false), /* flag */
    [recordFlag, setRecordFlag] = useState(true), /* flag */
    [scoreFlag, setScoreFlag] = useState(false), /* flag */
    [questionFlag, setQuestionFlag] = useState(false), /* flag */
    [introFlag, setIntroFlag] = useState(false), /* flag */
    [menuFlag, setMenuFlag] = useState(true) /* flag */

  // Global Functions
  let hrjlhy_interval, pageChange, questionPageChange, resultPageChange, handleClick1, handleClick2, handleClick3, handleClick4, handleClick5, handleClick6, handleClick7

  // Data Request & Pre-processing
  {
    async function Data() {
      let response
      if (pageData.introFlag == true) {
        setIntroFlag(true)
        console.log('introFlag:', true)
        response = await fetch('http://localhost:5000/page2_dataset/hearStory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 'introFlag': pageData.introFlag })
        })
      } else {
        if (!getParameter.get('character')) {
          response = await fetch('http://localhost:5000/page2_dataset/hearStory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })
        } else {
          response = await fetch('http://localhost:5000/page2_dataset/joinTellingStory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'character': getParameter.get('character') })
          })
        }
      }

      /* Session storage clear */
      sessionStorage.clear()

      let data = await response.json()
      setData(data.data)
      sessionStorage.setItem('data', JSON.stringify(data.data))
      setAllName(data.AllName)
      setAllPosition(data.AllPosition)
      setAllSize(data.AllSize)
      setAllAnimation(data.AllAnimation)
      setAllScene(data.AllScene)
      console.log('data:', data)
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
  pageChange = (page, change) => {
    let character, pageReuse

    // Page
    {
      // allScene:  [c1-1, c1-2, c1-3, c1-4, c1-4-q1, c1-5, c1-5-q1]
      // page:      [c1-1, c1-2, c1-3, c1-4, c1-4-q1, c1-5, c1-5-q1, ...] 
      // pageReuse: [1, 2, 3, 4, 5] (e.g. 4: c1-4 or c1-4-q1, 5: c1-5 or c1-5-q1)
      // page:      [0, 1, 2, 3, 4, 5, 6] (index of first 'page', e.g. 3: c1-4, 4: c1-4-q1)
      page = page == -1 ? allScene[0] : allScene[allScene.indexOf(page) + change]
      setPage(page)
      setQuestionFlag(page.includes('q') ? true : false)
      console.log('questionFlag:', page.includes('q') ? true : false)
      pageReuse = page.split('-')[1] - 1
      page = allScene.indexOf(page)
      setScoreFlag(false)
      console.log('scoreFlag:', false)
    }

    // Console
    {
      let info = {}
      info['data[' + page + ']'] = data[page]
      info['allName[' + pageReuse + '](false)'] = data[page].character.split('@')
      info['allPosition[' + pageReuse + ']'] = allPosition[pageReuse]
      info['allSize[' + pageReuse + ']'] = allSize[pageReuse]
      info['allAnimation[' + pageReuse + ']'] = allAnimation[pageReuse]
      info['allScene[' + page + ']'] = allScene[page]
      console.log('data (Page ' + (parseInt(page) + 1) + '):', info)
    }

    // Background
    const Background = new Promise((resolve, reject) => {
      if (data[page].background) {
        let background_come = document.querySelector('#App-story-' + data[page].background), background_go
        for (var background of document.querySelectorAll('.App-story')) {
          if (background.classList.contains('last_come')) {
            background_go = background
            background_go.classList.remove('last_come')
          }
        }
        if (background_go && background_go.style.left == '0vw') {
          if (background_come.style.left == '100vw') { background_go.style.left = '-100vw' }
          if (background_come.style.left == '-100vw') { background_go.style.left = '100vw' }
        }
        background_come.style.left = '0vw'
        background_come.classList.add('last_come')
      }
    })

    // Character
    const Character = new Promise((resolve, reject) => {
      let charactersName1 = data[page].character.split('@'),
        charactersName2 = data[page].character_with_animation.split('@')
      let j = 0, k = 0
      let animationCharacter = []
      for (var i in allName) {
        character = document.querySelector('#App-story-' + allName[i])
        if (charactersName1.includes(allName[i])) {
          character.style.left = allPosition[pageReuse][j * 2]
          character.style.top = allPosition[pageReuse][j * 2 + 1]
          character.style.width = allSize[pageReuse][j * 2]
          character.style.height = allSize[pageReuse][j * 2 + 1]
          character.style.opacity = 1
          // Animated character
          if (charactersName2.includes(allName[i])) {
            animationCharacter.push(
              anime([{
                emotion: charactersName2[k] + allAnimation[pageReuse][k],
                left: allPosition[pageReuse][j * 2],
                top: allPosition[pageReuse][j * 2 + 1],
                width: allSize[pageReuse][j * 2],
                height: allSize[pageReuse][j * 2 + 1]
              }])
            )
            k++
          }
          j++
        } else { character.style.opacity = 0 }
      }
      // Animated character
      setAnimation(animationCharacter)

      for (var i in allName) {
        character = document.querySelector('#App-story-' + allName[i])
        if (charactersName2.includes(allName[i])) { character.style.opacity = 0 }
      }
    })

    // Speaker
    const Speaker = new Promise((resolve, reject) => {
      for (var speaker of document.querySelectorAll('img[id^="App-story-speaker"]')) { speaker.style.display = 'none' }
      document.querySelector('#App-story-speaker_' + data[page].character_with_audio).style.display = 'initial'
    })

    // Subtitle
    const Subtitle = new Promise((resolve, reject) => {
      setReftext([data[page].content])
      document.querySelector('.App-box2').style.display = 'initial'
      document.querySelector('.App-selection6').style.display = 'none'
      document.querySelector('.App-subtitle1').classList.remove('App-subtitle3')
      document.querySelector('.App-subtitle1').classList.remove('App-selection7')
      document.querySelector('.App-subtitle1').style.display = 'flex'
      document.querySelector('.App-subtitle1.score').style.display = 'none'
    })

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

    // Logic: Page Jump button displayed
    {
      // Case1: Should not go back to the previous page in the first page
      // Case2: Should not go to the next page in the last page || Should display 'the end' in the last page
      // Case3: Should not go back after the question page
      // Case4: Should not display in intro page
      let case1 = (page == 0),
        case2 = (page == allScene.length - 1),
        case3 = data[page - 1] ? data[page - 1].scene.includes('q') : false,
        case4 = !pageData.introFlag
      document.querySelector('.App-icon4').style.display = case1 || case3 ? 'none' : 'initial'
      document.querySelector('.App-icon5').style.display = case2 ? 'none' : 'initial'
      document.querySelector('.App-icon11').style.display = case2 && case4 ? 'initial' : 'none'
    }

    // Logic: Record button displayed & Give data to Page4
    if ((page + 1) && getParameter.get('character')) {
      if (data[page].character_with_audio == getParameter.get('character')) {
        document.querySelector('.App-icon8').style.display = 'initial'
        if (!allScene[page].includes('q1')) {
          let allwords = !sessionStorage.getItem('allWords') ? {} : JSON.parse(sessionStorage.getItem('allWords')),
            allScores = !sessionStorage.getItem('allScores') ? {} : JSON.parse(sessionStorage.getItem('allScores')),
            allAudioURL = !sessionStorage.getItem('allAudioURL') ? {} : JSON.parse(sessionStorage.getItem('allAudioURL'))
          allwords[allScene[page]] = []
          allScores[allScene[page]] = {
            score: 0,
            fluency: 0,
            integrity: 0,
            accuracy: 0
          }
          allAudioURL[allScene[page]] = ''
          sessionStorage.setItem('allWords', JSON.stringify(allwords))
          sessionStorage.setItem('allScores', JSON.stringify(allScores))
          sessionStorage.setItem('allAudioURL', JSON.stringify(allAudioURL))
        }
      } else {
        document.querySelector('.App-icon8').style.display = 'none'
      }
    }

    // Logic: Stop record when page jump
    // {
    //   recorder[0].stopRecord()
    //   recorder[1].stopRecord()
    // }

    Promise.all([Background, Character, Speaker, Subtitle, Voice])
  }

  // Question Page Jump 
  {

    // Tips loop display function
    let loopTips = (page) => {
      let i = 0
      setTipstext(data[page].tips[i++ % data[page].tips.length])
      const loopTips = setInterval(() => { setTipstext(data[page].tips[i++ % data[page].tips.length]) }, 4000)
      return loopTips
    }

    // Question Page Jump function
    questionPageChange = (page) => {
      console.log('questionPageChange()')
      clearInterval(loopTips)
      console.log('data:', data)
      console.log('page:', page)

      // Page
      setPage(data[page].scene)

      // Last page / next page / the end button
      document.querySelector('.App-icon4').style.display = 'none'
      document.querySelector('.App-icon5').style.display = 'none'
      document.querySelector('.App-icon11').style.display = 'none'

      // Questionbar
      {
        document.querySelector('.App-subtitle1').classList.add('App-selection7')
        setReftext(data[page].selection)
        // Logic: If there is more than one selection
        if (data[page].selection.length != 1) {
          document.querySelector('.App-box2').style.display = 'none'
          document.querySelector('.App-selection6').style.display = 'initial'
          document.querySelector('.App-subtitle1').classList.add('App-subtitle3')
          // If there is only one selection
        } else {
          document.querySelector('.App-box2').style.display = 'initial'
          document.querySelector('.App-selection6').style.display = 'none'
          document.querySelector('.App-subtitle1').classList.remove('App-subtitle3')
        }
      }

      // Speaker
      document.querySelector('#App-story-speaker_' + data[page].character_with_audio).style.display = 'none'

      // Tipsbot
      setDisplaytipbot('initial')
      setTipsloop(loopTips(page))
    }

    // Question Page Jump (qestionFlag)
    useEffect(() => {
      // Logic: If the page is question page
      if (questionFlag) {
        questionPageChange(allScene.indexOf(document.querySelector('.App-Page2').dataset.page))
        // If the page is not question page, clear question page features
      } else {
        setDisplaytipbot('none')
        setTipstext('')
        setTipsAudio('')
        clearInterval(loopTips)
      }
    }, [questionFlag])

    // Intro Page
    useEffect(() => {
      if (introFlag) {
        if (loadFlag) {
          const recorderInitListening = setInterval(() => {
            console.log('recorderInit:', recorderInit)
            if (recorderInit[1] == 'success') {
              document.querySelector('.App-icon12').style.display = 'initial'
              setDisplaytipbot('initial')
              setTipstext('Say "tell a story".')
              setTipsAudio('tips_02')
              handleClick3()
              clearInterval(recorderInitListening)
            }
          }, 0)
        }
      }
    }, [introFlag, loadFlag])
  }

  // Result Page Jump
  resultPageChange = () => {
    window.location.href = window.location.origin + '/page3'
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
      // Play audio
      // refAudio1.play()
      // Recording after audio [Reconstructable]
      setTimeout(() => {
        if (recordFlag) {
          if (introFlag) {
            setInterval((() => {
              setRecordFlag(false)
              console.log('recordFlag:', false)
              // Calling the Free Scoring Interface
              recorder[1].stopRecord()
              recorder[1].record({
                duration: 300000,
                playDing: true,
                serverParams: {
                  coreType: 'en.asr.rec',
                  res: 'en.asr.G4',
                  rank: 100,
                  userId: 'tester',
                  attachAudioUrl: 1,
                  result: { details: { ext_cur_wrd: 1 } }
                },
                onRecordIdGenerated: tokenId => {
                  console.log('========onRecordIdGenerated start========')
                  console.log(JSON.stringify(tokenId))
                  console.log('========onRecordIdGenerated end========')
                },
                onStart: () => {
                  console.log('onStart')
                },
                onStop: () => { console.log('onStop') },
                // Partial score
                onInternalScore: score => {
                  console.log('onInternalScore:', score.result.rec)
                  if (score.result.rec.toLowerCase().indexOf('tell a story') != -1) {
                    recorder[1].stopRecord()
                    setTimeout(() => {
                      document.querySelector('.App-icon12').click()
                    }, 2000) // Delay 2 seconds to jump
                  }
                },
                onScore: score => {
                  console.log('onScore:', score.result.rec)
                  recorder[1].stopRecord()
                },
                onScoreError: err => {
                  setRecordFlag(true)
                  console.log('recordFlag:', true)
                  recorder[1].stopRecord()
                  recorder[1].reset()
                  alert(JSON.stringify(err))
                }
              })
            })(), 300000)
          } else if (!questionFlag) {
            setRecordFlag(false)
            console.log('recordFlag:', false)
            // Calling Sentence Scoring Interface
            recorder[0].stopRecord()
            recorder[0].record({
              duration: 5000,
              playDing: true,
              serverParams: {
                coreType: 'en.sent.score',
                refText: refText.join(' '),
                rank: 100,
                userId: 'tester',
                attachAudioUrl: 1
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
                let allwords = !sessionStorage.getItem('allWords') ? {} : JSON.parse(sessionStorage.getItem('allWords')),
                  allScores = !sessionStorage.getItem('allScores') ? {} : JSON.parse(sessionStorage.getItem('allScores')),
                  allAudioURL = !sessionStorage.getItem('allAudioURL') ? {} : JSON.parse(sessionStorage.getItem('allAudioURL'))
                allwords[page] = score.result.details
                allScores[page] = {
                  score: score.result.overall,
                  fluency: score.result.fluency.overall,
                  integrity: score.result.integrity,
                  accuracy: score.result.accuracy
                }
                allAudioURL[page] = 'https://' + score.audioUrl.replace(':8002', '') + '.mp3'
                sessionStorage.setItem('allWords', JSON.stringify(allwords))
                sessionStorage.setItem('allScores', JSON.stringify(allScores))
                sessionStorage.setItem('allAudioURL', JSON.stringify(allAudioURL))
                console.log('allScores:', sessionStorage.getItem('allScores'))
                setAllWords(allwords)
                setRefaudio2(new Audio(allAudioURL[page]))

                // Logic: display score
                setReftext(refText.join(' ').split(' '))
                document.querySelector('.App-subtitle1').style.display = 'none'
                document.querySelector('.App-subtitle1.score').style.display = 'flex'
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
            // Calling the Free Scoring Interface
            recorder[1].stopRecord()
            recorder[1].record({
              duration: 5000,
              playDing: true,
              serverParams: {
                coreType: 'en.asr.rec',
                res: 'en.asr.G4',
                rank: 100,
                userId: 'tester',
                attachAudioUrl: 1,
                result: { details: { ext_cur_wrd: 1 } }
              },
              onRecordIdGenerated: tokenId => {
                console.log('========onRecordIdGenerated start========')
                console.log(JSON.stringify(tokenId))
                console.log('========onRecordIdGenerated end========')
              },
              onStart: () => {
                console.log('onStart')
              },
              onStop: () => { console.log('onStop') },
              // Partial score
              onInternalScore: score => {
                console.log('onInternalScore:', score.result.rec)
              },
              onScore: score => {
                console.log('onScore:', score.result.rec)
                setRecordFlag(true)
                console.log('recordFlag:', true)
                setScoreFlag(true)
                console.log('scoreFlag:', true)
                recorder[1].stopRecord()
                // [Reconstructable]
                let similarity = new Array(refText.length).fill(0), sentence = score.result.rec.toLowerCase().split(' '), similarFlag = true
                refText.map((item1, index1) => {
                  sentence.map((item2, index2) => {
                    refText[index1].toLowerCase().split(' ').map((item3, index3) => {
                      if (item2 == item3) {
                        similarity[index1]++
                      } else {
                        similarity[index1]--
                      }
                    })
                  })
                })
                sessionStorage.setItem('similarity', JSON.stringify(similarity))
                console.log('similarity:', similarity)
                testSimilarity:
                for (let i = 0; i < similarity.length; i++) {
                  for (let j = 0; j < similarity.length; j++) {
                    if (similarity[i] == similarity[j] && i != j) {
                      similarFlag = true
                      break testSimilarity
                    } else {
                      similarFlag = false
                    }
                  }
                }
                if (!similarFlag) {
                  let index = similarity.indexOf(Math.max(...similarity))
                  handleClick6(index)
                } else {
                  setTipstext('Please try again!')
                  // setTipsAudio('')
                }
              },
              onScoreError: err => {
                setRecordFlag(true)
                console.log('recordFlag:', true)
                recorder[1].stopRecord()
                recorder[1].reset()
                alert(JSON.stringify(err))
              }
            })
          }
        } else {
          setRecordFlag(true)
          console.log('recordFlag:', true)
          recorder[0].stopRecord()
          recorder[1].stopRecord()
          console.log('record stop.')
        }
      }, /*refAudio1.duration * 1000 ||*/ 0) /* Delay 1 times before calling the API */
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
      refAudio2.volume = 1.0
      refAudio2.play()
    }

    // Selection button
    handleClick6 = (selection) => {
      console.log('Click: Selection button', selection)
      let dataForSpecific = {}, pageNext
      dataForSpecific[page] = data.find(({ scene }) => scene == page)
      console.log('dataForSpecific[' + page + ']:', dataForSpecific[page])
      pageNext = dataForSpecific[page].to[selection]

      // Logic: If have next page, and the next page is question page, go to question page by questionPageChage()
      //        If have next page, and the next page is normal page, go to next page by pageChange()
      //        If no next page, go to result page (Page 3) by resultPageChange()
      if (pageNext) {
        if (pageNext.includes('q')) {
          dataForSpecific[pageNext] = data.find(({ scene }) => scene == pageNext)
          questionPageChange(data.indexOf(dataForSpecific[pageNext]))
        } else {
          pageChange(pageNext, 0)
        }
      } else {
        resultPageChange()
      }
    }

    // Menu button (menuFlag)
    handleClick7 = (e) => {
      console.log('Click: Menu button')
      // If the menu button is hidden, the background click is useless
      if (!e.target.classList.contains('App-story') && menuFlag) {
        document.querySelector('.App-icon2').style.display = 'none'
        document.querySelector('.App-icon6').classList.remove('App-icon6-hide')
        document.querySelector('.App-icon7').classList.remove('App-icon7-hide')
        setMenuFlag(false)
        console.log('menuFlag:', false)
        // If the menu button is not hidden, the background click can be used to hide the menu button
      } else {
        document.querySelector('.App-icon2').style.display = 'initial'
        document.querySelector('.App-icon6').classList.add('App-icon6-hide')
        document.querySelector('.App-icon7').classList.add('App-icon7-hide')
        setMenuFlag(true)
        console.log('menuFlag:', true)
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
    <div className='App-Page2' data-page={page} data-character={allName}>
      <div>
        {imagesURL_animation_preload.map(item => { switch (item.class) { default: return (<img src={item.src} className='preload' />) } })}
        {animation}
        {imagesReuse.map(item => {
          switch (item.class) {
            case 'icon2': return (<img src={item.src} className={'App-' + item.class} onClick={handleClick7} />)
            case 'background1': return <img src={item.src} className={'App-story'} id={'App-story-' + item.class} style={pageData.introFlag == true ? {} : { left: '-100vw' }}></img>
            default: break
          }
        })}
        {images.map(item => {
          switch (item.class) {
            case 'icon3':
              return <Link to='/Page1'><img src={item.src} className={'App-' + item.class} /></Link>
            case 'icon4': return <img src={item.src} className={'App-' + item.class} onClick={handleClick2} />
            case 'icon5': return <img src={item.src} className={'App-' + item.class} onClick={handleClick1} />
            case 'icon6': return <img src={item.src} className={'App-' + item.class + ' ' + 'App-icon6-hide'} onClick={handleClick4} />
            case 'icon7': return <img src={item.src} className={'App-' + item.class + ' ' + 'App-icon7-hide'} onClick={handleClick5} />
            case 'icon8': return <img src={item.src} className={'App-' + item.class} onClick={handleClick3} />
            case 'icon11': {
              if (!getParameter.get('character')) {
                return <Link to='/Page1'><img src={item.src} className={'App-' + item.class} /></Link>
              } else {
                return <Link to='/Page3'><img src={item.src} className={'App-' + item.class} /></Link>
              }
            }
            case 'icon12': return <Link to='/Page1'><img src={item.src} className={'App-' + item.class} /></Link>
            case 'box6':
              return (<div className='App-selection6' >
                <img src={item.src} className={'App-' + item.class} onClick={() => handleClick6(0)} />
                <img src={item.src} className={'App-' + item.class} onClick={() => handleClick6(1)} />
              </div>)
            default: return <img src={item.src} className={'App-' + item.class} />
          }
        })}
        {/* subtitle: Regular subtitles created initially, it can be transformed into selections (subtitle3) */}
        <div className='App-subtitle1'>{refText.map((item, index) => { return (page.includes('q') ? <p onClick={() => handleClick6(index)}><span>{item}</span></p> : <p><span>{item}</span></p>) })}</div>
        {/* subtitle: Specific subtitles, it can display the results after recording */}
        <div className='App-subtitle1 score'>
          <p>
            <span>
              {refText.map((item, index) => {
                let color = {}
                if (allWords[page] && allWords[page][index]) {
                  if (allWords[page][index]['score'] >= 60) {
                    color = { color: '#6AAD00' }
                  } else if (allWords[page][index]['score'] >= 20) {
                    color = { color: '#00CAFF' }
                  } else {
                    color = { color: '#F55D5E' }
                  }
                }
                return <span className='word' key={index} style={color}>{index != refText.length - 1 ? item + " " : item}</span>
              })}
            </span>
          </p>
        </div>
        {storyimages.map(item => {
          switch (item.class) {
            case 'speaker_Chunky':
            case 'speaker_Curly':
            case 'speaker_Mama':
            case 'speaker_Narrotor':
            case 'speaker_Pigs':
            case 'speaker_Pinky':
            case 'speaker_Willis': return <img src={item.src} className={'App-story'} id={'App-story-' + item.class} onClick={handleClick7}></img>
            default: return <img src={item.src} className={'App-story'} id={'App-story-' + item.class} onClick={handleClick7} style={item.class == 'bg_mama_home' ? {} : { left: '-100vw' }}></img>
          }
        })}
        {storyvoices.map(item => { return <audio className={'App-audio1 App-audio1-' + item.class}><source src={item.src} type='audio/wav' preload='auto' /></audio> })}
      </div>
      <Tipsbot data={{ text: tipsText, audio: tipsAudio, style: { display: displayTipbot } }}></Tipsbot>
    </div >
  )
}

export default Page2
