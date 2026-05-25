import { Client, Databases, ID , Query } from "appwrite"

const VITE_APPWRITE_PROJECTID='67b13902000bd850d451'
const VITE_APPWRITE_DATABASE_ID='67b13a020000bd385bb1'
const VITE_APPWRITE_COLLECTION_ID='67b13a9c000d273f6cc9'
const client=new Client()
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject(VITE_APPWRITE_PROJECTID)
const database=new Databases(client);

export const updateSearchCount= async(searchTerm, movie)=>{
    //1: Use Appwrite to check if search term exist in db
   try
   {
        const result=await database.listDocuments(VITE_APPWRITE_DATABASE_ID,VITE_APPWRITE_COLLECTION_ID,[Query.equal('SEARCHTERM',searchTerm),])
        if(result.documents.length>0)
        {
            const doc=result.documents[0];
            await database.updateDocument(VITE_APPWRITE_DATABASE_ID,VITE_APPWRITE_COLLECTION_ID,doc.$id,{
                COUNT: doc.COUNT + 1,
            })
        }else{
            console.log(movie)
            console.log(movie.POSTER_URL)
            await database.createDocument(
                VITE_APPWRITE_DATABASE_ID,
                VITE_APPWRITE_COLLECTION_ID,
                ID.unique(),
                {
                    SEARCHTERM: searchTerm,
                    MOVIE_ID: movie.id,
                    COUNT: 1,
                    POSTER_URL:`https://image.tmdb.org/t/p/w500${movie.poster_path}`
                }
              )              
        }
   }catch(err)
   {
        console.log(err)
   }
}
export const getTrendingMovies= async()=>{
    try{
        const result=await database.listDocuments(VITE_APPWRITE_DATABASE_ID,VITE_APPWRITE_COLLECTION_ID,[
            Query.limit(5),
            Query.orderDesc('COUNT')
        ])
        console.log(result)
        return result.documents;
    }catch(err)
    {
            console.error(err)
    }
}
