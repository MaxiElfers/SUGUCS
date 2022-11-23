#
# This is a Plumber API. You can run the API by clicking
# the 'Run API' button above.
#
# Find out more about building APIs with Plumber here:
#
#    https://www.rplumber.io/
#
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
 
  x <- fromJSON(readLines(("https://api.opensensemap.org/boxes/60f077874fb91e001c71b3b1?date=2022-11-23T08:17:16.542Z&phenomenon=temperature&format=json")))
  y <- as.data.frame(x)

  z <- y$sensors.lastMeasurement.createdAt
  z[1] <- "2022-11-10T11:00:49.880Z"
  
  z1 <- y$sensors.lastMeasurement.value
  z1[1] <- 10
  
  Ausgabe <- ggplot(data = y, aes(x=z, y=z1))+
    geom_point(col = "green")+
    labs(title = "Scatterplot der Lautstärke",subtitle = "Test2", x = "Zeit der Messung", y = "Lautstärke (Db)")
  print(Ausgabe)
}

# Programmatically alter your API
#* @plumber
function(pr) {
    pr %>%
        # Overwrite the default serializer to return unboxed JSON
        pr_set_serializer(serializer_unboxed_json())
}
