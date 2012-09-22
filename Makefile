CHROMIUM:=chromium
ZIP:=zip

all: extension zip

extension:
	$(CHROMIUM) --pack-extension=extension --pack-extension-key=extension.pem
	echo "Success"

zip:
	zip -r extension.zip extension

clean:
	rm -f extension.crx extension.zip

.PHONY: all extension zip
