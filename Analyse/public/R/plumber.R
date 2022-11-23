###############################################################################

# Packages einladen
library(plumber)
library(mapview)
library(terra)
library(caret)
library(raster)
library(RCurl)
library(tiff)
rm(list=ls())

###############################################################################
#* @apiTitle Plumber Example API
#* @apiDescription Plumber example description.
#* Echo back the input
#* @param msg The message to echo
#* @get /echo
function(msg = "") {

    list(msg = paste0("The message is: '", msg, "'"))
  
}

#* Calculates LULC Classification
#* @serializer tiff
#* @get /tiff
function(){
url <- ("http://localhost:3000/images/Kiel.tif")
geotiff_file <- tempfile(fileext='.tif')
httr::GET(url,httr::write_disk(path=geotiff_file))
Kiel <- rast(geotiff_file)
Kiel
}
#* Calculates LULC Classification
#* @serializer png
#* @get /tifftest
function(){

  # Working Directory + Daten einladen
  #############################################################################
  url <- ("http://localhost:3000/images/Kiel.tif")
  geotiff_file <- tempfile(fileext='.tif')
  httr::GET(url,httr::write_disk(path=geotiff_file))
  Kiel <- rast(geotiff_file)
  
  y <- ("http://localhost:3000/images/RFModel2.RDS")
  model <- readRDS(url(y))

  ################################################################################

  #predictors <- c("B02","B03","B04","B08","B05","B06","B07","B11","B12","B8A","NDVI","NDVI_3x3_sd","NDVI_5x5_sd")
  
  #TrainIDs <- createDataPartition(extr$ID,p=0.05,list=FALSE)
  #TrainDat <- extr[TrainIDs,]
  
  #TrainDat <- TrainDat[complete.cases(TrainDat[,predictors]),]
  #model <- train(TrainDat[,predictors],
                # TrainDat$Label,
                 #method="rf",
                 #importance=TRUE,
                 #ntree=10)
  
  ###############################################################################
  
  lvls <- list(levels(model$trainingData$.outcome))
  
  prediction <- predict(as(Kiel,"Raster"),model)
  prediction_terra <- as(prediction,"SpatRaster")
  
  plot(prediction_terra)
}

# Programmatically alter your API
#* @plumber
function(pr) {
    pr %>%
        # Overwrite the default serializer to return unboxed JSON
        pr_set_serializer(serializer_unboxed_json())
}
