#============load data
usefulData <- read.csv("C:/wamp/www/viz/project3/app/data/usefulData.csv")
#===========clean
usefulData$X10<-gsub('[-x]','0',usefulData$X10)
usefulData$X10<-gsub('^$','0',usefulData$X10)

usefulData$X10 <- as.numeric(usefulData$X10)
usefulData$CH <- as.numeric(usefulData$CH)
usefulData$X. <- as.numeric(usefulData$X.)
usefulData$High <- as.numeric(usefulData$High)
#============calculate score
usefulData$score <- usefulData$CH + (usefulData$X10 / usefulData$CH * 10) + (usefulData$X./ usefulData$High)

#=============for each decade group the artist summing their score
library(plyr)

decade = 1950
while(decade<=1990){
  print(decade)
  decadeRows = usefulData$Year<(decade+10) & usefulData$Year>=decade
  subset = usefulData[decadeRows,c('Artist','score')]
  h<-ddply(subset,~Artist,transform,sum=sum(score))
  k<-h[!duplicated(h$Artist),colnames(h)!='score']
  z<-k[order(-k$sum),]
  rownames(z) <- 1:nrow(z)
  assign(paste(as.character(decade),'artist',sep=''),z)
  write.table(z[1:10,], file = paste(as.name(decade),"artist.csv",sep=''),sep=",",row.names=FALSE)
  decade = decade +10
}

