variable "name"{
  default = "todo"
}

variable "location"{
  default = "koreacentral"
}

locals {
  location = var.location
  name = var.name
}