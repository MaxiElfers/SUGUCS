rm(list = ls())
library(plumber)
library(rjson)
library(geojsonio)
library(RCurl)
library(ggplot2)
library(dplyr)
library(lubridate)
library(hms)

#* @apiTitle SUGUC
#* @apiDescription Backend für die Geräuschdaten

dayPlot <- function(Messungen) {
  Messungen <- Messungen %>%
    mutate(timestamp_utc = ymd_hms(createdAt, tz = 'UTC'),
           timestamp_est = with_tz(timestamp_utc, tz = 'Europe/Berlin'),
           time_est = as_hms(timestamp_est)) %>%
    filter(time_est >= hms::as.hms('07:00:00', tz = 'Europe/Berlin'),
           time_est <= hms::as.hms('19:00:00', tz = 'Europe/Berlin'))
  return(Messungen)
}

nightPlot <- function(Messungen){
  Messungen <- Messungen %>%
    mutate(timestamp_utc = ymd_hms(createdAt, tz = 'UTC'),
           timestamp_est = with_tz(timestamp_utc, tz = 'Europe/Berlin'),
           time_est = as_hms(timestamp_est)) %>%
    filter(time_est >= hms::as.hms('19:00:00', tz = 'Europe/Berlin') 
           | time_est <= hms::as.hms('07:00:00', tz = 'Europe/Berlin'))
  return(Messungen)
}

#boxID <- "60f077874fb91e001c71b3b1"
#from <- "2022-11-22T08:00:00Z"
#to <- "2022-11-23T08:00:00Z"
#phenomenon <- "Lautst%C3%A4rke"
#structurePlot("60f077874fb91e001c71b3b1", "2022-11-22T08:00:00Z", "2022-11-23T08:00:00Z",TRUE, TRUE, TRUE, TRUE)

#* Plottet die Werte nach Wunsch des Kunden
#* @serializer png
#* @get /structurePlot
structurePlot <- function(boxID, from, to, Day, Night, MA, Mean){
  
  # Einladen Der Daten
  openSenseBox <- sprintf("https://api.opensensemap.org/boxes/data?boxId=%s&from-date=%s&to-date=%s&phenomenon=", boxID, from, to)
  openSenseBox <- paste(openSenseBox, "Lautst%C3%A4rke", sep="")
  Messungen <- read.csv(openSenseBox)
  Messungen$createdAt <- as.POSIXct(Messungen$createdAt,format="%Y-%m-%dT%H:%M:%S",tz=Sys.timezone())
  Ausgabe <- ggplot(data = Messungen, aes(x=createdAt, y=value))
  #counter <- 1
  colors <- c("Scatter Plot" = "darkgreen", "Mittelwert" = "darkblue", "Moving Average" = "yellow")
  
  if(Day == TRUE){
    if(Night == TRUE){
      
      print("Kompletter Tag!")
      Ausgabe <- Ausgabe + geom_point(aes(col = "Scatter Plot"), size=0.5)
      #counter <- counter + 1
      
    } else {
      
      print("Nur Tagsüber!")
      Messungen <- dayPlot(Messungen)
      Ausgabe <- ggplot(data = Messungen, aes(x=createdAt, y=value))
      Ausgabe <- Ausgabe + geom_point(aes(col = "Scatter Plot"), size=0.5)
      #counter <- counter + 1
      
    }
  } else {
    if(Night == TRUE){
      
      print("Nur Nachts!")
      Messungen <- nightPlot(Messungen)
      Ausgabe <- ggplot(data = Messungen, aes(x=createdAt, y=value))
      Ausgabe <- Ausgabe + geom_point(aes(col = "Scatter Plot"), size=0.5)
      #counter <- counter + 1
      
    } else {
      
      print("Ungültige Eingabe!")
      stop()
      
    }
  }
  
  if(Mean == TRUE){
    Messungen <- Messungen %>%
      mutate(mean_value = mean(value))
    Ausgabe <- Ausgabe + geom_line(data = Messungen, aes(createdAt,mean_value,col = "Mittelwert"), size=2)
    #counter <- counter + 1
  }
  
  if(MA == TRUE){
    Ausgabe <- Ausgabe + geom_smooth(aes(col = "Moving Average"), method = "loess")
    #counter <- counter + 1
  }
  
  Ausgabe <- Ausgabe + theme_bw()+ theme(
    
    #panel.border = element_blank(),
    #panel.grid.major = element_blank(),
    #panel.grid.minor = element_blank(),
    
    #axis.line = element_line(colour = "black"),
  ) 
  
  Ausgabe <- Ausgabe + labs(x = "Zeitpunkt der Messung", y = "Lautstärke (Db)", color = "Legende")
  Ausgabe <- Ausgabe + scale_color_manual(values = colors)
  print(Ausgabe)
  
  predictionPlot()
}


predictionPlot <- function(){
  
  print("Hello World")
  
  
}


# Programmatically alter your API
#* @plumber
function(pr) {
    pr %>%
        # Overwrite the default serializer to return unboxed JSON
        pr_set_serializer(serializer_unboxed_json())
}
