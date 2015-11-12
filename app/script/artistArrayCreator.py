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

print artistsPerYear

print len(artistsPerYear)

import json
with open("../data/artistsPopularityPerYear", 'w') as csvfile:
    json.dump(artistsPerYear,csvfile)
