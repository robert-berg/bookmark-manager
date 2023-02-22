# Bookmark manager (Chrome Extension)

Experimental bookmark manager with automatic summaries, tags, and full text search

## Getting started

**Run server**

```
cd ./_backend/
python -m venv env
./env/Scripts/activate
pip install -r ./requirements.txt
python -m nltk.downloader punkt 
./app.py
```

**Install Chrome extension**

Visit <a href="chrome://extensions">chrome://extensions/</a> and activate developer mode and drag the "_frontend" folder into the window.
## Screenshots

Overview

![](/screenshot1.png)

Popup

![](/screenshot3.png)

Filter by tag

![](/screenshot2.png)
