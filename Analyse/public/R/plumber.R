library(plumber)
library(rjson)
library(geojsonio)
library(RCurl)
library(ggplot2)
library(dplyr)

#* @apiTitle SUGUC
#* @apiDescription Backend für die Geräuschdaten


#* Plots a Scatterplot
#* @serializer png
#* @get /Scatter
function() {
  
  # Herunterladen der Messungswerte von der OpenSense Api
  Messungen <- read.csv("https://api.opensensemap.org/boxes/data?boxId=60f077874fb91e001c71b3b1&from-date=2022-11-22T08:00:00Z&to-date=2022-11-23T08:00:00Z&phenomenon=Lautst%C3%A4rke")
  str(Messungen)
  # Plotten mit Hilfe von ggplot
  Ausgabe <- ggplot(data = Messungen, aes(x=createdAt, y=value))+
    geom_point()+
    geom_smooth(method=lm, color = 'purple')+
    labs(title = "Scatterplot der Lautstärke",subtitle = "Senden", x = "Zeit der Messung", y = "Lautstärke (Db)")
  
  # Ausgeben des Plots
  print(Ausgabe)
  
}

#* Plots a Scatterplot
#* @serializer png
#* @get /linearRegression
function() {
  
  Messungen <- read.csv("https://api.opensensemap.org/boxes/data?boxId=60f077874fb91e001c71b3b1&from-date=2022-11-22T08:00:00Z&to-date=2022-11-23T08:00:00Z&phenomenon=Lautst%C3%A4rke")
  Messungen$createdAt <- as.POSIXct(Messungen$createdAt,format="%Y-%m-%dT%H:%M:%S",tz=Sys.timezone())
  Mean_Messungen <- Messungen %>%
    mutate(mean_value = mean(value))
  Ausgabe <- ggplot(data = Messungen, aes(x=createdAt, y=value))+
    geom_point(shape = 8, col='green', size = 1.5)+
    geom_line(aes(createdAt,y=Mean_Messungen$mean_value), size=2, col='black')+
    labs(title = "Scatterplot der Lautstärke",subtitle = "Senden", x = "Zeit der Messung", y = "Lautstärke (Db)")
  
  Messungen_ZEIT <- Messungen %>%
    filter(Messungen$createdAt < '2022-11-23 02:26:36')
  
  print(Ausgabe)
 
}

# Programmatically alter your API
#* @plumber
function(pr) {
    pr %>%
        # Overwrite the default serializer to return unboxed JSON
        pr_set_serializer(serializer_unboxed_json())
}
