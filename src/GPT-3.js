const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/* This method generates a response for a given input and is formatted to work better for chat responses and allows for information to passed through */
export const GenerateChat = async (model, prompt, start = '', restart = '', stop = []) => {
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      const response = await openai.createCompletion({
        model: model,
        prompt: prompt + start,
        temperature: 0.9,
        max_tokens: 300,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: stop
      });
      let output = [response.data.choices[0]['text'], start + response.data.choices[0]['text'] + restart]
      return output;
    } catch (error) {
      if (error.response) {
        // API returned an error response
        console.error(`API error: ${error.response.status} - ${error.response.data.message}`);
      } else if (error.request) {
        // Request failed to reach the API
        console.error(`Request error: ${error.request}`);
      } else {
        // Other error occurred
        console.error(`Unknown error: ${error.message}`);
      }
      retries++;
      // exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
    }
  }

  // Retry limit reached
  console.error(`Max retries exceeded. Failed to generate chat response for prompt: ${prompt}`);
  return null;
}

/* This method is a basic text completion function */
export const GenerateBasic = async (model, prompt) => {
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
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
    } catch (error) {
      if (error.response) {
        // API returned an error response
        console.error(`API error: ${error.response.status} - ${error.response.data.message}`);
      } else if (error.request) {
        // Request failed to reach the API
        console.error(`Request error: ${error.request}`);
      } else {
        // Other error occurred
        console.error(`Unknown error: ${error.message}`);
      }
      retries++;
      // exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
    }
  }
}