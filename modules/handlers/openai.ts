import { ZuploContext, ZuploRequest, environment } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {

  const {prompt} = await request.json()

  return await fetch(`https://api.openai.com/v1/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.OPEN_AI_KEY}`
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: `${prompt}, in the style of a south park cartoon`
    })
  }).then(response => response.json())

}