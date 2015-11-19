__author__ = 'Filippo'


import csv

artistsPerYear = {}

for i in range(1940,2011):
    with open("../data/genresByYear/"+str(i)+'Genres.csv', 'rb') as csvfile:
        year=[]
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        spamreader.next()
        for row in spamreader:
            if row[0] != "Artist":
                year.append({"name":row[0].decode('latin-1').encode("utf-8"),"value":row[1]})
        artistsPerYear[i]=year



decadeForTop = {}
topTen = []
for i in [1940,1950,1960,1970,1980,1990,2000]:
    with open("../data/GenresByDecade/"+str(i)+'sGenres.csv', 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        spamreader.next()
        j = 0
        for row in spamreader:
            j+=1
            if j<11:
                topTen.append(row[0])
                decadeForTop[row[0]]=i

print topTen
print len(topTen)

res=[]
perArtist = {}

for i in artistsPerYear.keys():
    yearArray = artistsPerYear[i]
    for art in yearArray:
        if art["name"] in topTen:
            if not(art["name"] in perArtist.keys()):
                perArtist[art["name"]]=[]
            res.append({"name":art["name"],"value":art["value"],"date":str(i),"decade":decadeForTop[art["name"]]})
''
for i in perArtist.keys():
    res.append(perArtist[i])

import json
with open("../data/genresStaticData.js", 'w') as csvfile:
    json.dump(res,csvfile)
