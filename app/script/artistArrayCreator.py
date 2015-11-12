__author__ = 'Filippo'


import csv

artists = []

for i in range(1940,2000):
    with open("../data/bestArtistsByYear/"+str(i)+'artist.csv', 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for row in spamreader:
            if row[0] != "Artist":
                artists.append(row[0])

print artists
print len(artists)