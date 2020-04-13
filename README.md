# uidd2020_team

## start
    * switch folder to server
    * use **node index.js** or **npm start** to activate server
    * open **localhost:[port]/[path]** to see the webpage

## structure
    * client
        * public - contains all static files
            * src
                * js
                * style
            * img
            * *.html
    * server
        * routes - define api content for each route
            * authRoutes.js
            * apiRoutes.js
        * index.js - create server
