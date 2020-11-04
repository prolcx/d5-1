const { time } = require('console')
const express = require('express')
const handlebars = require('express-handlebars')
const fetch = require('node-fetch')
const { title } = require('process')
const withQuery = require('with-query').default

const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000
const API_KEY = process.env.API_KEY || ""
const ENDPOINT = 'https://newsapi.org/v2/top-headlines'

const app = express()

app.engine('hbs', handlebars({defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs')

app.get('/', (req,resp)=>{
    resp.status(200)
    resp.type('text/html')
    resp.render('index')
})

app.post('/result',
    express.urlencoded({extended: true}),
    async (req, resp)=>{
        const url = withQuery(
            ENDPOINT, {
                q: req.body.search,
            country: req.body.country,
            category: req.body.category,
            apiKey: API_KEY,
            limit: 5
            })
        console.info(req.body)

        const userSearch = await fetch(url)
        const article = await userSearch.json()

        console.log('articles: \n', article)
    
        const result=[]
        for (let b of article.articles) {
            const title= b.title
            const imgurl = b.urlToImage
            const dcrpt = b.description
            const url = b.url
            const time = b.publishedAt
            result.push({title, imgurl, dcrpt, url, time})
        }

    resp.status(201)
    resp.type('text/html')
    resp.render('news',{
        result,
        hasContent: result.length>0,

    })

})

app.use(express.static(__dirname + '/images'))
app.use(express.static(__dirname + '/static'))



app.listen(PORT, ()=>{
    console.info(`Application started at ${PORT} at ${new Date()}.`)
})