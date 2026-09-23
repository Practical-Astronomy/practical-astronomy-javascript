default:
	@echo 'Targets:'
	@echo '  test     -- Run unit tests'
	@echo '  publish  -- Publish to the NPM registry'
	@echo '  doc      -- Generate documentation'

test:
	npm test

publish:
	npm publish

doc:
	jsdoc -m -p -r -d=docs/ src/ README.md
