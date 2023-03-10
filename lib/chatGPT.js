const fs = require("fs");
const {
  Configuration,
  OpenAIApi
} = require("openai");

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

exports.main = async (input) => {
  let conversation = [...loadConversation()]

  const responseSystem = await sendRequestToAPI(input, conversation);

  saveConversation(conversation, responseSystem)

  if (input.include("clear")) {
    clearConversation()
  }

  return responseSystem.content
}

const loadConversation = () => {
  try {
    const data = fs.readFileSync("../data/conversation.json");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

const saveConversation = (conversation, response) => {
  try {
    conversation.push({
      role: response.role,
      content: response.content
    })

    const data = JSON.stringify(conversation, null, 2);
    fs.writeFileSync("../data/conversation.json", data);
  } catch (error) {
    console.error(error);
  }
}

const sendRequestToAPI = async (content, conversation) => {
  try {
    const openai = new OpenAIApi(configuration);

    conversation.push({
      role: "user",
      content
    })

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: conversation,
    });

    console.log(completion)

    return completion.data.choices[0].message.content
  } catch (error) {
    const response = {
      content: "Something is wrong",
      error
    }

    return response
  }

}


const clearConversation = () => {
  try {
    fs.writeFileSysc('../data/conversation.json', [])
  } catch (error) {
    console.log(error)
  }
}