const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const code = req.body.code || '';
  const dest = req.body.dest || '';

  if (code.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid test",
      }
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "assistant", content: preConfig()}, { role: "user", content: generatePrompt(code, dest) }],
      temperature: 0
    })
    res.status(200).json({ result: completion.data.choices[0].message.content });
    recordConversation(code, dest, completion.data.choices[0].message.content);

  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function preConfig(){
  return "learn the code conversion between android UI automator code and javascript using selenum and assert below: \nmDevice.findObject(new UiSelector().text(\"TEXT_ON_COMPONENTS\"));	<-> 	driver.findElement(By.linkText(\"TEXT_ON_COMPONENTS\"))mDevice.findObject(new UiSelector().className(\"android.widget.EditText\"));	<-> 	driver.findElement(By.tagName(\"input\"))mDevice.findObject(new UiSelector().className(\"android.widget.Button\"));	<-> 	driver.findElement(By.tagName(\"button\"))mDevice.pressEnter();	<->	[INPUT_ELEMENT].sendKeys(\"'\ue007'\");"
}

function generatePrompt(code, dest) {

  if (dest == "") {
    return code
  }

  return `convert following code to ${dest} \n ${code}`
}

/** write contents to files */
var fs = require("fs");
function recordConversation(code, dest, ans){
  fs.appendFile('conversation.txt', "===== START OF CONVERSATION =====\n User:\n" + generatePrompt(code, dest)+"\n\n"+"ChatGPT:\n"+ans+"\n\n\n===== END OF CONVERSATION =====", (err) => {
    if (err) throw err;
    console.log('The "data to append" was appended to file!');
  });
  console.log("appended!");
  fs.close();
}