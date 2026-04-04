# 3D-Word-Cloud-Omer

Take Home Assessment for Sparrow

## Plan for now

- [x] different folders for frontend backend
- [x] set up api routes (even if placeholder for now)
- [ ] POST /analyze - returns json?
- [ ] actually analyze the text we get from the parser
- [ ] check if the current npm libs we installed are the correct ones or legacy
- [ ] write up frontend that makes requests, has loading screen, can interpret
      data returned from backend

## initial ideas for engaging UI

- words with higher frequency bigger and redder color
- higher frequency: words start vibrating with energy
- higher frequency: moving faster around screen (how to keep this readable
  though)

## frontend libraries (typescript)

- react three fiber
- tailwind

## backend libraries (python)

- fastapi
- beautifulsoup4? selenium?
- scikit-learn?
- maybe pandas to make it easier to structure data and retrieve
- look into gensim and if it would help here
