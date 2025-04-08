const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients
that a user has and suggests a recipe they could make with
some or all of those ingredients.
You don't need to use every ingredient they mention in your recipe.
The recipe can include additional ingredients they didn't
mention, but try not to include too many extra ingredients.
Format your response in markdown to make it easier to render to a web page.
`;

// normal request and response
// export async function getRecipeFromOllama(ingredientsArr) {
// const ingredientsString = ingredientsArr.join(", ");
// const fullPrompt = `${SYSTEM_PROMPT}\n\nI have ${ingredientsString}. Please give me a recipe you'd recommend I make!`;

// try {
//    const response = await fetch('http://localhost:11434/api/generate', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//       model: 'deepseek-r1:1.5b',
//       prompt: fullPrompt,
//       stream: true
//       })
//    });

//    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//    const data = await response.json();
//    return data.response;
// } catch (error) {
//    console.error('Error getting recipe from AI agent:', error);
//    return "Sorry, I couldn't generate a recipe right now.";
// }
// }

// ----------------------------------------------------------------------------

// request and resonse as stream
export async function getRecipeFromOllama(ingredientsArr, onDataChunk) {
   const ingredientsString = ingredientsArr.join(", ");
   const fullPrompt = `${SYSTEM_PROMPT}\n\nI have ${ingredientsString}. Please give me a recipe you'd recommend I make! in language`;

   try {
   const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         model: 'deepseek-r1:1.5b',
         prompt: fullPrompt,
         stream: true
      })
   });

   if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

   const reader = response.body.getReader();
   const decoder = new TextDecoder();

   while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

       // DeepSeek returns each chunk as JSON line like: `{"response":"text"}\n`
      const lines = chunk.split('\n').filter(Boolean);
      for (const line of lines) {
         const json = JSON.parse(line);
         if (json.response) {
           onDataChunk(json.response); // Pass each part to callback
         }
      }
   }

   } catch (error) {
   console.error('Error streaming recipe from AI agent:', error);
   onDataChunk("❌ Sorry, I couldn't generate a recipe right now.");
   }
}

// -------------------------------------------------------------------------------

// export async function getRecipeFromOllama(ingredientsArr, onDataChunk) {
//    const ingredientsString = ingredientsArr.join(", ");
//    const fullPrompt = `${SYSTEM_PROMPT}\n\nI have ${ingredientsString}. Please give me a recipe you'd recommend I make!`;
//    try {
//      const response = await fetch('http://localhost:11434/api/generate', {
//        method: 'POST',
//        headers: { 'Content-Type': 'application/json' },
//        body: JSON.stringify({
//          model: 'deepseek-r1:1.5b',
//          prompt: fullPrompt,
//          stream: true
//        })
//      });
 
//      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
 
//      const reader = response.body.getReader();
//      const decoder = new TextDecoder();
 
//      let sawThinkClose = false;
//      let buffer = ''; // to collect data before </think>
 
//      while (true) {
//        const { value, done } = await reader.read();
//        if (done) break;
 
//        const chunk = decoder.decode(value, { stream: true });
 
//        const lines = chunk.split('\n').filter(Boolean);
//        for (const line of lines) {
//          const json = JSON.parse(line);
//          if (!json.response) continue;
 
//          // Collect data until we find </think>
//          if (!sawThinkClose) {
//            buffer += json.response;
 
//            const endTagIndex = buffer.indexOf('</think>');
//            if (endTagIndex !== -1) {
//              sawThinkClose = true;
//              const afterThink = buffer.slice(endTagIndex + 8); // skip "</think>"
//              if (afterThink.trim()) onDataChunk(afterThink); // stream first part
//            }
//          } else {
//            onDataChunk(json.response); // stream as usual
//          }
//        }
//      }
 
//    } catch (error) {
//      console.error('Error streaming recipe from AI agent:', error);
//      onDataChunk("❌ Sorry, I couldn't generate a recipe right now.");
//    }
//  }
 