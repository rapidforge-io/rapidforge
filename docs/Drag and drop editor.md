We build dnd editor in separate react project and embed into rapidforge. Project is located under sitebuilder folder and make build-fe copies the folders into rapidforge static to be served. 

drag and drop editor holds information regarding which items are in canvas. canvas state  is stored in tree structured since some items can include other items then get html with renderToString() and store that information among with canvas state in rapidforge. We basically serve whatever renderToString provides in page


