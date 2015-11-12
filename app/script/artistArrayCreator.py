__author__ = 'Filippo'


import csv

artistsPerYear = {}

for i in range(1940,2000):
    with open("../data/bestArtistsByYear/"+str(i)+'artist.csv', 'rb') as csvfile:
        year=[]
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        spamreader.next()
        for row in spamreader:
            if row[0] != "Artist":
                year.append({"name":row[0].decode('latin-1').encode("utf-8"),"value":row[1]})
        artistsPerYear[i]=year



topTen = []
for i in range(4,10):
    with open("../data/bestArtistsByDecade/19"+str(i)+'0sArtist.csv', 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        spamreader.next()
        j = 0
        for row in spamreader:
            j+=1
            if j<11:
                topTen.append(row[0])

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
            perArtist[art["name"]].append({"name":art["name"],"value":art["value"],"year":i})

for i in perArtist.keys():
    res.append(perArtist[i])

import json
with open("../data/artistsStaticData", 'w') as csvfile:
    json.dump(res,csvfile)
