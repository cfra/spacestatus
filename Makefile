CHROMIUM:=chromium
ZIP:=zip

all: extension zip

extension.pem:
	$(CHROMIUM) --pack-extension=extension

extension: extension.pem
	$(CHROMIUM) --pack-extension=extension --pack-extension-key=extension.pem
	echo "Success"

zip:
	zip -r extension.zip extension

clean:
	rm -f extension.crx extension.zip

.PHONY: all extension zip
