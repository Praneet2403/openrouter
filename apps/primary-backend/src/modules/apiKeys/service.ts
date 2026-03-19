import { prisma } from "db"
const API_KEY_LENGTH = 32;
const ALPHABET_SET = "qwertyuiolkjhgfdsazzxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM1234567890";

export abstract class ApiKeyService {
 

    //to create a random api key of length 32 with prefix sk-or-v1-x 
    static createRandomApiKey() {
        let suffixKey = "";
        for(let i = 0; i < API_KEY_LENGTH; i++) {
            suffixKey += ALPHABET_SET[Math.floor(Math.random() * ALPHABET_SET.length)];
        }
        return `sk-or-v1-x${suffixKey}`
    }


    //to create a new api key
    static async createApiKey(name : string , userId : number) : Promise<{
        id : string,    
        apiKey : string
    }> {



        const apiKey  = ApiKeyService.createRandomApiKey();

        //to create a new api key in the database
        const apiKeyDB = await prisma.apiKey.create({
            data : {
                name,
                apiKey,
                userId,
            }
        })
        

        //to return the id and api key
        return { 
            id: apiKeyDB.id.toString(),
            apiKey,
        }


        
    }
}
