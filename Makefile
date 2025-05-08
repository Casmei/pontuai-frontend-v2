.PHONY: generate clean

YAML_URL=https://api-pontuai.kontact.com.br/docs-yaml
YAML_FILE=api.yaml
OUTPUT_DIR=./src/gen

generate: 
	@echo "Baixando o arquivo OpenAPI..."
	curl -sSL $(YAML_URL) -o $(YAML_FILE)
	@echo "Gerando SDK..."
	docker run --rm \
	  -v ${PWD}:/local openapitools/openapi-generator-cli generate \
	  -i /local/$(YAML_FILE) \
	  -g typescript-fetch \
	  -o /local/$(OUTPUT_DIR)
	@echo "SDK gerado em $(OUTPUT_DIR)"

clean:
	@echo "Removendo arquivos gerados..."
	rm -rf $(OUTPUT_DIR) $(YAML_FILE)
	@echo "Arquivos removidos."
