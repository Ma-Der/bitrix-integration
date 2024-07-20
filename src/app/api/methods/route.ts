"use server"

export async function GET() {
    try {
        const result = await fetch('https://mhr.bitrix24.pl/rest/methods.json', {
            headers: {
                Authorization: 'Bearer a6639b66006f2fd5006c5e630000000c000007f2f784b81d9d7552bd1fd06ff36eb7b2',
                "Content-Type": 'application/json'
            }
        })
    console.log(result)
        if(!result.body) return Response.json({message: 'Something went wrong with authorization !!'});
        
        const readed = await result.body.getReader().read();
      
        if(!readed.value) return Response.json({message: 'Something went wrong with authorization !!'});
    
        const bitrixResult = JSON.parse(Buffer.from(readed.value).toString());
    
        return Response.json(bitrixResult)
    }
    catch(err) {
        const error = err as Error;
        console.log(error)

        return Response.error();
    }
    


}