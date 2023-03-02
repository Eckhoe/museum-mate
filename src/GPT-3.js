const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/* This method generates a response for a given input and is formatted to work better for chat responses and allows for information to passed through */
export const GenerateChat = async (model, prompt, information, start = '', restart = '', stop = []) => {
  while (true) {
    try {
      const response = await openai.createCompletion({
        model: model,
        prompt: prompt + "\nSource Material: " + information + start,
        temperature: 0.9,
        max_tokens: 300,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: stop
      });
      let output = [response.data.choices[0]['text'], prompt + start + response.data.choices[0]['text'] + restart]
      return output;
    } catch (error) { }
  }
}

/* This method is a basic text completion function */
export const GenerateBasic = async (model, prompt) => {
  while (true) {
    try {
      const response = await openai.createCompletion({
        model: model,
        prompt: prompt,
        temperature: 0.1,
        max_tokens: 300,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
      });
      return response.data.choices[0]['text'];
    } catch (error) { }
  }
}