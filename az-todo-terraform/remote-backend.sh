#!/bin/bash

# Exit if any command fails

set -e

# Variables (change if needed)

RESOURCE_GROUP="tf-state-rg"
LOCATION="koreacentral"
STORAGE_ACCOUNT="tfstatelearningpk1302"   # must be globally unique
CONTAINER_NAME="tfstate"


echo "📦 Creating Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

echo "💾 Creating Storage Account..."
az storage account create \
--name $STORAGE_ACCOUNT \
--resource-group $RESOURCE_GROUP \
--location $LOCATION \
--sku Standard_LRS

echo "📂 Creating Blob Container..."
az storage container create \
--name $CONTAINER_NAME \
--account-name $STORAGE_ACCOUNT

echo "✅ Terraform remote backend setup complete!"
