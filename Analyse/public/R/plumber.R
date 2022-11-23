install.packages('RCurl')
install.packages('plumber')
install.packages('rjson')
install.packages('geojsonio')
install.packages('ggplot2')
library(plumber)
library(rjson)
library(geojsonio)
library(RCurl)
library(ggplot2)


#* @apiTitle Plumber Example API
#* @apiDescription Plumber example description.

#* Echo back the input
#* @param msg The message to echo
#* @get /echo
function(msg = "") {
    list(msg = paste0("The message is: '", msg, "'"))
}

#* Plot a histogram
#* @serializer png
#* @get /plot
function() {
    rand <- rnorm(100)
    hist(rand)
}

#* Plots a Scatterplot
#* @serializer png
#* @get /Scatter
function() {
  
  # Herunterladen der Messungswerte von der OpenSense Api
  Messungen <- read.csv("https://api.opensensemap.org/boxes/data?boxId=60f077874fb91e001c71b3b1&from-date=2022-11-22T08:00:00Z&to-date=2022-11-23T08:00:00Z&phenomenon=Lautst%C3%A4rke")
  
  # Plotten mit Hilfe von ggplot
  Ausgabe <- ggplot(data = Messungen, aes(x=createdAt, y=value))+
    geom_point(col = "green")+
    labs(title = "Scatterplot der Lautstärke",subtitle = "Test2", x = "Zeit der Messung", y = "Lautstärke (Db)")
  
  # Ausgeben des Plots
  print(Ausgabe)
  
}

# Programmatically alter your API
#* @plumber
function(pr) {
    pr %>%
        # Overwrite the default serializer to return unboxed JSON
        pr_set_serializer(serializer_unboxed_json())
}
