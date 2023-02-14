var express = require('express');
const { Configuration, OpenAIApi } = require("openai");
var router = express.Router();
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', async (req, res) => {
  const question = req.body.question;
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(question),
      temperature: 0.9,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    })
    return res.status(200).json({
      success: true,
      result: completion.data.choices[0].text
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.response
        ? error.response.data 
        : "issue with server",
    });
  }  
})

function generatePrompt(question) {
  return `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.
  
Human: Hello, who are you?
AI: I am an AI created by OpenAI. How can I help you today?
Human: ${question}
AI: `;
}

module.exports = router;
