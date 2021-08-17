"""
This script runs the application using a development server.
It contains the definition of routes and views for the application.
"""

import os
import sys
from bottle import default_app, redirect, route, template, get, request, response
from newspaper import Article
import nltk
from bson import json_util
import json

if '--debug' in sys.argv[1:] or 'SERVER_DEBUG' in os.environ:
    # Debug mode will enable more verbose output in the console window.
    # It must be set at the beginning of the script.
    import bottle
    bottle.debug(False)


def process_article(url):

    article = Article(url)
    article.download()
    article.parse()

    publish_date = json.dumps(article.publish_date, default=json_util.default)
    authors = article.authors
    text = article.text
    title = article.title
    top_image = article.top_image
    movies = article.movies

    keywords = []
    summary = ""

    def nlp_article():

        nonlocal keywords
        nonlocal summary

        article.nlp()
        keywords = article.keywords
        summary = article.summary



    try: nlp_article()
    except: 
        nltk.download("Punkt")
        nltk.download("Popular")
        nlp_article()


    return {    
        "publish_date" : publish_date,
        "authors" : authors,
        "text" : text,
        "title": title,
        "top_image" : top_image,   
        "keywords": keywords,
        "summary": summary
           }

@route('/')
def home():

    return ('')

@route('/api', method='GET')
def api():

    response.headers['Content-type'] = 'application/json'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

    url = request.GET.get('url')

    try:
        result = process_article(url)
    except:
        result = {"message":"item can't be processed"}

    return result


def wsgi_app():
    """Returns the application to make available through wfastcgi."""


    return default_app()

if __name__ == '__main__':
    import bottle

    if os.environ.get('APP_LOCATION') == 'heroku':
        bottle.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))

    else:
        # Starts a local test server.
        HOST = os.environ.get('SERVER_HOST', 'localhost')
        try:
            PORT = int(os.environ.get('SERVER_PORT', '5555'))
        except ValueError:
            PORT = 5555


        bottle.run(server='wsgiref', host=HOST, port=PORT)