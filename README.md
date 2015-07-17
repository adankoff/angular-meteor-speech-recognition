# angular-meteor-speech-recognition

SpeechRecognition functionality within a reactive meteor-angular app.

# Meteor run local

cd angular-meteor-speech-recognition

meteor

# Demeteorizer

npm install -g demeteorizer

demeteorizer

# Modulus deployment (from demeteorizer folder)

npm install -g modulus

http://blog.modulus.io/deploying-meteor-apps-on-modulus

https://modulus.desk.com/customer/portal/articles/1647770-using-meteor-with-modulus

modulus env set MONGO_URL mongodb://<user>:<pass>@apollo.modulusmongo.net:27017/teny4moM

modulus env set ROOT_URL http://angularmeteorspeechrecognition-49141.onmodulus.net

modulus login --github

modulus deploy

# Mongo install and export/import

brew install mongodb

mongodb://<user>:<pass>@apollo.modulusmongo.net:27017/teny4moM

mongodump -h apollo.modulusmongo.net:27017 -u <user> -p <pass> --authenticationDatabase teny4moM --db teny4moM ~/

http://www.mkyong.com/mongodb/mongodb-import-and-export-example/

mongoexport -h apollo.modulusmongo.net:27017 -u <user> -p <pass> --authenticationDatabase teny4moM --db teny4moM -c parties -o parties.json

mongoimport -h apollo.modulusmongo.net:27017 -u <user> -p <pass> --authenticationDatabase teny4moM --db teny4moM -c parties --file parties.json --upsert