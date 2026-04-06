terraform {
  backend "azurerm" {
    resource_group_name  = "tf-state-rg"
    storage_account_name = "tfstatelearningpk1302"
    container_name       = "tfstate"
    key                  = "learning.terraform.tfstate"
  }
}