# 3D-Word-Cloud-Omer

Take Home Assessment for Sparrow

## Summary
I built a multi-layer 3D word cloud out of the text of whatever URL we provide it with. 

The backend is Python and the frontend is TypeScript React, with react-three-fiber to do the heavy lifting.
The frontend runs on port 5173 and the backend on 8000.

### How it works

- You enter (or pick) a URL in the frontend.
- The backend scrapes the text using BeautifulSoup4 (with lxml), analyzes word frequencies and topics using TF-IDF, then returns the result as JSON.
- The frontend displays the word cloud (TF-IDF) which shows the differences in weightage/rank via label size, color, and movement speed. 
  - A darker red signifies higher weightage (red accent means top 50%)
  - A brighter green signifies lower weightage
- There is also a topic groupings panel on the left side which displays different aspects of the text.
  - The topic groupings are done via LDA.

### Backend

- FastAPI used for handling requests.
- Scrapes/parses and cleans up webpage text.
- Uses NLP library scikit-learn to split into words/tokens, and LDA for topic detection.
- We have a POST API endpoint /analyze which handles all the processing and returns a JSON object to the frontend.

### Frontend

- React + TypeScript for the UI.
- 3D graphics built with react-three-fiber and drei.
- Word cloud is interactive, and uses color/size/movement for visual emphasis.
- Topic results previewed in their own panel.

### Technologies Used

**Frontend**
- React, TypeScript
- tailwindcss
- react-three-fiber & drei (for rendering)
  
**Backend**
- Python 3
- FastAPI with uvicorn
- beautifulsoup4 (with lxml)
- scikit-learn
- httpx for requests


## todo list with initial ideas (outdated but kept for reference)

- [x] different folders for frontend backend
- [x] set up api routes (even if placeholder for now)
- [x] POST /analyze - returns json?
- [x] actually analyze the text we get from the parser
- [x] check if the current npm libs we installed are the correct ones or legacy
- [x] write up frontend that makes requests, has loading screen, can interpret
      data returned from backend

## initial ideas for engaging UI

- words with higher frequency bigger and redder color
- higher frequency: words start vibrating with energy
- higher frequency: moving faster around screen (how to keep this readable
  though)