library(plumber)
setwd("C:/Users/lucah/OneDrive/Desktop/Rnode/firstPlumberApi")
pr("plumber.R") %>%
  pr_run(port=8000)
