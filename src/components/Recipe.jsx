import ReactMarkdown from 'react-markdown'

export default function Recipe(props){
   return(
      <section className='suggested-recipe-container'>
         <h1>Chef DeepSeek Recommended:</h1>
         <ReactMarkdown>{props.recipe}</ReactMarkdown>
   </section>
   )
}