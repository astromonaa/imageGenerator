import express from 'express'
import config from 'config'
import { engine } from 'express-handlebars'
const app = express()
import { Configuration, OpenAIApi } from "openai";

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.urlencoded({ extended: true }))


const configuration = new Configuration({
    apiKey: config.get("OPENAI_KEY")
});
const openai = new OpenAIApi(configuration);

app.get('/', (_, res) => {
    res.render('index')
})

app.post('/', async (req, res) => {
    const {prompt, size = '512x512', number = 1} = req.body

    try {
        const response = await openai.createImage({
            prompt,
            size,
            n: Number(number),
            response_format: "url",
            user: "user"
        })
        res.render('index', {
            images: response.data.data
        })
    }catch(e) {
        console.log(e.response)
        res.render('index', {
            error: e.message
        })
    }

})


app.listen(3000, () => console.log('Server started'))