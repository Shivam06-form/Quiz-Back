const express = require("express")
const app = express()
const fs = require('fs')
app.use(express.json())


// Create New User
app.post('/api/create', (req, res, next) => {
    const { name } = req.body

    let User_List = []

    fs.readFile(`${__dirname}/User.json`, 'utf-8', (err, data) => {
        if (data) {
            const Data = (JSON.parse(data))
            User_List = [...Data, { name }]
            fs.writeFile(`${__dirname}/User.json`, JSON.stringify(User_List), 'utf-8', err => {
                console.log(err)
            })
        } else {
            User_List = [{ name }]
            fs.writeFile(`${__dirname}/User.json`, JSON.stringify(User_List), 'utf-8', err => {
                console.log(err)
            })
        }
    })

    res.status(201).json({ Data: 'success' })
})


// quizzes Qns
app.get(`/api/quizzes`, (req, res, next) => {
    fs.readFile(`${__dirname}/Qns.json`, 'utf-8', (err, data) => {
        const Data = (JSON.parse(data))
        res.status(200).json({ Data })
    })
})



// Calculate answers 
app.post('/api/quizzes/:id/submit', (req, res, next) => {

    let total = 0

    fs.readFile(`${__dirname}/Qns.json`, 'utf-8', (err, data) => {
        const Data = (JSON.parse(data))
        const Selected_Qns = req.body

        const right_Qns = (Data.questions.filter((obj1) =>
            Selected_Qns.some(obj2 => obj1.correct_answer === obj2.correct_answer)
        ))
        total = right_Qns.length
        console.log(right_Qns.length)
        res.status(200).json({ total: total })
    })

})


// Score board
app.post('/api/score', (req, res, next) => {

    const score = (req.body.score)
    const name = (req.body.name)
    console.log(score)
    let Game_List = []

    fs.readFile(`${__dirname}/Score.json`, 'utf-8', (err, data) => {
        if (data) {
            const Data = (JSON.parse(data))
            Game_List = [...Data, { score: score, game: Data.length + 1, name: name }]

            fs.writeFile(`${__dirname}/Score.json`, JSON.stringify(Game_List), 'utf-8', err => {
                console.log(err)
            })
            res.status(201).json({ Data: Game_List })
        } else {
            Game_List = [{ score: score, game: 1, name: name }]
            fs.writeFile(`${__dirname}/Score.json`, JSON.stringify(Game_List), 'utf-8', err => {
                console.log(err)
            })
            res.status(200).json({ Data: Game_List })
        }
    })
})




const PORT = 8000;

app.listen((PORT), () => {
    console.log(`App is Listing on port ${PORT}`)
})
