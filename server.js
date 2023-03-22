const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const e = require('express')
const app = express()
const port = process.env.PORT || 5000
// const jsmediatags = require('jsmediatags')

// Enable CORS for all routes
app.use(cors());

app.post('/key', (req, res) => {
    const data = require('./key/key.json')
    let timestamp = Date.now().toString()
    function sha1(data) {
        return crypto
            .createHash('sha1')
            .update(data, 'binary')
            .digest('hex')
    }
    function key() {
        return {
            timestamp: timestamp,
            sig: sha1(data.appKey + timestamp + data.secretKey)
        }
    }
    res.json(key())
})

let process_hearStory_dataset = data => {
    let charactersName1,
        charactersName2,
        charactersAnimation,
        charactersPosition,
        charactersSize
    let AllName = [],
        AllAnimation = [],
        AllPosition = [],
        AllSize = [],
        AllScene = []

    for (var i in data) {
        // Name
        charactersName1 = data[i].character.split('@')
        for (var j in charactersName1) {
            if (!AllName.includes(charactersName1[j])) {
                AllName.push(charactersName1[j])
            }
        }

        // Animation
        charactersName2 = data[i].character_with_animation.split('@')
        charactersAnimation = data[i].character_emotion.split('@')
        for (var j in charactersName2) {
            charactersAnimation[j] =
                charactersAnimation[j][0].toUpperCase() +
                charactersAnimation[j].slice(1)
        }
        AllAnimation.push(charactersAnimation)

        // Position
        charactersPosition = data[i].character_position.split('@')
        for (var j in charactersName1) {
            charactersPosition[2 * j] = charactersPosition[2 * j].trim()
            charactersPosition[2 * j + 1] = charactersPosition[2 * j + 1].trim()
            charactersPosition[2 * j] =
                (charactersPosition[2 * j] / 1920) * 100 + 'vw'
            charactersPosition[2 * j + 1] =
                (charactersPosition[2 * j + 1] / 1080) * 100 + 'vh'
        }
        AllPosition.push(charactersPosition)

        // Size
        charactersSize = data[i].character_size.split('@')
        for (var j in charactersName1) {
            charactersSize[2 * j] = charactersSize[2 * j].trim()
            charactersSize[2 * j + 1] = charactersSize[2 * j + 1].trim()
            charactersSize[2 * j] = (charactersSize[2 * j] / 1920) * 100 + 'vw'
            charactersSize[2 * j + 1] =
                (charactersSize[2 * j + 1] / 1080) * 100 + 'vh'
        }
        AllSize.push(charactersSize)

        // Scene
        AllScene.push(data[i].scene)
    }

    return {
        data: data,
        AllName: AllName,
        AllAnimation: AllAnimation,
        AllPosition: AllPosition,
        AllSize: AllSize,
        AllScene: AllScene
    }
}

app.post('/page2_dataset/hearStory', express.json(), async (req, res) => {
    let data
    console.log('req.body.introFlag:', req.body.introFlag == true)
    if (req.body.introFlag == true) {
        data = require('./dataset/dataset_intro.json')
        res.json(process_hearStory_dataset(data))
    } else {
        data = require('./dataset/dataset_hearStory.json')
        res.json(process_hearStory_dataset(data['Chapter1']))
    }
})

// [Reconstructable]
app.post(
    '/page2_dataset/joinTellingStory',
    express.json(),
    async (req, res) => {
        const data1 = require('./dataset/dataset_hearStory.json'),
            data2 = require('./dataset/dataset_joinTellingStory.json')
        // Interrupting Object references
        let data3 = JSON.parse(JSON.stringify(process_hearStory_dataset(data1['Chapter1']))),
            data4 = JSON.parse(JSON.stringify(data2['Chapter1'])),
            data5 = {}
        for (var i in data4) {
            console.log('data4[' + i + ']:', data4[i])
            if (data4[i].helped == req.body.character) {
                if (data4[i].scene.includes('q1')) {
                    from = data4[i].scene.split('-')
                    from = (from[2] == 'q1' && data4[i].helped == req.body.character) ? from[0] + '-' + from[1] : NaN
                    let index1 = data3.AllScene.indexOf(from),
                        index2 = index1 + 1
                    data3.AllScene.splice(index2, 0, data4[i].scene)
                    data3.data.splice(index2, 0, JSON.parse(JSON.stringify(data3.data[index1])))
                    data3.data[index2].scene = data4[i].scene
                    data3.data[index2].tips = data4[i].tips.split('@')
                    data3.data[index2].selection = data4[i].selection.split('@')
                    data3.data[index2].to = data4[i].to ? data4[i].to.split('@') : []
                    // Interrupting Object references
                    data5 = JSON.parse(JSON.stringify(data3.data[index2]))
                } else if (data4[i].scene.includes('q')) {
                    data5.scene = data4[i].scene
                    data5.tips = data4[i].tips.split('@')
                    data5.selection = data4[i].selection.split('@')
                    data5.to = data4[i].to ? data4[i].to.split('@') : []
                    // Interrupting Object references
                    data3.data.push(JSON.parse(JSON.stringify(data5)))
                } else {
                    console.log('Wrong id exist in dataset_joinTellingStory.json')
                }
            }
        }
        console.log('data:', data3.data)
        res.json({
            data: data3.data,
            AllName: data3.AllName,
            AllAnimation: data3.AllAnimation,
            AllPosition: data3.AllPosition,
            AllSize: data3.AllSize,
            AllScene: data3.AllScene
        })
    }
)

app.post('/page6_dataset/tellYourOwnStory', (req, res) => {
    const data1 = require('./dataset/dataset_tellYourOwnStory.json')
    let data2 = JSON.parse(JSON.stringify(data1['Chapter1'])), data3
    for (var i in data2) {
        data2[i].tips = data2[i].question.split('@')
        data2[i].keywords = data2[i]['keywords'].split('@')
        data2[i].keywords_position = data2[i]['keywords_position'].split('@')
        delete data2[i]['keywords answer']
    }
    console.log('data2:', data2)
    res.json(data2)
})

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`))

// jsmediatags.read('./client/src/resources/audio/tips/tips_01.mp3', {
//     onSuccess: function (tag) {
//         console.log('Tag:', tag)
//     },
//     onError: function (error) {
//         console.log('Error:', error)
//     }
// })

// Create a Get route
app.get('/express_backend', (req, res) => { res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }) })
