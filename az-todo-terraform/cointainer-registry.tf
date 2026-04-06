resource "azurerm_container_registry" "acr" {
  name                = "${local.name}-acr"
  resource_group_name = azurerm_resource_group.rg.name
  location            = local.location
  sku                 = "Premium"
  admin_enabled       = false
  georeplications {
    location                = "East US"
    zone_redundancy_enabled = true
    tags                    = {}
  }
  georeplications {
    location                = "North Europe"
    zone_redundancy_enabled = true
    tags                    = {}
  }
}