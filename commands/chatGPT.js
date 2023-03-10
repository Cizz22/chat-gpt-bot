const chatGPT = require('../lib/chatGPT.js')

exports.run = async (client, message, args) => {
    const input = args.join(' ')
    const response = await chatGPT.main(input)
    message.channel.send(response.content)
}

exports.help = "Talk to GPT-3.5 Turbo";
exports.aliases = ["gpt"];