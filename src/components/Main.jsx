import { useState } from "react"
import Recipe from "./Recipe"
import IngredientList from "./IngerdientList";
import { getRecipeFromOllama } from "../ai"

export default function Main(){
   const [ingredients, setIngredients] = useState(["chicken","pasta","heavy cream"]);
   const [recipe, setRecipe] = useState("");
   
   function formHandle(formData){
      const ingredient = formData.get("input-field");
      setIngredients(prev => [...prev,ingredient])
   }
   async function getRecipe(){
   // without stream
   // let response = await getRecipeFromOllama(ingredients);
   // response = response.slice(response.indexOf("</think>")+8,response.length-1)
   // setRecipe(response)

   // with stream
   getRecipeFromOllama(ingredients, (chunk) => {
      setRecipe(prev => prev + chunk);
   });
}

   return (
   <main>
      <form action={formHandle}>
         <input 
            name="input-field"
            type="text" 
            placeholder="e.g. oregano" 
            />
         <button>+ Add Ingredient</button>
      </form>

      {ingredients.length > 0 && <IngredientList 
                                 ingredients={ingredients}
                                 getRecipe={getRecipe}
                                 />}
      {recipe && <Recipe recipe={recipe} />}
   
   </main>
   )
}