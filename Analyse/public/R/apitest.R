library(plumber)
setwd("C:/Users/lucah/OneDrive/Desktop/Rnode/firstPlumberApi")
pr("plumber2.R") %>%
  pr_run(port=8000)
