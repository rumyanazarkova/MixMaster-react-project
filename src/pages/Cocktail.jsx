import { QueryClient,useQuery } from "@tanstack/react-query";
import Wrapper from "../assets/wrappers/CocktailPage"
import axios from "axios"
import { useLoaderData, Link, Navigate } from "react-router-dom"

const singleCocktailUrl = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';

const singleCocktailQuery=(id)=>{
    return{
        queryKey:['cocktail',id],
        queryFn: async()=>{
            const { data } = await axios.get(`${singleCocktailUrl}${id}`) 
            return data
        }
    }
}
export const loader =(QueryClient)=> async ({ params }) => { 
    const { id } = params  
   await QueryClient.ensureQueryData(singleCocktailQuery(id)); 
    return { id } 
}

const Cocktail = () => {
    const { id } = useLoaderData();

    const{data}=useQuery(singleCocktailQuery(id))

    if (!data) return <Navigate to='/' />

    const singleDrink = data.drinks[0];

    const { strDrink: name, strDrinkThumb: image, strAlcoholic: info, strCategory: category, strGlass: glass, strInstructions: instructions } = singleDrink;

    const validIngredients = Object.keys(singleDrink)
        .filter((key) => key.startsWith('strIngredient') && singleDrink[key] !== null)
        .map((key) => singleDrink[key]);

    console.log(validIngredients);


    return <Wrapper>
        <header>
            <Link to='/' className="btn">Back Home</Link>
            <h3>{name}</h3>
        </header>
        <div className="drink">
            <img src={image} alt={name} className="img"></img>
            <div className="drink-info">
                <p>
                    <span className="drink-data">name:</span>
                    {name}
                </p>
                <p>
                    <span className="drink-data">category:</span>
                    {category}
                </p>
                <p>
                    <span className="drink-data">info:</span>
                    {info}
                </p>
                <p>
                    <span className="drink-data">glass:</span>
                    {glass}
                </p>
                <p>
                    <span className="drink-data">instructions:</span>
                    {instructions}
                </p>
                <p>
                    <span className="drink-data">ingredients:</span>
                    {validIngredients.map((ing, index) => {
                        return <p className="ing" key={ing}>{ing}{index < validIngredients.length - 1 ? ',' : ''}</p>
                    })

                    }
                </p>
            </div>
        </div>
    </Wrapper>
}

export default Cocktail