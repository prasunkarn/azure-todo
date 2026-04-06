resource "azurerm_resource_group" rg{
  lifecycle {
    create_before_destroy = true
  }
  
  name = "${local.name}-rg"
  location = local.location

}