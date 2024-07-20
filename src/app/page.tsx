const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const clientUrl = process.env.CLIENT_URL;
const redirectUri = `http://localhost:3000/api/oauth/auth`;

// const getBitrixSite = async () => {
//   const bitrixResult = await fetch('http://localhost:3000/api/oauth');
  
//   const reader = bitrixResult.body?.getReader() as ReadableStreamDefaultReader<Uint8Array>;
//     // const readableStream = new ReadableStream({
//     //   start(controller) {
//     //     function pump(): any {
//     //       return reader?.read().then(({ done, value }) => {
//     //         if (done) {
//     //           controller.close();
//     //           return;
//     //         }
//     //         controller.enqueue(value);
//     //         return pump();
//     //       });
//     //     }
//     //     return pump();
//     //   },
//     // });
  
//   const readed = await reader.read();
//   const stringObj = Buffer.from(readed.value);
  
//   const result = JSON.parse(stringObj.toString());
//   return result;

// }

export default function Home() {

  return <main>
<div>hello</div>
  </main>;
}
