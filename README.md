# ChatbotXPolygon
- chat with openai's api
- save the history in smart contract
  
## Development

1. Clone the repo or download the ZIP

```
git clone [github https url]
```

2. Install packages

First run `npm install yarn -g` to install yarn globally (if you haven't already).

Then run:

```
yarn install
```
After installation, you should now see a `node_modules` folder.

3. Set up your `.env` file

- Copy `.env.example` into `.env`
  Your `.env` file should look like this:

```
OPENAI_API_KEY=
```

- Visit [openai](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) to retrieve API keys and insert into your `.env` file.

4. Install [Metamask extension](https://metamask.io/) in your browser

5. Add Polygon Test network in your metamask
- Go to https://chainlist.org/?search=mumbai&testnets=true
- Write `mumbai` in `serch networks` and select `Include Testnets`
- Click on the `Conect Wallet`
## Run the app

Once you've verified that the embeddings and content have been successfully added to your Pinecone, you can run the app `yarn run dev` to launch the local dev environment, and then type a question in the chat interface.
