export default function IngredientList(props){
   
   const ingredientElements = props.ingredients.map((i) => <li key={i}>{i}</li>)

   return (
      <section>
         <h1>Ingredients on hand:</h1>
         <ul>
         {ingredientElements}
         </ul>
         {props.ingredients.length > 2 && <div className="get-rec">
            <div className="text">
               <h3>
               Ready for a recipe?
               </h3>
               <p>Generate a recipe from your list of ingredients.</p>
            </div>
            <button onClick={props.getRecipe} >Get a recipe</button>
         </div>}
      </section>
   )
}