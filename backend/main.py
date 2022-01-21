from flask import Flask, jsonify
from bs4 import BeautifulSoup
from deta import App
import requests
import json

app = App(Flask(__name__))

def get_body(article_url):  # pure function
    resp = requests.get(article_url)
    src = BeautifulSoup(resp.text, features="html.parser")
    for table in src.font.find_all('table'):
      table.decompose()
    return src.font

@app.route("/posts")
def home():
    titles = json.load(open("titles.json", "r"))
    res = jsonify(titles)
    res.headers.add('Access-Control-Allow-Origin', '*')
    return res

@app.route("/posts/<id>")
def post(id):
    posts = json.load(open("posts.json", "r"))

    try:
        res = jsonify(posts[int(id)]) # id is made sure to be the list index in posts.json for easier retreiving
    except:
        res = jsonify({"error" : f"no post with id {id}"})

    res.headers.add('Access-Control-Allow-Origin', '*')
    return res


@app.lib.cron()
def update_links(event):
    posts = []
    titles = []

    resp = requests.get("http://paulgraham.com/articles.html")
    src = BeautifulSoup(resp.text, features="html.parser")

    all_links = src.find_all("a")
    print("successfully scraped all titles")

    blacklist = ["index.html", "rss.html"]
    only_posts = [i for i in all_links if i["href"]
                  not in blacklist and "sep.yimg.com" not in i["href"]]

    for index, tag in enumerate(only_posts):
        name = tag.text
        url = "http://paulgraham.com/" + tag["href"]

        title = {
            'id': index,
            'name': name
        }

        print(f"scraping the body for {tag['href']}")

        post = {
            'id': index,
            'name': name,
            'url':  url,
            'body': str(get_body(url))
        }

        print(f"scraped the body for {tag['href']}")

        titles.append(title)
        posts.append(post)

    json.dump(titles, open("titles.json", "w"))
    json.dump(posts, open("posts.json", "w"))

    return "Successfully updated all posts"

if __name__ == "__main__":
    app.run() 




