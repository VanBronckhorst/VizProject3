__author__ = 'Umberto'


import requests, json

musicGraphKey = 'b9ae99ef9698a8c2531b22073231d4b7'
link = 'http://api.musicgraph.com/api/v2/artist/search?api_key=b9ae99ef9698a8c2531b22073231d4b7&decade=1910s&limit=100&offset=1'
github_url = "https://api.github.com/user/repos"
data = json.dumps({'name':'test', 'description':'some test repo'})
a=requests.get(link )
a.json()
a.text.decode("unicode", "ignore")

text_file = open("Output.txt", "w")
text_file.write("%s" % a.json())
text_file.close()

import codecs
codecs.decode(a.text, 'unicode_escape')

a.text.replace("\\","\\")

b='a\ b'
str(a.text, 'latin-1')

title = a.text
import unicodedata
unicodedata.normalize('NFKD', title).encode('ascii','ignore')

str = '\\\\'
ustr_to_load = unicode(a.text, 'latin-1')
converted = str("your_string", encoding="utf-8", errors="ignore")
json.loads(ustr_to_load)
a.status_code
a.encoding
a.text.decode('unicode')
h=a.text.encode('latin-1')
h.json()
t= a.text
json.loads(a.text[0:1000])
json.load(a)
json.loads('["foo", {"bar":["baz", null, 1.0, 2]}]')

a.text
r = requests.post(github_url, data, auth=('user', '*****'))


import sys
sys.getdefaultencoding()
sys.getfilesystemencoding()

r = requests.get('https://github.com/timeline.json')
r.json()
r.text
def whatisthis(s):
    if isinstance(s, str):
        print ("ordinary string")
    elif isinstance(s, unicode):
        print ("unicode string")
    else:
        print ("not a string")

